import {
  AbstractEntityPreResolver,
  AbstractEntityRevisionPreResolver,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'

export interface CoursePagePreResolver extends AbstractEntityPreResolver {
  __typename: EntityType.CoursePage
  parentId: number
}

export type CoursePagePayload = CoursePagePreResolver

export interface CoursePageRevisionPreResolver
  extends AbstractEntityRevisionPreResolver {
  __typename: EntityRevisionType.CoursePageRevision
  title: string
  content: string
  changes: string
}

export type CoursePageRevisionPayload = CoursePageRevisionPreResolver
