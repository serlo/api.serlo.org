import { abstractEntitySchema } from './abstract-entity'
import { abstractExerciseSchema } from './abstract-exercise'
import { abstractRepositorySchema } from './abstract-repository'
import { abstractTaxonomyTermChildSchema } from './abstract-taxonomy-term-child'
import { abstractUuidSchema } from './abstract-uuid'
import { aliasSchema } from './alias'
import { appletSchema } from './applet'
import { articleSchema } from './article'
import { courseSchema } from './course'
import { coursePageSchema } from './course-page'
import { eventSchema } from './event'
import { exerciseSchema } from './exercise'
import { exerciseGroupSchema } from './exercise-group'
import { groupedExerciseSchema } from './grouped-exercise'
import { pageSchema } from './page'
import { taxonomyTermSchema } from './taxonomy-term'
import { userSchema } from './user'
import { videoSchema } from './video'
import { mergeSchemas } from '~/internals/graphql'

export const uuidSchema = mergeSchemas(
  abstractEntitySchema,
  abstractExerciseSchema,
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
  groupedExerciseSchema,
  pageSchema,
  taxonomyTermSchema,
  userSchema,
  videoSchema,
)
