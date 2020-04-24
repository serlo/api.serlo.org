import { Schema } from '../utils'
import {
  EntityPayload,
  EntityType,
  EntityRevision,
  EntityRevisionPayload,
  EntityRevisionType,
} from './abstract-entity'
import {
  addTaxonomyTermChildResolvers,
  TaxonomyTermChild,
} from './abstract-taxonomy-term-child'

export const eventSchema = new Schema()

export class Event extends TaxonomyTermChild {
  public __typename = EntityType.Event
}
export interface EventPayload extends EntityPayload {
  taxonomyTermIds: number[]
}

export class EventRevision extends EntityRevision {
  public __typename = EntityRevisionType.EventRevision
  public title: string
  public content: string
  public changes: string
  public metaTitle: string
  public metaDescription: string

  public constructor(payload: EventRevisionPayload) {
    super(payload)
    this.title = payload.title
    this.content = payload.content
    this.changes = payload.changes
    this.metaTitle = payload.metaTitle
    this.metaDescription = payload.metaDescription
  }
}

export interface EventRevisionPayload extends EntityRevisionPayload {
  title: string
  content: string
  changes: string
  metaTitle: string
  metaDescription: string
}

addTaxonomyTermChildResolvers({
  schema: eventSchema,
  entityType: EntityType.Event,
  entityRevisionType: EntityRevisionType.EventRevision,
  repository: 'event',
  Entity: Event,
  EntityRevision: EventRevision,
  entityFields: `
    taxonomyTerms: [TaxonomyTerm!]!
  `,
  entityPayloadFields: `
    taxonomyTermIds: [Int!]!
  `,
  entityRevisionFields: `
    title: String!
    content: String!
    changes: String!
    metaTitle: String!
    metaDescription: String!
  `,
  entitySetter: 'setEvent',
  entityRevisionSetter: 'setEventRevision',
})
