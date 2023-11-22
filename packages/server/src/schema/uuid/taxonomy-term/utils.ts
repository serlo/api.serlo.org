import { UserInputError } from '~/errors'
import { InvalidCurrentValueError } from '~/internals/data-source-helper'
import { Context } from '~/internals/graphql'
import { TaxonomyTermDecoder } from '~/model/decoder'

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
      throw new UserInputError(
        `No taxonomy term found for the provided id ${id}`,
      )
    } else {
      throw error
    }
  }
}
