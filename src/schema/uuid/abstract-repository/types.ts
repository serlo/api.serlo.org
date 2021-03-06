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
import { Resolver } from '~/internals/graphql'
import { Connection } from '~/schema/connection/types'
import { PickResolvers } from '~/schema/utils'
import {
  EntityPayload,
  EntityRevisionPayload,
  EntityRevisionType,
  EntityType,
} from '~/schema/uuid/abstract-entity/types'
import { DiscriminatorType } from '~/schema/uuid/abstract-uuid/types'
import { PagePayload, PageRevisionPayload } from '~/schema/uuid/page/types'
import {
  AppletRevisionsArgs,
  ArticleRevisionsArgs,
  CoursePageRevisionsArgs,
  CourseRevisionsArgs,
  EventRevisionsArgs,
  ExerciseGroupRevisionsArgs,
  ExerciseRevisionsArgs,
  GroupedExerciseRevisionsArgs,
  PageRevisionsArgs,
  SolutionRevisionsArgs,
  VideoRevisionsArgs,
} from '~/types'

export type RepositoryType = EntityType | DiscriminatorType.Page

export type RepositoryPayload = EntityPayload | PagePayload
export type AbstractRepositoryPayload = RepositoryPayload

export type RevisionPayload = EntityRevisionPayload | PageRevisionPayload
export type RevisionType = EntityRevisionType | DiscriminatorType.PageRevision
export type AbstractRevisionPayload = RevisionPayload

type AbstractRepositoryRevisionsArgs =
  | AppletRevisionsArgs
  | ArticleRevisionsArgs
  | CoursePageRevisionsArgs
  | CourseRevisionsArgs
  | EventRevisionsArgs
  | ExerciseGroupRevisionsArgs
  | ExerciseRevisionsArgs
  | GroupedExerciseRevisionsArgs
  | PageRevisionsArgs
  | SolutionRevisionsArgs
  | VideoRevisionsArgs

export interface RepositoryResolvers<
  E extends RepositoryPayload,
  R extends RevisionPayload
> extends PickResolvers<'AbstractRepository', 'threads' | 'alias' | 'license'> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  currentRevision: Resolver<E, {}, R | null>
  revisions: Resolver<E, AbstractRepositoryRevisionsArgs, Connection<R>>
}

export interface RevisionResolvers<
  E extends RepositoryPayload,
  R extends RevisionPayload
> extends PickResolvers<'AbstractRevision', 'threads' | 'alias' | 'author'> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  repository: Resolver<R, {}, E>
}
