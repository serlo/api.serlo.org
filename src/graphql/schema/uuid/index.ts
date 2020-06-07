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
import { abstractTaxonomyTermChildSchema } from './abstract-taxonomy-term-child'
import { abstractUuidSchema } from './abstract-uuid'
import {
  UnsupportedUuid,
  UnsupportedUuidPayload,
  Uuid,
} from './abstract-uuid/types'
import { aliasSchema } from './alias'
import {
  Applet,
  AppletPayload,
  AppletRevision,
  AppletRevisionPayload,
  appletSchema,
} from './applet'
import {
  articleSchema,
  Article,
  ArticleRevision,
  ArticlePayload,
  ArticleRevisionPayload,
} from './article'
import {
  Course,
  CoursePayload,
  CourseRevision,
  CourseRevisionPayload,
  courseSchema,
} from './course'
import {
  CoursePage,
  CoursePagePayload,
  CoursePageRevision,
  CoursePageRevisionPayload,
  coursePageSchema,
} from './course-page'
import {
  Event,
  EventPayload,
  EventRevision,
  EventRevisionPayload,
  eventSchema,
} from './event'
import {
  Exercise,
  ExercisePayload,
  ExerciseRevision,
  ExerciseRevisionPayload,
  exerciseSchema,
} from './exercise'
import {
  ExerciseGroup,
  ExerciseGroupPayload,
  ExerciseGroupRevision,
  ExerciseGroupRevisionPayload,
  exerciseGroupSchema,
} from './exercise-group'
import {
  GroupedExercise,
  GroupedExercisePayload,
  GroupedExerciseRevision,
  GroupedExerciseRevisionPayload,
  groupedExerciseSchema,
} from './grouped-exercise'
import { navigationSchema } from './navigation'
import {
  pageSchema,
  Page,
  PageRevision,
  PagePayload,
  PageRevisionPayload,
} from './page'
import {
  Solution,
  SolutionPayload,
  SolutionRevision,
  SolutionRevisionPayload,
  solutionSchema,
} from './solution'
import {
  taxonomyTermSchema,
  TaxonomyTerm,
  TaxonomyTermPayload,
} from './taxonomy-term'
import { userSchema, User, UserPayload } from './user'
import {
  Video,
  VideoPayload,
  VideoRevision,
  VideoRevisionPayload,
  videoSchema,
} from './video'

export * from './abstract-entity'
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
export * from './user'
export * from './video'

export const uuidSchema = Schema.merge(
  abstractEntitySchema,
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
  navigationSchema,
  pageSchema,
  solutionSchema,
  taxonomyTermSchema,
  userSchema,
  videoSchema
)

export type AbstractUuidPayload =
  | ({ discriminator: 'entity'; type: 'applet' } & AppletPayload)
  | ({ discriminator: 'entity'; type: 'article' } & ArticlePayload)
  | ({ discriminator: 'entity'; type: 'course' } & CoursePayload)
  | ({ discriminator: 'entity'; type: 'coursePage' } & CoursePagePayload)
  | ({ discriminator: 'entity'; type: 'event' } & EventPayload)
  | ({ discriminator: 'entity'; type: 'exercise' } & ExercisePayload)
  | ({ discriminator: 'entity'; type: 'exerciseGroup' } & ExerciseGroupPayload)
  | ({
      discriminator: 'entity'
      type: 'groupedExercise'
    } & GroupedExercisePayload)
  | ({ discriminator: 'entity'; type: 'solution' } & SolutionPayload)
  | ({ discriminator: 'entity'; type: 'video' } & VideoPayload)
  | ({
      discriminator: 'entityRevision'
      type: 'applet'
    } & AppletRevisionPayload)
  | ({
      discriminator: 'entityRevision'
      type: 'article'
    } & ArticleRevisionPayload)
  | ({
      discriminator: 'entityRevision'
      type: 'course'
    } & CourseRevisionPayload)
  | ({
      discriminator: 'entityRevision'
      type: 'coursePage'
    } & CoursePageRevisionPayload)
  | ({ discriminator: 'entityRevision'; type: 'event' } & EventRevisionPayload)
  | ({
      discriminator: 'entityRevision'
      type: 'exercise'
    } & ExerciseRevisionPayload)
  | ({
      discriminator: 'entityRevision'
      type: 'exerciseGroup'
    } & ExerciseGroupRevisionPayload)
  | ({
      discriminator: 'entityRevision'
      type: 'groupedExercise'
    } & GroupedExerciseRevisionPayload)
  | ({
      discriminator: 'entityRevision'
      type: 'solution'
    } & SolutionRevisionPayload)
  | ({ discriminator: 'entityRevision'; type: 'video' } & VideoRevisionPayload)
  | ({ discriminator: 'page' } & PagePayload)
  | ({ discriminator: 'pageRevision' } & PageRevisionPayload)
  | ({ discriminator: 'user' } & UserPayload)
  | ({ discriminator: 'taxonomyTerm' } & TaxonomyTermPayload)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveAbstractUuid(
  data?: AbstractUuidPayload
): Uuid | UnsupportedUuid | void {
  if (!data) return

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
        default: {
          const d = data as UnsupportedUuidPayload
          return {
            __typename: 'UnsupportedUuid',
            discriminator: d.discriminator,
            id: d.id,
            trashed: d.trashed,
          }
        }
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
        default: {
          const d = data as UnsupportedUuidPayload
          return {
            __typename: 'UnsupportedUuid',
            discriminator: d.discriminator,
            id: d.id,
            trashed: d.trashed,
          }
        }
      }
    case 'page':
      return new Page(data)
    case 'pageRevision':
      return new PageRevision(data)
    case 'user':
      return new User(data)
    case 'taxonomyTerm':
      return new TaxonomyTerm(data)
    default: {
      const d = data as UnsupportedUuidPayload
      return {
        __typename: 'UnsupportedUuid',
        discriminator: d.discriminator,
        id: d.id,
        trashed: d.trashed,
      }
    }
  }
}
