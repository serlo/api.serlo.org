/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2023 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020-2023 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import * as serloAuth from '@serlo/authorization'
import { instanceToScope, Scope } from '@serlo/authorization'
import { UserInputError } from 'apollo-server'
import { array as A, either as E, function as F, option as O } from 'fp-ts'
import * as t from 'io-ts'
import R from 'ramda'

import { ModelDataSource } from '~/internals/data-source'
import {
  addContext,
  assertAll,
  captureErrorEvent,
  consumeErrorEvent,
  ErrorEvent,
} from '~/internals/error-event'
import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  Context,
  createNamespace,
  generateRole,
  isGlobalRole,
  LegacyQueries,
  Model,
  Mutations,
  Queries,
  TypeResolvers,
} from '~/internals/graphql'
import {
  DiscriminatorType,
  EntityDecoder,
  RevisionDecoder,
  UserDecoder,
} from '~/model/decoder'
import { CellValues, MajorDimension } from '~/model/google-spreadsheet-api'
import {
  getPermissionsForRole,
  getRolesWithInheritance,
} from '~/schema/authorization/roles'
import { resolveScopedRoles } from '~/schema/authorization/utils'
import { ConnectionPayload } from '~/schema/connection/types'
import { resolveConnection } from '~/schema/connection/utils'
import { resolveEvents } from '~/schema/notification/resolvers'
import { createThreadResolvers } from '~/schema/thread/utils'
import { createUuidResolvers } from '~/schema/uuid/abstract-uuid/utils'
import { Instance, User } from '~/types'

export const resolvers: LegacyQueries<
  'activeAuthors' | 'activeReviewers' | 'activeDonors'
> &
  TypeResolvers<User> &
  Queries<'user'> &
  Mutations<'user'> = {
  Query: {
    async activeAuthors(_parent, payload, context) {
      return resolveUserConnectionFromIds({
        ids: await context.dataSources.model.serlo.getActiveAuthorIds(),
        payload,
        context,
      })
    },
    async activeDonors(_parent, payload, context) {
      return resolveUserConnectionFromIds({
        ids: await activeDonorIDs(context),
        payload,
        context,
      })
    },
    async activeReviewers(_parent, payload, context) {
      return resolveUserConnectionFromIds({
        ids: await context.dataSources.model.serlo.getActiveReviewerIds(),
        payload,
        context,
      })
    },
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
          })
        )
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
          })
        )
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
            row.length >= 3 && row[1] === user.username && row[2] === 'yes'
        ),
        O.chain(A.head),
        O.getOrElse(R.always(null as null | string))
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
    async isActiveAuthor(user, _args, { dataSources }) {
      return (await dataSources.model.serlo.getActiveAuthorIds()).includes(
        user.id
      )
    },
    async isActiveDonor(user, _args, context) {
      const ids = await activeDonorIDs(context)

      return ids.includes(user.id)
    },
    async isActiveReviewer(user, _args, { dataSources }) {
      return (await dataSources.model.serlo.getActiveReviewerIds()).includes(
        user.id
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
                  revisionId > unrevisedEntity.currentRevisionId
              )
              const unrevisedRevisions = await Promise.all(
                unrevisedRevisionIds.map((id) =>
                  dataSources.model.serlo.getUuidWithCustomDecoder({
                    id,
                    decoder: RevisionDecoder,
                  })
                )
              )

              return [unrevisedEntity, unrevisedRevisions] as const
            })
        )
      )
      const unrevisedEntitiesByUser = unrevisedEntitiesAndRevisions
        .filter(([_, unrevisedRevisions]) =>
          unrevisedRevisions.some((revision) => revision.authorId === user.id)
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

      return { success: true }
    },

    async deleteBots(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        userId,
        guard: serloAuth.User.deleteBot(serloAuth.Scope.Serlo),
        message: 'You are not allowed to delete bots',
        dataSources,
      })

      const { botIds } = input
      const users = await Promise.all(
        botIds.map((botId) => dataSources.model.serlo.getUuid({ id: botId }))
      )

      if (!t.array(UserDecoder).is(users))
        throw new UserInputError('not all bots are users')

      const activities = await Promise.all(
        botIds.map((userId) =>
          dataSources.model.serlo.getActivityByType({ userId })
        )
      )

      if (activities.some((activity) => activity.edits >= 5))
        throw new UserInputError(
          'One user has more than 4 edits. Is it really a spam account? Please inform the dev team.'
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
        { botIds }
      )
      await Promise.all(
        botIds.map(async (botId) => await deleteKratosUser(botId, dataSources))
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

      return { success }
    },

    async deleteRegularUsers(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        userId,
        guard: serloAuth.User.deleteRegularUser(serloAuth.Scope.Serlo),
        message: 'You are not allowed to delete users',
        dataSources,
      })

      const users = await Promise.all(
        input.users.map(async ({ id, username }) => {
          const user = await dataSources.model.serlo.getUuid({ id })

          if (!UserDecoder.is(user)) return null
          if (user.username !== username) return null

          return user
        })
      )

      if (!t.array(UserDecoder).is(users))
        throw new UserInputError(
          'Either one id does not belong to a user or one username / id combination is wrong'
        )

      return await Promise.all(
        users.map(async ({ id, username }) => {
          const result = {
            ...(await dataSources.model.serlo.deleteRegularUsers({
              userId: id,
            })),
            username: username,
          }

          if (result.success) await deleteKratosUser(id, dataSources)
          return result
        })
      )
    },

    async removeRole(_parent, { input }, { dataSources, userId }) {
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

      await dataSources.model.serlo.removeRole({
        username,
        roleName: generateRole(role, instance),
      })

      return { success: true }
    },

    async setDescription(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)
      return await dataSources.model.serlo.setDescription({
        ...input,
        userId,
      })
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

      return { ...result, email: input.email }
    },
  },
}

