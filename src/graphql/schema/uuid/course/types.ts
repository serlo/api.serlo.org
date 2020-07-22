import {
  AbstractEntityRevisionPreResolver,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'
import { AbstractTaxonomyTermChildPreResolver } from '../abstract-taxonomy-term-child'

export interface CoursePreResolver
  extends AbstractTaxonomyTermChildPreResolver {
  __typename: EntityType.Course
  pageIds: number[]
}

export type CoursePayload = CoursePreResolver

export interface CourseRevisionPreResolver
  extends AbstractEntityRevisionPreResolver {
  __typename: EntityRevisionType.CourseRevision
  title: string
  content: string
  changes: string
  metaDescription: string
}

export type CourseRevisionPayload = CourseRevisionPreResolver
