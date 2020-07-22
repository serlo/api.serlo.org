import {
  AbstractEntityRevisionPreResolver,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'
import { AbstractTaxonomyTermChildPreResolver } from '../abstract-taxonomy-term-child'

export interface VideoPreResolver extends AbstractTaxonomyTermChildPreResolver {
  __typename: EntityType.Video
}

export type VideoPayload = VideoPreResolver

export interface VideoRevisionPreResolver
  extends AbstractEntityRevisionPreResolver {
  __typename: EntityRevisionType.VideoRevision
  url: string
  title: string
  content: string
  changes: string
}

export type VideoRevisionPayload = VideoRevisionPreResolver
