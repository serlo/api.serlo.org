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
import { Resolver, TypeResolver } from '~/internals/graphql'
import { Connection } from '~/schema/connection/types'
import { ThreadAwareResolvers } from '~/schema/thread/types'
import {
  EntityPayload,
  EntityRevisionPayload,
  EntityRevisionType,
  EntityType,
} from '~/schema/uuid/abstract-entity/types'
import {
  DiscriminatorType,
  UuidResolvers,
} from '~/schema/uuid/abstract-uuid/types'
import { PagePayload, PageRevisionPayload } from '~/schema/uuid/page/types'
import { UserPayload } from '~/schema/uuid/user/types'
import {
  AbstractRepository,
  AbstractRevision,
  AppletRevisionsArgs,
  ArticleRevisionsArgs,
  CoursePageRevisionsArgs,
  CourseRevisionsArgs,
  EventRevisionsArgs,
  ExerciseGroupRevisionsArgs,
  ExerciseRevisionsArgs,
  GroupedExerciseRevisionsArgs,
  License,
  PageRevisionsArgs,
  SolutionRevisionsArgs,
  VideoRevisionsArgs,
} from '~/types'

export type RepositoryType = EntityType | DiscriminatorType.Page

export type RepositoryPayload = EntityPayload | PagePayload
export interface AbstractRepositoryPayload
  extends Omit<
    AbstractRepository,
    // Remove everything that has its own resolver
    keyof RepositoryResolvers<
      AbstractRepositoryPayload,
      AbstractRevisionPayload
    >
  > {
  __typename: RepositoryType
  alias: string | null
  currentRevisionId: number | null
  revisionIds: number[]
  licenseId: number
}

export type RevisionType = EntityRevisionType | DiscriminatorType.PageRevision

export type RevisionPayload = EntityRevisionPayload | PageRevisionPayload
export interface AbstractRevisionPayload
  extends Omit<AbstractRevision, 'author' | 'repository' | 'threads'> {
  __typename: RevisionType
  alias: string | null
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
> extends UuidResolvers,
    ThreadAwareResolvers {
  currentRevision: Resolver<E, never, R | null>
  revisions: Resolver<E, AbstractRepositoryRevisionsArgs, Connection<R>>
  license: Resolver<E, never, Partial<License>>
}

export interface RevisionResolvers<
  E extends AbstractRepositoryPayload,
  R extends AbstractRevisionPayload
> extends UuidResolvers,
    ThreadAwareResolvers {
  author: Resolver<R, never, Partial<UserPayload> | null>
  repository: Resolver<R, never, E | null>
}
