import * as t from 'io-ts'

import { Context, Model } from '~/internals/graphql'
import { TaxonomyTermDecoder } from '~/model/decoder'

export async function resolveTaxonomyTermPath(
  parent: Model<'TaxonomyTerm'>,
  { dataSources }: Context,
) {
  const path = [parent]
  let current = parent

  while (current.parentId !== null) {
    const next = await dataSources.model.serlo.getUuidWithCustomDecoder({
      id: current.parentId,
      decoder: t.union([TaxonomyTermDecoder, t.null]),
    })
    if (next === null) break
    path.unshift(next)
    current = next
  }

  return path
}
