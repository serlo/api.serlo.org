/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { abstractEntitySchema } from './abstract-entity'
import { abstractExerciseSchema } from './abstract-exercise'
import { abstractNavigationChildSchema } from './abstract-navigation-child'
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
import { solutionSchema } from './solution'
import { taxonomyTermSchema } from './taxonomy-term'
import { threadSchema } from './thread'
import { userSchema } from './user'
import { videoSchema } from './video'
import { mergeSchemas } from '~/internals/graphql'

export * from './abstract-entity'
export * from './abstract-exercise'
export * from './abstract-navigation-child'
export * from './abstract-repository'
export * from './abstract-taxonomy-term-child'
export * from './abstract-uuid'
export * from './alias'
export * from './applet'
export * from './article'
export * from './course'
export * from './course-page'
export * from './event'
export * from './exercise'
export * from './exercise-group'
export * from './grouped-exercise'
export * from './page'
export * from './solution'
export * from './taxonomy-term'
export * from './thread'
export * from './user'
export * from './video'

export const uuidSchema = mergeSchemas(
  abstractEntitySchema,
  abstractExerciseSchema,
  abstractNavigationChildSchema,
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
  solutionSchema,
  taxonomyTermSchema,
  threadSchema,
  userSchema,
  videoSchema
)
