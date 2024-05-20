import { abstractEntitySchema } from './abstract-entity'
import { abstractRepositorySchema } from './abstract-repository'
import { abstractTaxonomyTermChildSchema } from './abstract-taxonomy-term-child'
import { abstractUuidSchema } from './abstract-uuid'
import { UuidResolver } from './abstract-uuid/resolvers'
import { aliasSchema } from './alias'
import { appletSchema } from './applet'
import { articleSchema } from './article'
import { courseSchema } from './course'
import { coursePageSchema } from './course-page'
import { eventSchema } from './event'
import { exerciseSchema } from './exercise'
import { exerciseGroupSchema } from './exercise-group'
import { pageSchema } from './page'
import { taxonomyTermSchema } from './taxonomy-term'
import { userSchema } from './user'
import { ActiveUserIdsResolver } from './user/resolvers'
import { videoSchema } from './video'
import { mergeSchemas } from '~/internals/graphql'

export const uuidSchema = mergeSchemas(
  abstractEntitySchema,
  abstractRepositorySchema,
  abstractTaxonomyTermChildSchema,
  abstractUuidSchema,
  aliasSchema,
  appletSchema,
  articleSchema,
  courseSchema,
  coursePageSchema,
  eventSchema,
  exerciseSchema,
  exerciseGroupSchema,
  pageSchema,
  taxonomyTermSchema,
  userSchema,
  videoSchema,
)

export const uuidCachedResolvers = [UuidResolver, ActiveUserIdsResolver]
