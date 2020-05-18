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
import { Schema } from '../utils'
import { abstractEntitySchema } from './abstract-entity'
import {
  abstractLegacyUuidSchema,
  UnsupportedLegacyUuid,
} from './abstract-legacy-uuid'
import { abstractTaxonomyTermChildSchema } from './abstract-taxonomy-term-child'
import { aliasSchema } from './alias'
import { Applet, AppletRevision, appletSchema } from './applet'
import { articleSchema, Article, ArticleRevision } from './article'
import { Course, CourseRevision, courseSchema } from './course'
import { CoursePage, CoursePageRevision, coursePageSchema } from './course-page'
import { Event, EventRevision, eventSchema } from './event'
import { Exercise, ExerciseRevision, exerciseSchema } from './exercise'
import {
  ExerciseGroup,
  ExerciseGroupRevision,
  exerciseGroupSchema,
} from './exercise-group'
import {
  GroupedExercise,
  GroupedExerciseRevision,
  groupedExerciseSchema,
} from './grouped-exercise'
import { navigationSchema } from './navigation'
import { pageSchema, Page, PageRevision } from './page'
import { Solution, SolutionRevision, solutionSchema } from './solution'
import { taxonomyTermSchema, TaxonomyTerm } from './taxonomy-term'
import { userSchema, User } from './user'
import { Video, VideoRevision, videoSchema } from './video'

export * from './abstract-entity'
export * from './abstract-legacy-uuid'
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
export * from './user'
export * from './video'

export const legacyUuidSchema = Schema.merge(
  abstractEntitySchema,
  abstractLegacyUuidSchema,
  abstractTaxonomyTermChildSchema,
  aliasSchema,
  appletSchema,
  articleSchema,
  courseSchema,
  coursePageSchema,
  eventSchema,
  exerciseSchema,
  exerciseGroupSchema,
  groupedExerciseSchema,
  navigationSchema,
  pageSchema,
  solutionSchema,
  taxonomyTermSchema,
  userSchema,
  videoSchema
)

// uuid(id: number) -> SerloUuid
// node(id: number | string) -> SerloUuid | NewUuid
// alias(alias:....) -> SerloUuid | NewUuid

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveAbstractLegacyUuid(data?: any) {
  if (!data) return null

  switch (data.discriminator) {
    case 'entity':
      switch (data.type) {
        case 'applet':
          return new Applet(data)
        case 'article':
          return new Article(data)
        case 'course':
          return new Course(data)
        case 'coursePage':
          return new CoursePage(data)
        case 'event':
          return new Event(data)
        case 'exercise':
          return new Exercise(data)
        case 'exerciseGroup':
          return new ExerciseGroup(data)
        case 'groupedExercise':
          return new GroupedExercise(data)
        case 'solution':
          return new Solution(data)
        case 'video':
          return new Video(data)
        default:
          return new UnsupportedLegacyUuid(data)
      }
    case 'entityRevision':
      switch (data.type) {
        case 'applet':
          return new AppletRevision(data)
        case 'article':
          return new ArticleRevision(data)
        case 'course':
          return new CourseRevision(data)
        case 'coursePage':
          return new CoursePageRevision(data)
        case 'event':
          return new EventRevision(data)
        case 'exercise':
          return new ExerciseRevision(data)
        case 'exerciseGroup':
          return new ExerciseGroupRevision(data)
        case 'groupedExercise':
          return new GroupedExerciseRevision(data)
        case 'solution':
          return new SolutionRevision(data)
        case 'video':
          return new VideoRevision(data)
        default:
          return new UnsupportedLegacyUuid(data)
      }
    case 'page':
      return new Page(data)
    case 'pageRevision':
      return new PageRevision(data)
    case 'user':
      return new User(data)
    case 'taxonomyTerm':
      return new TaxonomyTerm(data)
    default:
      return new UnsupportedLegacyUuid(data)
  }
}
