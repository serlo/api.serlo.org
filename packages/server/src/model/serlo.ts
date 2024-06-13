import { executePrompt } from './ai'
import * as DatabaseLayer from './database-layer'
import { PageRevisionDecoder } from './decoder'
import { Context } from '~/context'
import { createMutation, createRequest } from '~/internals/data-source-helper'
import { UuidResolver } from '~/schema/uuid/abstract-uuid/resolvers'

export function createSerloModel({
  context,
}: {
  context: Pick<Context, 'cache' | 'swrQueue' | 'database' | 'timer'>
}) {
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

  const getPages = createRequest({
    type: 'PagesQuery',
    decoder: DatabaseLayer.getDecoderFor('PagesQuery'),
    async getCurrentValue(payload: DatabaseLayer.Payload<'PagesQuery'>) {
      return DatabaseLayer.makeRequest('PagesQuery', payload)
    },
  })

  return {
    addPageRevision,
    checkoutPageRevision,
    createPage,
    executePrompt,
    getDeletedEntities,
    getPages,
    sortEntity,
  }
}
