import { AbstractEntity, TaxonomyTerm } from '../../../../types'
import { AbstractEntityPreResolver } from '../abstract-entity'

export interface AbstractTaxonomyTermChild extends AbstractEntity {
  taxonomyTerm: TaxonomyTerm[]
}

export interface AbstractTaxonomyTermChildPreResolver
  extends AbstractEntityPreResolver {
  taxonomyTermIds: number[]
}

export type AbstractTaxonomyTermChildPayload = AbstractTaxonomyTermChildPreResolver
