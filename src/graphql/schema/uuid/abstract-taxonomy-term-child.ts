import { gql } from 'apollo-server'

import { Schema } from '../utils'
import { Entity, EntityPayload } from './abstract-entity'

export const abstractTaxonomyTermChildSchema = new Schema()

/**
 * interface TaxonomyTermChild
 */
export abstract class TaxonomyTermChild extends Entity {
  public taxonomyTermIds: number[]

  public constructor(payload: TaxonomyTermChildPayload) {
    super(payload)
    this.taxonomyTermIds = payload.taxonomyTermIds
  }
}
export interface TaxonomyTermChildPayload extends EntityPayload {
  taxonomyTermIds: number[]
}
abstractTaxonomyTermChildSchema.addTypeResolver<TaxonomyTermChild>(
  'TaxonomyTermChild',
  (entity) => {
    return entity.__typename
  }
)
abstractTaxonomyTermChildSchema.addTypeDef(gql`
  """
  Represents a Serlo.org entity (e.g. an article) that is the child of \`TaxonomyTerm\`s
  """
  interface TaxonomyTermChild {
    """
    The \`TaxonomyTerm\`s that the entity has been associated with
    """
    taxonomyTerms: [TaxonomyTerm!]!
  }
`)
