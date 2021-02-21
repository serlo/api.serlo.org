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

import { InstanceDecoder } from '~/schema/instance/decoder'
import {
  EntityRevisionType,
  EntityType,
} from '~/schema/uuid/abstract-entity/types'
import { AbstractUuidPayloadDecoder } from '~/schema/uuid/abstract-uuid/decoder'

export const EntityTypeDecoder: t.Type<EntityType> = t.union([
  t.literal(EntityType.Applet),
  t.literal(EntityType.Article),
  t.literal(EntityType.Course),
  t.literal(EntityType.CoursePage),
  t.literal(EntityType.Event),
  t.literal(EntityType.Exercise),
  t.literal(EntityType.ExerciseGroup),
  t.literal(EntityType.GroupedExercise),
  t.literal(EntityType.Solution),
  t.literal(EntityType.Video),
])

export const AbstractEntityPayloadDecoder = t.intersection([
  AbstractUuidPayloadDecoder,
  t.type({
    __typename: EntityTypeDecoder,
    instance: InstanceDecoder,
    date: t.string,
    licenseId: t.number,
    currentRevisionId: t.union([t.number, t.null]),
    revisionIds: t.array(t.number),
  }),
])

export const EntityRevisionTypeDecoder: t.Type<EntityRevisionType> = t.union([
  t.literal(EntityRevisionType.AppletRevision),
  t.literal(EntityRevisionType.ArticleRevision),
  t.literal(EntityRevisionType.CourseRevision),
  t.literal(EntityRevisionType.CoursePageRevision),
  t.literal(EntityRevisionType.EventRevision),
  t.literal(EntityRevisionType.ExerciseRevision),
  t.literal(EntityRevisionType.ExerciseGroupRevision),
  t.literal(EntityRevisionType.GroupedExerciseRevision),
  t.literal(EntityRevisionType.SolutionRevision),
  t.literal(EntityRevisionType.VideoRevision),
])

export const AbstractEntityRevisionPayloadDecoder = t.intersection([
  AbstractUuidPayloadDecoder,
  t.type({
    __typename: EntityRevisionTypeDecoder,
    content: t.string,
    date: t.string,
    authorId: t.number,
    repositoryId: t.number,
    changes: t.string,
  }),
])
