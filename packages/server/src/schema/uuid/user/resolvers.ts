import * as serloAuth from '@serlo/authorization'
import { instanceToScope, Scope } from '@serlo/authorization'
import { createHash } from 'crypto'
import { array as A, either as E, function as F, option as O } from 'fp-ts'
import * as t from 'io-ts'
import * as R from 'ramda'

import { resolveUnrevisedEntityIds } from '../abstract-entity/resolvers'
import { UuidResolver } from '../abstract-uuid/resolvers'
import { createCachedResolver } from '~/cached-resolver'
import { Context } from '~/context'
import {
  addContext,
  assertAll,
  captureErrorEvent,
  consumeErrorEvent,
  ErrorEvent,
} from '~/error-event'
import { ForbiddenError, UserInputError } from '~/errors'
import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
  generateRole,
  isGlobalRole,
} from '~/internals/graphql'
import { CellValues, MajorDimension } from '~/model'
import { EntityDecoder, UserDecoder } from '~/model/decoder'
import {
  getPermissionsForRole,
  getRolesWithInheritance,
} from '~/schema/authorization/roles'
import { resolveScopedRoles } from '~/schema/authorization/utils'
import { resolveConnection } from '~/schema/connection/utils'
import { createThreadResolvers } from '~/schema/thread/utils'
import { createUuidResolvers } from '~/schema/uuid/abstract-uuid/utils'
import { Instance, Resolvers } from '~/types'

export const ActiveUserIdsResolver = createCachedResolver<
  Record<string, never>,
  number[]
>({
  name: 'ActiveUserIdsQuery',
  decoder: t.array(t.number),
  enableSwr: true,
  staleAfter: { hours: 3 },
  maxAge: { days: 3 },
  getKey: () => {
    return 'user/active-user-ids'
  },
  getPayload: (key) => {
    return key === 'user/active-user-ids' ? O.some({}) : O.none
  },
  async getCurrentValue(_args, { database, timer }) {
    const rows = await database.fetchAll<{ id: number }>(
      `
        SELECT u.id
        FROM user u
        JOIN event_log e ON u.id = e.actor_id
        WHERE e.event_id = 5 AND e.date > DATE_SUB(?, Interval 90 day)
        GROUP BY u.id
        HAVING count(e.event_id) > 10
      `,
      [new Date(timer.now()).toISOString()],
    )

    return rows.map((x) => x.id)
  },
  examplePayload: {},
})

