/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */

import * as serloAuth from '@serlo/authorization'
import { UserInputError } from 'apollo-server'
import * as t from 'io-ts'

import { createSetEntityResolver } from './entity-set-handler'
import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
  InterfaceResolvers,
  Mutations,
  Queries,
} from '~/internals/graphql'
import { castToUuid, EntityDecoder, EntityType } from '~/model/decoder'
import { fetchScopeOfUuid } from '~/schema/authorization/utils'
import { resolveConnection } from '~/schema/connection/utils'
import { isDateString } from '~/utils'

export const resolvers: InterfaceResolvers<'AbstractEntity'> &
  InterfaceResolvers<'AbstractEntityRevision'> &
  Queries<'entity'> &
  Mutations<'entity'> = {
  Query: {
    entity: createNamespace(),
  },
  Mutation: {
    entity: createNamespace(),
  },
  AbstractEntity: {
    __resolveType(entity) {
      return entity.__typename
    },
  },
  AbstractEntityRevision: {
    __resolveType(entityRevision) {
      return entityRevision.__typename
    },
  },
  EntityQuery: {
    async deletedEntities(_parent, payload, { dataSources }) {
      const LIMIT = 1000
      const { first = 100, after, instance } = payload

      if (first > LIMIT)
        throw new UserInputError(`'first' may not be higher than ${LIMIT}`)

      const deletedAfter = getDateOfDeletion(after)

      const { deletedEntities } =
        await dataSources.model.serlo.getDeletedEntities({
          first: first + 1,
          after: deletedAfter,
          instance,
        })

      const nodes = await Promise.all(
        deletedEntities.map(async (element) => {
          return {
            entity: await dataSources.model.serlo.getUuidWithCustomDecoder({
              id: element.id,
              decoder: EntityDecoder,
            }),
            dateOfDeletion: element.dateOfDeletion,
          }
        })
      )

      return resolveConnection({
        nodes,
        payload,
        createCursor: (node) => {
          const { entity, dateOfDeletion } = node
          return JSON.stringify({ id: entity.id, dateOfDeletion })
        },
      })
    },
  },
  EntityMutation: {
    setApplet: createSetEntityResolver({
      entityType: EntityType.Applet,
      mandatoryFieldKeys: ['changes', 'content', 'title', 'url'],
    }),
    setArticle: createSetEntityResolver({
      entityType: EntityType.Article,
      mandatoryFieldKeys: ['changes', 'content', 'title'],
    }),
    setCourse: createSetEntityResolver({
      entityType: EntityType.Course,
      mandatoryFieldKeys: ['changes', 'title'],
      transformedInput: (input) => {
        return {
          ...input,
          description: input.content,
          content: undefined,
        }
      },
    }),
    setCoursePage: createSetEntityResolver({
      entityType: EntityType.CoursePage,
      mandatoryFieldKeys: ['changes', 'content', 'title'],
    }),
    setEvent: createSetEntityResolver({
      entityType: EntityType.Event,
      mandatoryFieldKeys: ['changes', 'content', 'title'],
    }),
    setExercise: createSetEntityResolver({
      entityType: EntityType.Exercise,
      mandatoryFieldKeys: ['changes', 'content'],
    }),
    setExerciseGroup: createSetEntityResolver({
      entityType: EntityType.ExerciseGroup,
      mandatoryFieldKeys: ['changes', 'content'],
    }),
    setGroupedExercise: createSetEntityResolver({
      entityType: EntityType.GroupedExercise,
      mandatoryFieldKeys: ['changes', 'content'],
    }),
    setSolution: createSetEntityResolver({
      entityType: EntityType.Solution,
      mandatoryFieldKeys: ['changes', 'content'],
    }),
    setVideo: createSetEntityResolver({
      entityType: EntityType.Video,
      mandatoryFieldKeys: ['changes', 'title', 'url', 'title'],
      transformedInput: (input) => {
        return {
          ...input,
          description: input.content,
          content: input.url,
          url: undefined,
        }
      },
    }),

    async checkoutRevision(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const scope = await fetchScopeOfUuid({
        id: input.revisionId,
        dataSources,
      })
      await assertUserIsAuthorized({
        userId,
        dataSources,
        message: 'You are not allowed to check out the provided revision.',
        guard: serloAuth.Entity.checkoutRevision(scope),
      })

      await dataSources.model.serlo.checkoutEntityRevision({
        revisionId: castToUuid(input.revisionId),
        reason: input.reason,
        userId,
      })

      return { success: true, query: {} }
    },
    async rejectRevision(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const scope = await fetchScopeOfUuid({
        id: input.revisionId,
        dataSources,
      })
      await assertUserIsAuthorized({
        userId,
        dataSources,
        message: 'You are not allowed to reject the provided revision.',
        guard: serloAuth.Entity.rejectRevision(scope),
      })

      await dataSources.model.serlo.rejectEntityRevision({ ...input, userId })

      return { success: true, query: {} }
    },
  },
}
function getDateOfDeletion(after: string | undefined) {
  if (after == undefined) return undefined

  const afterParsed = JSON.parse(
    Buffer.from(after, 'base64').toString()
  ) as unknown

  const deletedAfter = t.type({ dateOfDeletion: t.string }).is(afterParsed)
    ? afterParsed.dateOfDeletion
    : undefined

  if (!deletedAfter) return undefined

  if (!isDateString(deletedAfter))
    throw new UserInputError(
      'the encoded dateOfDeletion in `after` should be a date'
    )

  return new Date(deletedAfter).toISOString()
}
