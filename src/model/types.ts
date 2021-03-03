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

import { Connection } from '~/schema/connection/types'
import { InstanceDecoder } from '~/schema/instance/decoder'
import { UuidPayload } from '~/schema/uuid/abstract-uuid/types'

export interface Models {
  Mutation: Record<string, never>
  Query: Record<string, never>
  License: t.TypeOf<typeof LicenseDecoder>
  Comment: UuidPayload
  Applet: UuidPayload
  AppletRevision: UuidPayload
  Article: UuidPayload
  ArticleRevision: UuidPayload
  CoursePage: UuidPayload
  CoursePageRevision: UuidPayload
  Course: UuidPayload
  CourseRevision: UuidPayload
  Event: UuidPayload
  EventRevision: UuidPayload
  ExerciseGroup: UuidPayload
  ExerciseGroupRevision: UuidPayload
  Exercise: UuidPayload
  ExerciseRevision: UuidPayload
  GroupedExercise: UuidPayload
  GroupedExerciseRevision: UuidPayload
  Page: UuidPayload
  PageRevision: UuidPayload
  Solution: UuidPayload
  SolutionRevision: UuidPayload
  TaxonomyTerm: UuidPayload
  User: UuidPayload
  Video: UuidPayload
  VideoRevision: UuidPayload
}

export const LicenseDecoder = t.type({
  id: t.number,
  instance: InstanceDecoder,
  default: t.boolean,
  title: t.string,
  url: t.string,
  content: t.string,
  agreement: t.string,
  iconHref: t.string,
})

// TODO: Is there a better way to handle primitive types?
export type Model<T> = T extends boolean
  ? boolean
  : Typename<T> extends keyof Models
  ? Models[Typename<T>]
  : T extends { nodes: Array<infer U> }
  ? Connection<Model<U>>
  : T extends (infer U)[]
  ? Model<U>[]
  : T extends object
  ? { [P in keyof T]: Model<T[P]> }
  : T

export type Typename<T> = T extends { __typename?: infer U }
  ? U extends string
    ? U
    : never
  : never