export const resolvers: Resolvers = {
  Query: {
    user: createNamespace(),
  },
  UserQuery: {
    async potentialSpamUsers(_parent, payload, context) {
      const { dataSources } = context
      const first = payload.first ?? 10
      const after = payload.after
        ? parseInt(Buffer.from(payload.after, 'base64').toString())
        : null

      if (Number.isNaN(after))
        throw new UserInputError('`after` is an illegal id')

      if (first > 500)
        throw new UserInputError('`first` must be smaller than 500')

      const { userIds } = await dataSources.model.serlo.getPotentialSpamUsers({
        first: first + 1,
        after,
      })
      const users = await Promise.all(
        userIds.map((id) =>
          UuidResolver.resolveWithDecoder(UserDecoder, { id }, context),
        ),
      )

      return resolveConnection({
        nodes: users,
        payload: { first },
        createCursor: (node) => node.id.toString(),
      })
    },
    async usersByRole(_parent, payload, context) {
      const { dataSources, userId } = context
      assertUserIsAuthenticated(userId)

      const { instance = null, role } = payload

      let scope: Scope = Scope.Serlo

      if (!isGlobalRole(role)) {
        assertInstanceIsSet(instance)
        scope = instanceToScope(instance)
      }

      await assertUserIsAuthorized({
        guard: serloAuth.User.getUsersByRole(scope),
        message: 'You are not allowed to search roles.',
        context,
      })

      const first = payload.first ?? 100
      const after = payload.after
        ? parseInt(Buffer.from(payload.after, 'base64').toString())
        : undefined

      if (Number.isNaN(after))
        throw new UserInputError('`after` is an illegal id')

      const { usersByRole } = await dataSources.model.serlo.getUsersByRole({
        roleName: generateRole(role, instance),
        first: first + 1,
        after,
      })

      const users = await Promise.all(
        usersByRole.map((id: number) =>
          UuidResolver.resolveWithDecoder(UserDecoder, { id }, context),
        ),
      )
      const userConnection = resolveConnection({
        nodes: users,
        payload: { first },
        createCursor: (node) => node.id.toString(),
      })

      return {
        ...userConnection,
        permissions: getPermissionsForRole(role),
        inheritance: getRolesWithInheritance([role]),
      }
    },
    async userByUsername(_parent, payload, context) {
      if (!payload.username)
        throw new UserInputError('`username` is not provided')

      const id = await resolveIdFromUsername(payload.username, context)

      if (!id) return null

      return await UuidResolver.resolveWithDecoder(
        t.union([UserDecoder, t.null]),
        { id },
        context,
      )
    },
  },
  User: {
    ...createUuidResolvers(),
    ...createThreadResolvers(),
    async motivation(user, _args, context) {
      return F.pipe(
        await context.dataSources.model.googleSpreadsheetApi.getValues({
          spreadsheetId: process.env.GOOGLE_SPREADSHEET_API_MOTIVATION,
          range: 'Formularantworten!B:D',
        }),
        E.mapLeft(addContext({ location: 'motivationSpreadsheet' })),
        E.getOrElse(consumeErrorEvent([] as string[][])),
        A.findLast(
          (row) =>
            row.length >= 3 && row[1] === user.username && row[2] === 'yes',
        ),
        O.chain(A.head),
        O.getOrElse(R.always(null as null | string)),
      )
    },
    async chatUrl(user, _args, { dataSources }) {
      const isRegistered = (
        await dataSources.model.chat.getUsersInfo({ username: user.username })
      ).success

      return isRegistered
        ? `https://community.serlo.org/direct/${user.username}`
        : null
    },
    async isActiveAuthor(user, _args, context) {
      const ids = await ActiveUserIdsResolver.resolve({}, context)
      return ids.includes(user.id)
    },
    async isActiveDonor(user, _args, context) {
      const ids = await activeDonorIDs(context)

      return ids.includes(user.id)
    },
    async isActiveReviewer(user, _args, { dataSources }) {
      return (await dataSources.model.serlo.getActiveReviewerIds()).includes(
        user.id,
      )
    },
    async isNewAuthor(user, _args, { dataSources }) {
      const { edits } = await dataSources.model.serlo.getActivityByType({
        userId: user.id,
      })

      return edits < 5
    },
    async unrevisedEntities(user, payload, context) {
      const unrevisedEntityIds = await resolveUnrevisedEntityIds(
        { userId: user.id },
        context,
      )
      const unrevisedEntities = await Promise.all(
        unrevisedEntityIds.map((id) =>
          UuidResolver.resolveWithDecoder(EntityDecoder, { id }, context),
        ),
      )

      return resolveConnection({
        nodes: unrevisedEntities,
        payload,
        createCursor: (node) => node.id.toString(),
      })
    },
    imageUrl(user) {
      return `https://community.serlo.org/avatar/${user.username}`
    },
    async activityByType(user, _args, { dataSources }) {
      return await dataSources.model.serlo.getActivityByType({
        userId: user.id,
      })
    },
    roles(user, payload) {
      return resolveConnection({
        nodes: resolveScopedRoles(user),
        payload,
        createCursor(node) {
          return node.scope + node.role
        },
      })
    },
    language(user, _, { dataSources }) {
      return dataSources.model.kratos.getUserLanguage({ userLegacyId: user.id })
    },
    lastLogin(user, _, { dataSources, userId }) {
      try {
        assertUserIsAuthenticated(userId)
      } catch {
        return null
      }

      return dataSources.model.kratos.getLastLogin({ username: user.username })
    },
  },
  Mutation: {
    user: createNamespace(),
  },
  UserMutation: {
    async addRole(_parent, { input }, context) {
      const { database, userId } = context
      assertUserIsAuthenticated(userId)

      const { role, instance = null, username } = input

      let scope: Scope = Scope.Serlo

      if (!isGlobalRole(role)) {
        assertInstanceIsSet(instance)
        scope = instanceToScope(instance)
      }

      await assertUserIsAuthorized({
        guard: serloAuth.User.addRole(scope),
        message: 'You are not allowed to add roles.',
        context,
      })

      const id = await resolveIdFromUsername(username, context)

      if (id == null) {
        throw new UserInputError('no user with given username')
      }
      await database.mutate(
        `
        INSERT INTO role (name)
        SELECT ?
        WHERE NOT EXISTS (
          SELECT 1
          FROM role
          WHERE name = ?
        )
        `,
        [generateRole(role, instance), generateRole(role, instance)],
      )

      await database.mutate(
        `
        INSERT INTO role_user (user_id, role_id)
        SELECT ?, role.id
        FROM role
        WHERE role.name = ?
        AND NOT EXISTS (
          SELECT 1
          FROM role_user
          WHERE role_user.user_id = ?
          AND role_user.role_id = role.id
        )
        `,
        [id, generateRole(role, instance), id],
      )

      await UuidResolver.removeCacheEntry({ id }, context)

      return { success: true, query: {} }
    },

    async deleteBots(_parent, { input }, context) {
      const { database, dataSources, userId, authServices } = context
      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        guard: serloAuth.User.deleteBot(serloAuth.Scope.Serlo),
        message: 'You are not allowed to delete bots',
        context,
      })

      const { botIds } = input
      const users = await Promise.all(
        botIds.map((id) => UuidResolver.resolve({ id }, context)),
      )

      if (!t.array(UserDecoder).is(users))
        throw new UserInputError('not all bots are users')

      const activities = await Promise.all(
        botIds.map((userId) =>
          dataSources.model.serlo.getActivityByType({ userId }),
        ),
      )

      if (activities.some((activity) => activity.edits >= 5))
        throw new UserInputError(
          'One user has more than 4 edits. Is it really a spam account? Please inform the dev team.',
        )

      if (process.env.ENVIRONMENT === 'production') {
        for (const user of users) {
          const chatDeleteResult = await dataSources.model.chat.deleteUser({
            username: user.username,
          })

          if (
            chatDeleteResult.success === false &&
            chatDeleteResult.errorType !== 'error-invalid-user'
          ) {
            captureErrorEvent({
              error: new Error('Cannot delete a user from community.serlo.org'),
              errorContext: { user, chatDeleteResult },
            })
          }
        }
      }

      const emailHashes: string[] = []

      interface User {
        email: string
      }

      for (const botId of botIds) {
        const transaction = await database.beginTransaction()
        try {
          const user: User | null = await database.fetchOptional(
            `SELECT email FROM user WHERE id = ?`,
            [botId],
          )

          if (user) {
            const hash = createHash('md5').update(user.email).digest('hex')
            emailHashes.push(hash)
          }

          await database.mutate(
            `DELETE FROM uuid WHERE id = ? AND discriminator = 'user'`,
            [botId],
          )

          await UuidResolver.removeCacheEntry({ id: botId }, context)

          await deleteKratosUser(botId, authServices)

          await transaction.commit()
        } catch (error) {
          await transaction.rollback()
          throw error
        }
      }
      if (process.env.ENVIRONMENT === 'production') {
        for (const emailHash of emailHashes) {
          const result =
            await dataSources.model.mailchimp.deleteEmailPermanently({
              emailHash,
            })

          if (result.success === false) {
            const { mailchimpResponse } = result

            captureErrorEvent({
              error: new Error('Cannot delete user from mailchimp'),
              errorContext: { emailHash, mailchimpResponse },
            })
          }
        }
      }

      return { success: true, query: {} }
    },

    async deleteRegularUser(_parent, { input }, context) {
      const { database, authServices, userId } = context
      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        guard: serloAuth.User.deleteRegularUser(serloAuth.Scope.Serlo),
        message: 'You are not allowed to delete users',
        context,
      })

      const { id, username } = input
      const user = await UuidResolver.resolve({ id: input.id }, context)
      const idUserDeleted = 4

      if (!UserDecoder.is(user) || user.username !== username) {
        throw new UserInputError(
          '`id` does not belong to a user or `username` does not match the `user`',
        )
      }
      if (id === idUserDeleted) {
        throw new ForbiddenError('You cannot delete the user Deleted.')
      }

      const transaction = await database.beginTransaction()
      try {
        await Promise.all([
          database.mutate(
            'UPDATE comment SET author_id = ? WHERE author_id = ?',
            [idUserDeleted, id],
          ),
          database.mutate(
            'UPDATE entity_revision SET author_id = ? WHERE author_id = ?',
            [idUserDeleted, id],
          ),
          database.mutate(
            'UPDATE event_log SET actor_id = ? WHERE actor_id = ?',
            [idUserDeleted, id],
          ),
          database.mutate(
            'UPDATE page_revision SET author_id = ? WHERE author_id = ?',
            [idUserDeleted, id],
          ),
          database.mutate('DELETE FROM notification WHERE user_id = ?', [id]),
          database.mutate('DELETE FROM role_user WHERE user_id = ?', [id]),
          database.mutate('DELETE FROM subscription WHERE user_id = ?', [id]),
          database.mutate('DELETE FROM subscription WHERE uuid_id = ?', [id]),
          database.mutate(
            "DELETE FROM uuid WHERE id = ? and discriminator = 'user'",
            [id],
          ),
        ])

        await UuidResolver.removeCacheEntry({ id }, context)

        await deleteKratosUser(id, authServices)

        await transaction.commit()
      } finally {
        await transaction.rollback()
      }

      return { success: true, query: {} }
    },

    async removeRole(_parent, { input }, context) {
      const { userId, database } = context
      assertUserIsAuthenticated(userId)

      const { role, instance = null, username } = input

      let scope: Scope = Scope.Serlo

      if (!isGlobalRole(role)) {
        assertInstanceIsSet(instance)
        scope = instanceToScope(instance)
      }

      await assertUserIsAuthorized({
        guard: serloAuth.User.removeRole(scope),
        message: 'You are not allowed to remove roles.',
        context,
      })

      const roleName = generateRole(role, instance)
      await database.mutate(
        `
        DELETE role_user
        FROM role_user
        JOIN role ON role_user.role_id = role.id
        JOIN user ON role_user.user_id = user.id
        WHERE role.name = ? AND user.username = ?
        `,
        [roleName, username],
      )

      const changedId = await resolveIdFromUsername(username, context)

      if (changedId != null) {
        await UuidResolver.removeCacheEntry({ id: changedId }, context)
      }

      return { success: true, query: {} }
    },

    async setDescription(_parent, { input }, context) {
      const { userId, database } = context
      assertUserIsAuthenticated(userId)
      if (input.description.length >= 64 * 1024) {
        throw new UserInputError('description too long')
      }
      await database.mutate('UPDATE user SET description = ? WHERE id = ?', [
        input.description,
        userId,
      ])
      await UuidResolver.removeCacheEntry({ id: userId }, context)
      return { success: true, query: {} }
    },
  },
}

