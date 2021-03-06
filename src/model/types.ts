/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import * as t from 'io-ts'
import { A } from 'ts-toolbelt'

import { CommentDecoder, VideoDecoder, VideoRevisionDecoder } from './decoder'
import { createSerloModel } from './serlo'
import { Connection } from '~/schema/connection/types'
import {
  AppletPayload,
  AppletRevisionPayload,
} from '~/schema/uuid/applet/types'
import {
  ArticlePayload,
  ArticleRevisionPayload,
} from '~/schema/uuid/article/types'
import {
  CoursePagePayload,
  CoursePageRevisionPayload,
} from '~/schema/uuid/course-page/types'
import {
  CoursePayload,
  CourseRevisionPayload,
} from '~/schema/uuid/course/types'
import { EventPayload, EventRevisionPayload } from '~/schema/uuid/event/types'
import {
  ExerciseGroupPayload,
  ExerciseGroupRevisionPayload,
} from '~/schema/uuid/exercise-group/types'
import {
  ExercisePayload,
  ExerciseRevisionPayload,
} from '~/schema/uuid/exercise/types'
import {
  GroupedExercisePayload,
  GroupedExerciseRevisionPayload,
} from '~/schema/uuid/grouped-exercise/types'
import { PagePayload, PageRevisionPayload } from '~/schema/uuid/page/types'
import {
  SolutionPayload,
  SolutionRevisionPayload,
} from '~/schema/uuid/solution/types'
import { TaxonomyTermPayload } from '~/schema/uuid/taxonomy-term/types'
import { UserPayload } from '~/schema/uuid/user/types'

export interface Models {
  Applet: AppletPayload
  AppletRevision: AppletRevisionPayload
  Article: ArticlePayload
  ArticleRevision: ArticleRevisionPayload
  Comment: t.TypeOf<typeof CommentDecoder>
  CoursePage: CoursePagePayload
  CoursePageRevision: CoursePageRevisionPayload
  Course: CoursePayload
  CourseRevision: CourseRevisionPayload
  Event: EventPayload
  EventRevision: EventRevisionPayload
  ExerciseGroup: ExerciseGroupPayload
  ExerciseGroupRevision: ExerciseGroupRevisionPayload
  Exercise: ExercisePayload
  ExerciseRevision: ExerciseRevisionPayload
  GroupedExercise: GroupedExercisePayload
  GroupedExerciseRevision: GroupedExerciseRevisionPayload
  Mutation: Record<string, never>
  Navigation: Payload<'getNavigation'>
  License: Payload<'getLicense'>
  Page: PagePayload
  PageRevision: PageRevisionPayload
  Query: Record<string, never>
  Solution: SolutionPayload
  SolutionRevision: SolutionRevisionPayload
  TaxonomyTerm: TaxonomyTermPayload
  Thread: {
    __typename: 'Thread'
    commentPayloads: Models['Comment'][]
  }
  User: UserPayload
  Video: t.TypeOf<typeof VideoDecoder>
  VideoRevision: t.TypeOf<typeof VideoRevisionDecoder>
}

// TODO: Is there a better way to handle primitive types?
export type Model<T> = T extends boolean | string | number | null
  ? T
  : Typename<T> extends keyof Models
  ? Models[Typename<T>]
  : T extends { nodes: Array<infer U>; totalCount: number }
  ? Connection<Model<U>>
  : T extends (infer U)[]
  ? Model<U>[]
  : T extends object
  ? { [P in keyof T]: Model<T[P]> }
  : never

export type Typename<T> = T extends { __typename?: infer U }
  ? U extends string
    ? U
    : never
  : never

export type Payload<T extends keyof SerloModel> = NonNullable<
  A.PromiseOf<ReturnType<SerloModel[T]>>
>

type SerloModel = ReturnType<typeof createSerloModel>