async function resolveUserConnectionFromIds({
  ids,
  payload,
  context,
}: {
  ids: number[]
  payload: ConnectionPayload
  context: Context
}) {
  const uuids = await Promise.all(
    ids.map(async (id) => context.dataSources.model.serlo.getUuid({ id }))
  )
  const users = assertAll({
    assertion(uuid: Model<'AbstractUuid'> | null): uuid is Model<'User'> {
      return uuid !== null && uuid.__typename == DiscriminatorType.User
    },
    error: new Error('Invalid user found'),
  })(uuids)

  return resolveConnection({
    nodes: users,
    payload,
    createCursor(node) {
      return node.id.toString()
    },
  })
}

async function activeDonorIDs({ dataSources }: Context) {
  return F.pipe(
    await dataSources.model.googleSpreadsheetApi.getValues({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_API_ACTIVE_DONORS,
      range: 'Tabellenblatt1!A:A',
      majorDimension: MajorDimension.Columns,
    }),
    extractIDsFromFirstColumn
  )
}

function extractIDsFromFirstColumn(
  columns: E.Either<ErrorEvent, CellValues>
): number[] {
  return F.pipe(
    columns,
    E.map((columns) => R.head(columns)),
    E.chain(
      E.fromNullable<ErrorEvent>({
        error: new Error('no columns in selected range'),
      })
    ),
    E.map((rows) => rows.slice(1).map(R.trim)),
    E.map(
      assertAll({
        assertion: (entry) => /^\d+$/.test(entry),
        error: new Error('invalid entry in activeDonorSpreadsheet'),
      })
    ),
    E.map(A.map((entry) => Number(entry))),
    E.mapLeft(addContext({ location: 'activeDonorSpreadsheet' })),
    E.getOrElse(consumeErrorEvent([] as number[]))
  )
}

function assertInstanceIsSet(instance: Instance | null) {
  if (!instance) {
    throw new UserInputError(
      "This role can't have a global scope: `instance` has to be declared."
    )
  }
}
async function deleteKratosUser(
  userId: number,
  dataSources: { model: ModelDataSource }
) {
  const identity =
    await dataSources.model.authServices.kratos.db.getIdentityByLegacyId(userId)
  if (identity)
    await dataSources.model.authServices.kratos.admin.adminDeleteIdentity(
      identity.id
    )
}