export async function resolveIdFromUsername(
  username: string,
  { database }: Pick<Context, 'database'>,
): Promise<number | null> {
  const result = await database.fetchOptional<{ id: number }>(
    `SELECT id FROM user WHERE username = ?`,
    [username],
  )
  return result?.id ?? null
}

async function activeDonorIDs(context: Context) {
  return F.pipe(
    await context.dataSources.model.googleSpreadsheetApi.getValues({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_API_ACTIVE_DONORS,
      range: 'Tabellenblatt1!A:A',
      majorDimension: MajorDimension.Columns,
    }),
    extractIDsFromFirstColumn,
  )
}

function extractIDsFromFirstColumn(
  columns: E.Either<ErrorEvent, CellValues>,
): number[] {
  return F.pipe(
    columns,
    E.map((columns) => R.head(columns)),
    E.chain(
      E.fromNullable<ErrorEvent>({
        error: new Error('no columns in selected range'),
      }),
    ),
    E.map((rows) => rows.slice(1).map(R.trim)),
    E.map((rows) => rows.filter((row) => row)),
    E.map(
      assertAll({
        assertion: (entry) => /^\d+$/.test(entry),
        error: new Error('invalid entry in activeDonorSpreadsheet'),
      }),
    ),
    E.map(A.map((entry) => Number(entry))),
    E.mapLeft(addContext({ location: 'activeDonorSpreadsheet' })),
    E.getOrElse(consumeErrorEvent([] as number[])),
  )
}

function assertInstanceIsSet(instance: Instance | null) {
  if (!instance) {
    throw new UserInputError(
      "This role can't have a global scope: `instance` has to be declared.",
    )
  }
}
async function deleteKratosUser(
  userId: number,
  authServices: Context['authServices'],
) {
  const identity = await authServices.kratos.db.getIdentityByLegacyId(userId)

  if (identity) {
    await authServices.kratos.admin.deleteIdentity({ id: identity.id })
  }
}
