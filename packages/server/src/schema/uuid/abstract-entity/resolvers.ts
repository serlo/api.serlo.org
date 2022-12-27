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
import { instanceToScope } from '@serlo/authorization'
import { UserInputError } from 'apollo-server'
import * as t from 'io-ts'

import { createSetEntityResolver } from './entity-set-handler'
import { licenses } from '~/config'
import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
  InterfaceResolvers,
  Mutations,
  Queries,
} from '~/internals/graphql'
import {
  castToUuid,
  CourseDecoder,
  EntityDecoder,
  EntityType,
  ExerciseGroupDecoder,
} from '~/model/decoder'
import { fetchScopeOfUuid } from '~/schema/authorization/utils'
import { resolveConnection } from '~/schema/connection/utils'
import { decodeDateOfDeletion } from '~/schema/uuid/utils'

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

      const deletedAfter = after ? decodeDateOfDeletion(after) : undefined

      const { deletedEntities } =
        await dataSources.model.serlo.getDeletedEntities({
          first: first + 1,
          after: deletedAfter,
          instance,
        })

      const nodes = await Promise.all(
        deletedEntities.map(async (node) => {
          return {
            entity: await dataSources.model.serlo.getUuidWithCustomDecoder({
              id: node.id,
              decoder: EntityDecoder,
            }),
            dateOfDeletion: node.dateOfDeletion,
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
      mandatoryFieldKeys: ['changes', 'title', 'url'],
      transformedInput: (input) => {
        return {
          ...input,
          description: input.content,
          content: input.url,
          url: undefined,
        }
      },
    }),

    async sort(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const { entityId, childrenIds } = input

      const entity = await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: entityId,
        decoder: t.union([ExerciseGroupDecoder, CourseDecoder]),
      })

      await assertUserIsAuthorized({
        userId,
        dataSources,
        message:
          'You are not allowed to sort children of entities in this instance.',
        guard: serloAuth.Entity.orderChildren(
          serloAuth.instanceToScope(entity.instance)
        ),
      })

      // Provisory solution, See https://github.com/serlo/serlo.org-database-layer/issues/303
      const allChildrenIds = ExerciseGroupDecoder.is(entity)
        ? [...new Set(childrenIds.concat(entity.exerciseIds))]
        : [...new Set(childrenIds.concat(entity.pageIds))]

      const { success } = await dataSources.model.serlo.sortEntity({
        entityId,
        childrenIds: allChildrenIds,
      })

      return { success, query: {} }
    },

    async updateLicense(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const { licenseId, entityId } = input

      const newLicense = licenses.find((license) => {
        return license.id === licenseId
      })

      if (!newLicense) {
        throw new UserInputError(`License with id ${licenseId} does not exist.`)
      }

      const entity = await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: entityId,
        decoder: EntityDecoder,
      })

      await assertUserIsAuthorized({
        userId,
        dataSources,
        message: 'You are not allowed to set the license for this entity.',
        guard: serloAuth.Entity.updateLicense(instanceToScope(entity.instance)),
      })

      if (entity.instance !== newLicense.instance) {
        throw new UserInputError(
          'The instance of the entity does not match the instance of the license.'
        )
      }

      await dataSources.model.serlo.setEntityLicense({
        entityId,
        licenseId,
        userId,
      })

      return { success: true, query: {} }
    },

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
