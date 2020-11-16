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
import {
  AbstractRepository,
  AbstractRevision,
  License,
  VideoRevisionsArgs,
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
} from '../../../../types'
import { Connection } from '../../connection'
import { Resolver, TypeResolver } from '../../types'
import {
  EntityPayload,
  EntityRevisionPayload,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'
import { DiscriminatorType, UuidResolvers } from '../abstract-uuid'
import { AliasResolvers } from '../alias'
import { PagePayload, PageRevisionPayload } from '../page'
import { UserPayload } from '../user'

export type RepositoryType = EntityType | DiscriminatorType.Page

export type RepositoryPayload = EntityPayload | PagePayload
export interface AbstractRepositoryPayload
  extends Omit<AbstractRepository, 'alias' | 'currentRevision' | 'license'> {
  __typename: RepositoryType
  alias: string | null
  currentRevisionId: number | null
  revisionIds: number[]
  licenseId: number
}

export type RevisionType = EntityRevisionType | DiscriminatorType.PageRevision

export type RevisionPayload = EntityRevisionPayload | PageRevisionPayload
export interface AbstractRevisionPayload
  extends Omit<AbstractRevision, 'author' | 'repository'> {
  __typename: RevisionType
  authorId: number
  repositoryId: number
}

export interface AbstractRepositoryResolvers {
  AbstractRepository: {
    __resolveType: TypeResolver<RepositoryPayload>
  }
  AbstractRevision: {
    __resolveType: TypeResolver<RevisionPayload>
  }
}

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
  E extends AbstractRepositoryPayload,
  R extends AbstractRevisionPayload
> extends AliasResolvers<E>,
    UuidResolvers {
  currentRevision: Resolver<E, never, R | null>
  revisions: Resolver<E, AbstractRepositoryRevisionsArgs, Connection<R>>
  license: Resolver<E, never, Partial<License>>
}

export interface RevisionResolvers<
  E extends AbstractRepositoryPayload,
  R extends AbstractRevisionPayload
> extends UuidResolvers {
  author: Resolver<R, never, Partial<UserPayload> | null>
  repository: Resolver<R, never, E | null>
}
