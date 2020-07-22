import { forEachObjIndexed } from 'ramda'

import {
  addEntityResolvers,
  Entity,
  EntityResolversPayload,
  EntityRevision,
} from '../abstract-entity'
import { AbstractTaxonomyTermChildPayload } from './types'
import { createTaxonomyTermChildResolvers } from './utils'

export * from './types'
export * from './utils'

/**
 * TODO: Shouldn't be needed anymore after refactoring is complete
 * @deprecated
 */
export abstract class TaxonomyTermChild extends Entity {
  public taxonomyTermIds: number[]

  public constructor(payload: AbstractTaxonomyTermChildPayload) {
    super(payload)
    this.taxonomyTermIds = payload.taxonomyTermIds
  }
}

/**
 * TODO: Shouldn't be needed anymore after refactoring is complete
 * @deprecated
 */
export function addTaxonomyTermChildResolvers<
  E extends TaxonomyTermChild,
  R extends EntityRevision
>(args: EntityResolversPayload) {
  addEntityResolvers(args)
  const taxonomyTermChildResolvers = createTaxonomyTermChildResolvers<E>()
  forEachObjIndexed((value, key) => {
    args.schema.addResolver<E, never, unknown>(args.entityType, key, value)
  }, taxonomyTermChildResolvers)
}
