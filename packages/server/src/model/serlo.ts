import { option as O } from 'fp-ts'
import * as t from 'io-ts'

import { executePrompt } from './ai'
import * as DatabaseLayer from './database-layer'
import {
  EntityDecoder,
  EntityRevisionDecoder,
  PageRevisionDecoder,
} from './decoder'
import { Context } from '~/context'
import {
  createLegacyQuery,
  createMutation,
  createRequest,
} from '~/internals/data-source-helper'
import { isInstance } from '~/schema/instance/utils'
import { UuidResolver } from '~/schema/uuid/abstract-uuid/resolvers'
import { decodePath, encodePath } from '~/schema/uuid/alias/utils'
import { Instance } from '~/types'

export function createSerloModel({
  context,
}: {
  context: Pick<Context, 'cache' | 'swrQueue' | 'database' | 'timer'>
}) {
  const getActiveReviewerIds = createLegacyQuery(
    {
      type: 'ActiveReviewersQuery',
      decoder: DatabaseLayer.getDecoderFor('ActiveReviewersQuery'),
      enableSwr: true,
      getCurrentValue() {
        return DatabaseLayer.makeRequest('ActiveReviewersQuery', undefined)
      },
      staleAfter: { hours: 1 },
      getKey: () => {
        return 'de.serlo.org/api/user/active-reviewers'
      },
      getPayload: (key: string) => {
        if (key !== 'de.serlo.org/api/user/active-reviewers') return O.none
        return O.some(undefined)
      },
      examplePayload: undefined,
    },
    context,
  )

  const getActivityByType = createLegacyQuery(
    {
      type: 'ActivityByTypeQuery',
      decoder: DatabaseLayer.getDecoderFor('ActivityByTypeQuery'),
      enableSwr: true,
      getCurrentValue: (
        payload: DatabaseLayer.Payload<'ActivityByTypeQuery'>,
      ) => {
        return DatabaseLayer.makeRequest('ActivityByTypeQuery', payload)
      },
      staleAfter: { minutes: 10 },
      getKey: ({ userId }) => {
        return `de.serlo.org/api/user/activity-by-type/${userId}`
      },
      getPayload: (key) => {
        if (!key.startsWith('de.serlo.org/api/user/activity-by-type/'))
          return O.none
        const userId = parseInt(
          key.replace('de.serlo.org/api/user/activity-by-type/', ''),
        )
        if (Number.isNaN(userId)) return O.none
        return O.some({ userId })
      },
      examplePayload: { userId: 1 },
    },
    context,
  )

  const getPotentialSpamUsers = createRequest({
    type: 'UserPotentialSpamUsersQuery',
    decoder: DatabaseLayer.getDecoderFor('UserPotentialSpamUsersQuery'),
    getCurrentValue(
      payload: DatabaseLayer.Payload<'UserPotentialSpamUsersQuery'>,
    ) {
      return DatabaseLayer.makeRequest('UserPotentialSpamUsersQuery', payload)
    },
  })

  const getAlias = createLegacyQuery(
    {
      type: 'AliasQuery',
      decoder: DatabaseLayer.getDecoderFor('AliasQuery'),
      getCurrentValue: ({
        path,
        instance,
      }: DatabaseLayer.Payload<'AliasQuery'>) => {
        return DatabaseLayer.makeRequest('AliasQuery', {
          instance,
          path: decodePath(path),
        })
      },
      enableSwr: true,
      staleAfter: { days: 1 },
      getKey: ({ path, instance }) => {
        const cleanPath = encodePath(decodePath(path))
        return `${instance}.serlo.org/api/alias${cleanPath}`
      },
      getPayload: (key) => {
        const instance = getInstanceFromKey(key)
        const prefix = `${instance || ''}.serlo.org/api/alias`
        return instance && key.startsWith(`${prefix}/`)
          ? O.some({ instance, path: key.replace(prefix, '') })
          : O.none
      },
      examplePayload: { path: '/math', instance: Instance.En },
    },
    context,
  )

  const getUnrevisedEntities = createLegacyQuery(
    {
      type: 'UnrevisedEntitiesQuery',
      decoder: DatabaseLayer.getDecoderFor('UnrevisedEntitiesQuery'),
      getCurrentValue: () => {
        return DatabaseLayer.makeRequest('UnrevisedEntitiesQuery', {})
      },
      enableSwr: true,
      staleAfter: { minutes: 2 },
      maxAge: { hours: 1 },
      getKey: () => 'serlo.org/unrevised',
      getPayload: (key) => {
        return key === 'serlo.org/unrevised' ? O.some(undefined) : O.none
      },
      examplePayload: undefined,
    },
    context,
  )

  const getUnrevisedEntitiesPerSubject = createRequest({
    type: 'getUnrevisedEntitiesPerSubject',
    decoder: t.record(t.string, t.union([t.array(t.number), t.null])),
    async getCurrentValue(_payload: undefined) {
      const { unrevisedEntityIds } = await getUnrevisedEntities()
      const result: Record<string, number[] | null> = {}

      for (const entityId of unrevisedEntityIds) {
        const entity = await UuidResolver.resolveWithDecoder(
          EntityDecoder,
          { id: entityId },
          context,
        )
        const key = entity.canonicalSubjectId?.toString() ?? '__no_subject'

        result[key] ??= []
        result[key]?.push(entity.id)
      }

      return result
    },
  })

  const createEntity = createMutation({
    type: 'EntityCreateMutation',
    decoder: DatabaseLayer.getDecoderFor('EntityCreateMutation'),
    mutate: (payload: DatabaseLayer.Payload<'EntityCreateMutation'>) => {
      return DatabaseLayer.makeRequest('EntityCreateMutation', payload)
    },
    async updateCache({ input }, newEntity) {
      if (newEntity) {
        const { parentId, taxonomyTermId } = input
        if (parentId) {
          await UuidResolver.removeCacheEntry({ id: parentId }, context)
        }
        if (taxonomyTermId) {
          await UuidResolver.removeCacheEntry({ id: taxonomyTermId }, context)
        }

        await getUnrevisedEntities._querySpec.setCache({
          payload: undefined,
          getValue(current) {
            if (!current) return
            if (
              !input.needsReview &&
              current.unrevisedEntityIds.includes(newEntity.id)
            ) {
              current.unrevisedEntityIds = current.unrevisedEntityIds.filter(
                (id) => id !== newEntity.id,
              )
            }
            if (
              input.needsReview &&
              !current.unrevisedEntityIds.includes(newEntity.id)
            ) {
              current.unrevisedEntityIds.push(newEntity.id)
            }

            return current
          },
        })
      }
    },
  })

  const addEntityRevision = createMutation({
    type: 'EntityAddRevisionMutation',
    decoder: DatabaseLayer.getDecoderFor('EntityAddRevisionMutation'),
    mutate: (payload: DatabaseLayer.Payload<'EntityAddRevisionMutation'>) => {
      return DatabaseLayer.makeRequest('EntityAddRevisionMutation', payload)
    },
    updateCache: async ({ input }, { success }) => {
      if (success) {
        await UuidResolver.removeCacheEntry({ id: input.entityId }, context)

        await getUnrevisedEntities._querySpec.setCache({
          payload: undefined,
          getValue(current) {
            if (!current) return
            if (
              !input.needsReview &&
              current.unrevisedEntityIds.includes(input.entityId)
            ) {
              current.unrevisedEntityIds = current.unrevisedEntityIds.filter(
                (id) => id !== input.entityId,
              )
            }
            if (
              input.needsReview &&
              !current.unrevisedEntityIds.includes(input.entityId)
            ) {
              current.unrevisedEntityIds.push(input.entityId)
            }

            return current
          },
        })
      }
    },
  })

  const checkoutEntityRevision = createMutation({
    type: 'EntityCheckoutRevisionMutation',
    decoder: DatabaseLayer.getDecoderFor('EntityCheckoutRevisionMutation'),
    async mutate(
      payload: DatabaseLayer.Payload<'EntityCheckoutRevisionMutation'>,
    ) {
      return DatabaseLayer.makeRequest(
        'EntityCheckoutRevisionMutation',
        payload,
      )
    },
    async updateCache({ revisionId }) {
      const revision = await UuidResolver.resolveWithDecoder(
        EntityRevisionDecoder,
        { id: revisionId },
        context,
      )

      await UuidResolver.removeCacheEntry(
        { id: revision.repositoryId },
        context,
      )
      await UuidResolver.removeCacheEntry({ id: revisionId }, context)

      await getUnrevisedEntities._querySpec.removeCache({ payload: undefined })
    },
  })

  const createPage = createMutation({
    type: 'PageCreateMutation',
    decoder: DatabaseLayer.getDecoderFor('PageCreateMutation'),
    mutate: (payload: DatabaseLayer.Payload<'PageCreateMutation'>) => {
      return DatabaseLayer.makeRequest('PageCreateMutation', payload)
    },
  })

  const addPageRevision = createMutation({
    type: 'PageAddRevisionMutation',
    decoder: DatabaseLayer.getDecoderFor('PageAddRevisionMutation'),
    mutate: (payload: DatabaseLayer.Payload<'PageAddRevisionMutation'>) => {
      return DatabaseLayer.makeRequest('PageAddRevisionMutation', payload)
    },
    updateCache: async ({ pageId }, { success }) => {
      if (success) {
        await UuidResolver.removeCacheEntry({ id: pageId }, context)
      }
    },
  })

  const checkoutPageRevision = createMutation({
    type: 'PageCheckoutRevisionMutation',
    decoder: DatabaseLayer.getDecoderFor('PageCheckoutRevisionMutation'),
    mutate(payload: DatabaseLayer.Payload<'PageCheckoutRevisionMutation'>) {
      return DatabaseLayer.makeRequest('PageCheckoutRevisionMutation', payload)
    },
    async updateCache({ revisionId }) {
      const revision = await UuidResolver.resolveWithDecoder(
        PageRevisionDecoder,
        { id: revisionId },
        context,
      )

      await UuidResolver.removeCacheEntry(
        { id: revision.repositoryId },
        context,
      )
      await UuidResolver.removeCacheEntry({ id: revisionId }, context)
    },
  })

  const rejectEntityRevision = createMutation({
    type: 'EntityRejectRevisionMutation',
    decoder: DatabaseLayer.getDecoderFor('EntityRejectRevisionMutation'),
    mutate(payload: DatabaseLayer.Payload<'EntityRejectRevisionMutation'>) {
      return DatabaseLayer.makeRequest('EntityRejectRevisionMutation', payload)
    },
    async updateCache({ revisionId }) {
      await UuidResolver.removeCacheEntry({ id: revisionId }, context)

      await getUnrevisedEntities._querySpec.removeCache({ payload: undefined })
    },
  })

  const getDeletedEntities = createRequest({
    type: 'DeletedEntitiesQuery',
    decoder: DatabaseLayer.getDecoderFor('DeletedEntitiesQuery'),
    async getCurrentValue(
      payload: DatabaseLayer.Payload<'DeletedEntitiesQuery'>,
    ) {
      return DatabaseLayer.makeRequest('DeletedEntitiesQuery', payload)
    },
  })

  const sortEntity = createMutation({
    type: 'EntitySortMutation',
    decoder: DatabaseLayer.getDecoderFor('EntitySortMutation'),
    mutate: (payload: DatabaseLayer.Payload<'EntitySortMutation'>) => {
      return DatabaseLayer.makeRequest('EntitySortMutation', payload)
    },

    async updateCache({ entityId }, { success }) {
      if (success) {
        await UuidResolver.removeCacheEntry({ id: entityId }, context)
      }
    },
  })

  const setEntityLicense = createMutation({
    type: 'EntitySetLicenseMutation',
    decoder: DatabaseLayer.getDecoderFor('EntitySetLicenseMutation'),
    mutate: (payload: DatabaseLayer.Payload<'EntitySetLicenseMutation'>) => {
      return DatabaseLayer.makeRequest('EntitySetLicenseMutation', payload)
    },
    async updateCache({ entityId }, { success }) {
      if (success) {
        await UuidResolver.removeCacheEntry({ id: entityId }, context)
      }
    },
  })

  const getPages = createRequest({
    type: 'PagesQuery',
    decoder: DatabaseLayer.getDecoderFor('PagesQuery'),
    async getCurrentValue(payload: DatabaseLayer.Payload<'PagesQuery'>) {
      return DatabaseLayer.makeRequest('PagesQuery', payload)
    },
  })

  const getUsersByRole = createRequest({
    type: 'UsersByRoleQuery',
    decoder: DatabaseLayer.getDecoderFor('UsersByRoleQuery'),
    async getCurrentValue(payload: DatabaseLayer.Payload<'UsersByRoleQuery'>) {
      return DatabaseLayer.makeRequest('UsersByRoleQuery', payload)
    },
  })

  return {
    addEntityRevision,
    addPageRevision,
    checkoutEntityRevision,
    checkoutPageRevision,
    createEntity,
    createPage,
    executePrompt,
    getActiveReviewerIds,
    getActivityByType,
    getAlias,
    getDeletedEntities,
    getPotentialSpamUsers,
    getUnrevisedEntities,
    getUnrevisedEntitiesPerSubject,
    getUsersByRole,
    getPages,
    rejectEntityRevision,
    setEntityLicense,
    sortEntity,
  }
}

function getInstanceFromKey(key: string): Instance | null {
  const instance = key.slice(0, 2)
  return key.startsWith(`${instance}.serlo.org`) && isInstance(instance)
    ? instance
    : null
}
