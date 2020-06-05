import { gql } from 'apollo-server'

import { SerloDataSource } from '../../data-sources/serlo'
import { Schema } from '../utils'
import {
  Entity,
  EntityPayload,
  EntityRevision,
  addEntityResolvers,
  EntityResolversPayload,
} from './abstract-entity'
import { TaxonomyTerm, TaxonomyTermPayload } from './taxonomy-term'

export const abstractTaxonomyTermChildSchema = new Schema()

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

export function addTaxonomyTermChildResolvers<
  E extends TaxonomyTermChild,
  R extends EntityRevision,
  ESetter extends keyof SerloDataSource,
  RSetter extends keyof SerloDataSource
>(args: EntityResolversPayload<E, R, ESetter, RSetter>) {
  addEntityResolvers(args)
  args.schema.addResolver<E, unknown, TaxonomyTerm[]>(
    args.entityType,
    'taxonomyTerms',
    (entity, _args, { dataSources }) => {
      return Promise.all(
        entity.taxonomyTermIds.map((id: number) => {
          return dataSources.serlo
            .getUuid<TaxonomyTermPayload>({ id })
            .then((data) => {
              return new TaxonomyTerm(data)
            })
        })
      )
    }
  )
}
