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
import {
  abstractEntitySchema,
  EntityRevisionType,
  EntityType,
} from './abstract-entity'
import {
  AbstractUuidPreResolver,
  abstractUuidSchema,
  DiscriminatorType,
  UuidPayload,
} from './abstract-uuid'
import { aliasSchema } from './alias'
import { Applet, AppletRevision, appletSchema } from './applet'
import { Article, ArticleRevision, articleSchema } from './article'
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
import { Page, PageRevision, pageSchema } from './page'
import { Solution, SolutionRevision, solutionSchema } from './solution'
import { resolveTaxonomyTerm, taxonomyTermSchema } from './taxonomy-term'
import { resolveUser, userSchema } from './user'
import { Video, VideoRevision, videoSchema } from './video'

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
export * from './navigation'
export * from './page'
export * from './solution'
export * from './taxonomy-term'
export * from './user'
export * from './video'

export const uuidSchema = Schema.merge(
  abstractEntitySchema,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveAbstractUuid(
  data?: UuidPayload
  // FIXME: this should be UuidPreResolver when refactoring is done
): AbstractUuidPreResolver | void {
  if (!data) return

  switch (data.__typename) {
    case EntityType.Applet:
      return new Applet(data)
    case EntityType.Article:
      return new Article(data)
    case EntityType.Course:
      return new Course(data)
    case EntityType.CoursePage:
      return new CoursePage(data)
    case EntityType.Event:
      return new Event(data)
    case EntityType.Exercise:
      return new Exercise(data)
    case EntityType.ExerciseGroup:
      return new ExerciseGroup(data)
    case EntityType.GroupedExercise:
      return new GroupedExercise(data)
    case EntityType.Solution:
      return new Solution(data)
    case EntityType.Video:
      return new Video(data)
    case EntityRevisionType.AppletRevision:
      return new AppletRevision(data)
    case EntityRevisionType.ArticleRevision:
      return new ArticleRevision(data)
    case EntityRevisionType.CourseRevision:
      return new CourseRevision(data)
    case EntityRevisionType.CoursePageRevision:
      return new CoursePageRevision(data)
    case EntityRevisionType.EventRevision:
      return new EventRevision(data)
    case EntityRevisionType.ExerciseRevision:
      return new ExerciseRevision(data)
    case EntityRevisionType.ExerciseGroupRevision:
      return new ExerciseGroupRevision(data)
    case EntityRevisionType.GroupedExerciseRevision:
      return new GroupedExerciseRevision(data)
    case EntityRevisionType.SolutionRevision:
      return new SolutionRevision(data)
    case EntityRevisionType.VideoRevision:
      return new VideoRevision(data)
    case DiscriminatorType.Page:
      return new Page(data)
    case DiscriminatorType.PageRevision:
      return new PageRevision(data)
    case DiscriminatorType.User:
      return resolveUser(data)
    case DiscriminatorType.TaxonomyTerm:
      return resolveTaxonomyTerm(data)
  }
}
