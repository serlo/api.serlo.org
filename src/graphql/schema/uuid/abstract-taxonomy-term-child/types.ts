import { AbstractEntity, TaxonomyTerm } from '../../../../types'
import { AbstractEntityPreResolver } from '../abstract-entity'

export interface AbstractTaxonomyTermChild extends AbstractEntity {
  taxonomyTerm: TaxonomyTerm[]
}

export interface AbstractTaxonomyTermChildPreResolver
  extends Omit<AbstractEntityPreResolver, 'taxonomyTerm'> {
  taxonomyTermIds: number[]
}

export type AbstractTaxonomyTermChildPayload = AbstractTaxonomyTermChildPreResolver
