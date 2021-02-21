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

import { CommentPayloadDecoder } from '~/schema/thread/decoder'
import {
  EntityPayload,
  EntityRevisionPayload,
} from '~/schema/uuid/abstract-entity/types'
import { UuidPayload } from '~/schema/uuid/abstract-uuid/types'
import {
  AppletDecoder,
  AppletRevisionDecoder,
} from '~/schema/uuid/applet/decoder'
import {
  ArticleDecoder,
  ArticleRevisionDecoder,
} from '~/schema/uuid/article/decoder'
import {
  CoursePageDecoder,
  CoursePageRevisionDecoder,
} from '~/schema/uuid/course-page/decoder'
import {
  CourseDecoder,
  CourseRevisionDecoder,
} from '~/schema/uuid/course/decoder'
import { EventDecoder, EventRevisionDecoder } from '~/schema/uuid/event/decoder'
import {
  ExerciseGroupDecoder,
  ExerciseGroupRevisionDecoder,
} from '~/schema/uuid/exercise-group/decoder'
import {
  ExerciseDecoder,
  ExerciseRevisionDecoder,
} from '~/schema/uuid/exercise/decoder'
import {
  GroupedExerciseDecoder,
  GroupedExerciseRevisionDecoder,
} from '~/schema/uuid/grouped-exercise/decoder'
import {
  PagePayloadDecoder,
  PageRevisionPayloadDecoder,
} from '~/schema/uuid/page/decoder'
import {
  SolutionDecoder,
  SolutionRevisionDecoder,
} from '~/schema/uuid/solution/decoder'
import { TaxonomyTermPayloadDecoder } from '~/schema/uuid/taxonomy-term/decoder'
import { UserPayloadDecoder } from '~/schema/uuid/user/decoder'
import { VideoDecoder, VideoRevisionDecoder } from '~/schema/uuid/video/decoder'

export const EntityPayloadDecoder: t.Type<EntityPayload> = t.union([
  AppletDecoder,
  ArticleDecoder,
  CourseDecoder,
  CoursePageDecoder,
  EventDecoder,
  ExerciseDecoder,
  ExerciseGroupDecoder,
  GroupedExerciseDecoder,
  SolutionDecoder,
  VideoDecoder,
])

export const EntityRevisionPayloadDecoder: t.Type<EntityRevisionPayload> = t.union(
  [
    AppletRevisionDecoder,
    ArticleRevisionDecoder,
    CourseRevisionDecoder,
    CoursePageRevisionDecoder,
    EventRevisionDecoder,
    ExerciseRevisionDecoder,
    ExerciseGroupRevisionDecoder,
    GroupedExerciseRevisionDecoder,
    SolutionRevisionDecoder,
    VideoRevisionDecoder,
  ]
)

export const UuidPayloadDecoder: t.Type<UuidPayload> = t.union([
  CommentPayloadDecoder,
  EntityPayloadDecoder,
  EntityRevisionPayloadDecoder,
  PagePayloadDecoder,
  PageRevisionPayloadDecoder,
  TaxonomyTermPayloadDecoder,
  UserPayloadDecoder,
])
