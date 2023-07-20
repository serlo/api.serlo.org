import * as serloAuth from '@serlo/authorization'
import { instanceToScope } from '@serlo/authorization'
import { GraphQLError } from 'graphql'
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
        throw new GraphQLError(`'first' may not be higher than ${LIMIT}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })

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
        }),
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
          serloAuth.instanceToScope(entity.instance),
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
        throw new GraphQLError(`License with id ${licenseId} does not exist.`, {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
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
        throw new GraphQLError(
          'The instance of the entity does not match the instance of the license.',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
            },
          },
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

function decodeDateOfDeletion(after: string) {
  const afterParsed = JSON.parse(
    Buffer.from(after, 'base64').toString(),
  ) as unknown

  const dateOfDeletion = t.type({ dateOfDeletion: t.string }).is(afterParsed)
    ? afterParsed.dateOfDeletion
    : undefined

  if (!dateOfDeletion)
    throw new GraphQLError(
      'Field `dateOfDeletion` as string is missing in `after`',
      {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      },
    )

  if (!isDateString(dateOfDeletion))
    throw new GraphQLError(
      'The encoded dateOfDeletion in `after` should be a string in date format',
      {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      },
    )

  return new Date(dateOfDeletion).toISOString()
}
