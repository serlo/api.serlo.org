import * as serloAuth from '@serlo/authorization'
import { instanceToScope, Scope } from '@serlo/authorization'
import { array as A, either as E, function as F, option as O } from 'fp-ts'
import * as t from 'io-ts'
import * as R from 'ramda'

import * as DatabaseLayer from '../../../model/database-layer'
import { createCachedResolver } from '~/cached-resolver'
import { Context } from '~/context'
import {
  addContext,
  assertAll,
  captureErrorEvent,
  consumeErrorEvent,
  ErrorEvent,
} from '~/error-event'
import { UserInputError } from '~/errors'
import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
  generateRole,
  isGlobalRole,
} from '~/internals/graphql'
import { CellValues, MajorDimension } from '~/model'
import { EntityDecoder, RevisionDecoder, UserDecoder } from '~/model/decoder'
import {
  getPermissionsForRole,
  getRolesWithInheritance,
} from '~/schema/authorization/roles'
import { resolveScopedRoles } from '~/schema/authorization/utils'
import { resolveConnection } from '~/schema/connection/utils'
import { resolveEvents } from '~/schema/notification/resolvers'
import { createThreadResolvers } from '~/schema/thread/utils'
import { createUuidResolvers } from '~/schema/uuid/abstract-uuid/utils'
import { Instance, Resolvers } from '~/types'

