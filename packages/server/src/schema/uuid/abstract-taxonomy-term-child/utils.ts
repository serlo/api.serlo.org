import { TaxonomyTermDecoder } from '~/model/decoder'
import { resolveConnection } from '~/schema/connection/utils'
import { AbstractTaxonomyTermChildResolvers } from '~/types'

export function createTaxonomyTermChildResolvers(): Pick<
  AbstractTaxonomyTermChildResolvers,
  'taxonomyTerms'
> {
  return {
    async taxonomyTerms(entity, cursorPayload, { dataSources }) {
      const taxonomyTerms = await Promise.all(
        entity.taxonomyTermIds.map(async (id: number) => {
          return await dataSources.model.serlo.getUuidWithCustomDecoder({
            id,
            decoder: TaxonomyTermDecoder,
          })
        }),
      )
      return resolveConnection({
        nodes: taxonomyTerms,
        payload: cursorPayload,
        createCursor(node) {
          return node.id.toString()
        },
      })
    },
  }
}
