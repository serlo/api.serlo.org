import { Context } from '../../types'
import { TaxonomyTermPayload } from '../taxonomy-term'
import { AbstractTaxonomyTermChildPreResolver } from './types'

export function createTaxonomyTermChildResolvers<
  E extends AbstractTaxonomyTermChildPreResolver
>() {
  return {
    taxonomyTerms(entity: E, _args: never, { dataSources }: Context) {
      return Promise.all(
        entity.taxonomyTermIds.map((id: number) => {
          return dataSources.serlo.getUuid<TaxonomyTermPayload>({ id })
        })
      )
    },
  }
}
