import {
  AbstractEntityRevisionPreResolver,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'
import { AbstractTaxonomyTermChildPreResolver } from '../abstract-taxonomy-term-child'

export interface EventPreResolver extends AbstractTaxonomyTermChildPreResolver {
  __typename: EntityType.Event
}

export type EventPayload = EventPreResolver

export interface EventRevisionPreResolver
  extends AbstractEntityRevisionPreResolver {
  __typename: EntityRevisionType.EventRevision
  title: string
  content: string
  changes: string
  metaTitle: string
  metaDescription: string
}

export type EventRevisionPayload = EventRevisionPreResolver
