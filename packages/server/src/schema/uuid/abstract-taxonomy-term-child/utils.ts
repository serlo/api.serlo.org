import { UuidResolver } from '../abstract-uuid/resolvers'
import { TaxonomyTermDecoder } from '~/model/decoder'
import { resolveConnection } from '~/schema/connection/utils'
import { AbstractTaxonomyTermChildResolvers } from '~/types'

export function createTaxonomyTermChildResolvers(): Pick<
  AbstractTaxonomyTermChildResolvers,
  'taxonomyTerms'
> {
  return {
    async taxonomyTerms(entity, cursorPayload, context) {
      const taxonomyTerms = await Promise.all(
        entity.taxonomyTermIds.map(async (id: number) =>
          UuidResolver.resolveWithDecoder(TaxonomyTermDecoder, { id }, context),
        ),
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
