import {
  createEntityResolvers,
  createEntityRevisionResolvers,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'
import { createTaxonomyTermChildResolvers } from '../abstract-taxonomy-term-child'
import { CoursePreResolver, CourseRevisionPreResolver } from './types'

export const resolvers = {
  Course: {
    ...createEntityResolvers<CoursePreResolver, CourseRevisionPreResolver>({
      entityRevisionType: EntityRevisionType.CourseRevision,
    }),
    ...createTaxonomyTermChildResolvers<CoursePreResolver>(),
  },
  CourseRevision: createEntityRevisionResolvers<
    CoursePreResolver,
    CourseRevisionPreResolver
  >({
    entityType: EntityType.Course,
    repository: 'course',
  }),
}
