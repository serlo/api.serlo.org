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

export const videoSchema = new Schema()

export class Video extends TaxonomyTermChild {
  public __typename = EntityType.Video
}
export interface VideoPayload extends EntityPayload {
  taxonomyTermIds: number[]
}

export class VideoRevision extends EntityRevision {
  public __typename = EntityRevisionType.VideoRevision
  public url: string
  public title: string
  public changes: string

  public constructor(payload: VideoRevisionPayload) {
    super(payload)
    this.url = payload.url
    this.title = payload.title
    this.changes = payload.changes
  }
}

export interface VideoRevisionPayload extends EntityRevisionPayload {
  url: string
  title: string
  changes: string
}

addTaxonomyTermChildResolvers({
  schema: videoSchema,
  entityType: EntityType.Video,
  entityRevisionType: EntityRevisionType.VideoRevision,
  repository: 'video',
  Entity: Video,
  EntityRevision: VideoRevision,
  entityFields: `
    taxonomyTerms: [TaxonomyTerm!]!
  `,
  entityPayloadFields: `
    taxonomyTermIds: [Int!]!
  `,
  entityRevisionFields: `
    title: String!
    url: String!
    changes: String!
  `,
  entitySetter: 'setVideo',
  entityRevisionSetter: 'setVideoRevision',
})
