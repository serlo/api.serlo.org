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
import { AppletPayload, AppletRevisionPayload } from '../applet'
import { ArticlePayload, ArticleRevisionPayload } from '../article'
import { CoursePayload, CourseRevisionPayload } from '../course'
import { CoursePagePayload, CoursePageRevisionPayload } from '../course-page'
import { EventPayload, EventRevisionPayload } from '../event'
import { ExercisePayload, ExerciseRevisionPayload } from '../exercise'
import {
  ExerciseGroupPayload,
  ExerciseGroupRevisionPayload,
} from '../exercise-group'
import {
  GroupedExercisePayload,
  GroupedExerciseRevisionPayload,
} from '../grouped-exercise'
import { SolutionPayload, SolutionRevisionPayload } from '../solution'
import { VideoPayload, VideoRevisionPayload } from '../video'
import { TypeResolver } from '~/internals/graphql'
import { AbstractEntity, AbstractEntityRevision } from '~/types'

export enum EntityType {
  Applet = 'Applet',
  Article = 'Article',
  Course = 'Course',
  CoursePage = 'CoursePage',
  Event = 'Event',
  Exercise = 'Exercise',
  ExerciseGroup = 'ExerciseGroup',
  GroupedExercise = 'GroupedExercise',
  Solution = 'Solution',
  Video = 'Video',
}

export type EntityPayload =
  | AppletPayload
  | ArticlePayload
  | CoursePayload
  | CoursePagePayload
  | EventPayload
  | ExercisePayload
  | ExerciseGroupPayload
  | GroupedExercisePayload
  | SolutionPayload
  | VideoPayload
export interface AbstractEntityPayload
  extends Omit<AbstractEntity, 'alias' | 'currentRevision' | 'license'> {
  __typename: EntityType
  alias: string | null
  currentRevisionId: number | null
  revisionIds: number[]
  licenseId: number
}

export enum EntityRevisionType {
  ArticleRevision = 'ArticleRevision',
  AppletRevision = 'AppletRevision',
  CourseRevision = 'CourseRevision',
  CoursePageRevision = 'CoursePageRevision',
  EventRevision = 'EventRevision',
  ExerciseRevision = 'ExerciseRevision',
  ExerciseGroupRevision = 'ExerciseGroupRevision',
  GroupedExerciseRevision = 'GroupedExerciseRevision',
  SolutionRevision = 'SolutionRevision',
  VideoRevision = 'VideoRevision',
}

export type EntityRevisionPayload =
  | AppletRevisionPayload
  | ArticleRevisionPayload
  | CourseRevisionPayload
  | CoursePageRevisionPayload
  | EventRevisionPayload
  | ExerciseRevisionPayload
  | ExerciseGroupRevisionPayload
  | GroupedExerciseRevisionPayload
  | SolutionRevisionPayload
  | VideoRevisionPayload
export interface AbstractEntityRevisionPayload
  extends Omit<AbstractEntityRevision, 'author' | 'repository'> {
  __typename: EntityRevisionType
  authorId: number
  repositoryId: number
}

export interface AbstractEntityResolvers {
  AbstractEntity: {
    __resolveType: TypeResolver<EntityPayload>
  }
  AbstractEntityRevision: {
    __resolveType: TypeResolver<EntityRevisionPayload>
  }
}
