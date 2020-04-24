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

export const appletSchema = new Schema()

export class Applet extends TaxonomyTermChild {
  public __typename = EntityType.Applet
}
export interface AppletPayload extends EntityPayload {
  taxonomyTermIds: number[]
}

export class AppletRevision extends EntityRevision {
  public __typename = EntityRevisionType.AppletRevision
  public url: string
  public title: string
  public content: string
  public changes: string
  public metaTitle: string
  public metaDescription: string

  public constructor(payload: AppletRevisionPayload) {
    super(payload)
    this.url = payload.url
    this.title = payload.title
    this.content = payload.content
    this.changes = payload.changes
    this.metaTitle = payload.metaTitle
    this.metaDescription = payload.metaDescription
  }
}

export interface AppletRevisionPayload extends EntityRevisionPayload {
  url: string
  title: string
  content: string
  changes: string
  metaTitle: string
  metaDescription: string
}

addTaxonomyTermChildResolvers({
  schema: appletSchema,
  entityType: EntityType.Applet,
  entityRevisionType: EntityRevisionType.AppletRevision,
  repository: 'applet',
  Entity: Applet,
  EntityRevision: AppletRevision,
  entityFields: `
    taxonomyTerms: [TaxonomyTerm!]!
  `,
  entityPayloadFields: `
    taxonomyTermIds: [Int!]!
  `,
  entityRevisionFields: `
    url: String!
    title: String!
    content: String!
    changes: String!
    metaTitle: String!
    metaDescription: String!
  `,
  entitySetter: 'setApplet',
  entityRevisionSetter: 'setAppletRevision',
})
