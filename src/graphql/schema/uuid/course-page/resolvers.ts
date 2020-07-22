import {
  createEntityResolvers,
  createEntityRevisionResolvers,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'
import { CoursePagePreResolver, CoursePageRevisionPreResolver } from './types'

export const resolvers = {
  CoursePage: createEntityResolvers<
    CoursePagePreResolver,
    CoursePageRevisionPreResolver
  >({
    entityRevisionType: EntityRevisionType.CoursePageRevision,
  }),
  CoursePageRevision: createEntityRevisionResolvers<
    CoursePagePreResolver,
    CoursePageRevisionPreResolver
  >({
    entityType: EntityType.CoursePage,
    repository: 'coursePage',
  }),
}
