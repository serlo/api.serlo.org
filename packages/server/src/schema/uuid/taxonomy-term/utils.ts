import { GraphQLError } from 'graphql'
import * as t from 'io-ts'

import { InvalidCurrentValueError } from '~/internals/data-source-helper'
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

export async function assertIsTaxonomyTerm(
  id: number,
  dataSources: Context['dataSources'],
) {
  try {
    await dataSources.model.serlo.getUuidWithCustomDecoder({
      id,
      decoder: TaxonomyTermDecoder,
    })
  } catch (error) {
    if (error instanceof InvalidCurrentValueError) {
      throw new GraphQLError(
        `No taxonomy term found for the provided id ${id}`,
        {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        },
      )
    } else {
      throw error
    }
  }
}