export const activeUserIdsQuery = createCachedResolver<
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
    async potentialSpamUsers(_parent, payload, { dataSources }) {
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
          dataSources.model.serlo.getUuidWithCustomDecoder({
            id,
            decoder: UserDecoder,
          }),
        ),
      )

      return resolveConnection({
        nodes: users,
        payload: { first },
        createCursor: (node) => node.id.toString(),
      })
    },
    async usersByRole(_parent, payload, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const { instance = null, role } = payload

      let scope: Scope = Scope.Serlo

      if (!isGlobalRole(role)) {
        assertInstanceIsSet(instance)
        scope = instanceToScope(instance)
      }

      await assertUserIsAuthorized({
        userId,
        guard: serloAuth.User.getUsersByRole(scope),
        message: 'You are not allowed to search roles.',
        dataSources,
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
          dataSources.model.serlo.getUuidWithCustomDecoder({
            id,
            decoder: UserDecoder,
          }),
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
    async userByUsername(_parent, payload, { dataSources }) {
      if (!payload.username)
        throw new UserInputError('`username` is not provided')

      const alias = {
        path: `/user/profile/${payload.username}`,
        instance: Instance.De, // should not matter
      }
      const uuid = (await dataSources.model.serlo.getAlias(alias))?.id

      if (!uuid) return null

      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: uuid,
        decoder: t.union([UserDecoder, t.null]),
      })
    },
  },
  User: {
    ...createUuidResolvers(),
    ...createThreadResolvers(),
    eventsByUser(user, payload, { dataSources }) {
      return resolveEvents({
        payload: { ...payload, actorId: user.id },
        dataSources,
      })
    },
    async motivation(user, _args, { dataSources }) {
      return F.pipe(
        await dataSources.model.googleSpreadsheetApi.getValues({
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
      const ids = await activeUserIdsQuery.resolve({}, context)
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
    async unrevisedEntities(user, payload, { dataSources }) {
      const { unrevisedEntityIds } =
        await dataSources.model.serlo.getUnrevisedEntities()
      const unrevisedEntitiesAndRevisions = await Promise.all(
        unrevisedEntityIds.map((id) =>
          dataSources.model.serlo
            .getUuidWithCustomDecoder({
              id,
              decoder: EntityDecoder,
            })
            .then(async (unrevisedEntity) => {
              const unrevisedRevisionIds = unrevisedEntity.revisionIds.filter(
                (revisionId) =>
                  unrevisedEntity.currentRevisionId === null ||
                  revisionId > unrevisedEntity.currentRevisionId,
              )
              const unrevisedRevisions = await Promise.all(
                unrevisedRevisionIds.map((id) =>
                  dataSources.model.serlo.getUuidWithCustomDecoder({
                    id,
                    decoder: RevisionDecoder,
                  }),
                ),
              )

              return [unrevisedEntity, unrevisedRevisions] as const
            }),
        ),
      )
      const unrevisedEntitiesByUser = unrevisedEntitiesAndRevisions
        .filter(([_, unrevisedRevisions]) =>
          unrevisedRevisions.some((revision) => revision.authorId === user.id),
        )
        .map(([unrevisedEntity, _]) => unrevisedEntity)

      return resolveConnection({
        nodes: unrevisedEntitiesByUser,
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
    async addRole(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const { role, instance = null, username } = input

      let scope: Scope = Scope.Serlo

      if (!isGlobalRole(role)) {
        assertInstanceIsSet(instance)
        scope = instanceToScope(instance)
      }

      await assertUserIsAuthorized({
        userId,
        guard: serloAuth.User.addRole(scope),
        message: 'You are not allowed to add roles.',
        dataSources,
      })

      await dataSources.model.serlo.addRole({
        username,
        roleName: generateRole(role, instance),
      })

      return { success: true, query: {} }
    },

    async deleteBots(
      _parent,
      { input },
      { dataSources, userId, authServices },
    ) {
      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        userId,
        guard: serloAuth.User.deleteBot(serloAuth.Scope.Serlo),
        message: 'You are not allowed to delete bots',
        dataSources,
      })

      const { botIds } = input
      const users = await Promise.all(
        botIds.map((botId) => dataSources.model.serlo.getUuid({ id: botId })),
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

      const { success, emailHashes } = await dataSources.model.serlo.deleteBots(
        { botIds },
      )
      await Promise.all(
        botIds.map(
          async (botId) => await deleteKratosUser(botId, authServices),
        ),
      )
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

      return { success, query: {} }
    },

    async deleteRegularUser(
      _parent,
      { input },
      { dataSources, authServices, userId },
    ) {
      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        userId,
        guard: serloAuth.User.deleteRegularUser(serloAuth.Scope.Serlo),
        message: 'You are not allowed to delete users',
        dataSources,
      })

      const { id, username } = input
      const user = await dataSources.model.serlo.getUuid({ id: input.id })

      if (!UserDecoder.is(user) || user.username !== username) {
        throw new UserInputError(
          '`id` does not belong to a user or `username` does not match the `user`',
        )
      }

      const result = await dataSources.model.serlo.deleteRegularUsers({
        userId: id,
      })

      if (result.success) await deleteKratosUser(id, authServices)
      return { success: result.success, query: {} }
    },

    async removeRole(_parent, { input }, context) {
      const { dataSources, userId, database } = context
      assertUserIsAuthenticated(userId)

      const { role, instance = null, username } = input

      let scope: Scope = Scope.Serlo

      if (!isGlobalRole(role)) {
        assertInstanceIsSet(instance)
        scope = instanceToScope(instance)
      }

      await assertUserIsAuthorized({
        userId,
        guard: serloAuth.User.removeRole(scope),
        message: 'You are not allowed to remove roles.',
        dataSources,
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

      const alias = (await DatabaseLayer.makeRequest('AliasQuery', {
        instance: Instance.De,
        path: `user/profile/${username}`,
      })) as { id: number }

      await dataSources.model.serlo.getUuid._querySpec.setCache({
        payload: { id: alias.id },
        getValue(current) {
          if (!current) return
          if (!UserDecoder.is(current)) return

          if (!current.roles.includes(roleName)) return current
          current.roles = current.roles.filter(
            (currentRole) => currentRole !== roleName,
          )
          return current
        },
      })

      return { success: true, query: {} }
    },

    async setDescription(_parent, { input }, context) {
      const { dataSources, userId, database } = context
      assertUserIsAuthenticated(userId)
      if (input.description.length >= 64 * 1024) {
        throw new UserInputError('description too long')
      }
      await database.mutate('update user set description = ? where id = ?', [
        input.description,
        userId,
      ])
      await dataSources.model.serlo.getUuid._querySpec.setCache({
        payload: { id: userId },
        getValue(current) {
          if (!current) return

          return { ...current, description: input.description }
        },
      })
      return { success: true, query: {} }
    },

    async setEmail(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        userId,
        guard: serloAuth.User.setEmail(serloAuth.Scope.Serlo),
        message: 'You are not allowed to change the E-mail address for a user',
        dataSources,
      })

      const result = await dataSources.model.serlo.setEmail(input)

      return { ...result, query: {} }
    },
  },
}

async function activeDonorIDs({ dataSources }: Context) {
  return F.pipe(
    await dataSources.model.googleSpreadsheetApi.getValues({
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
