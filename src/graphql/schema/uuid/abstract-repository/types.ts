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
import { AbstractRepository, AbstractRevision } from '../../../../types'
import { Resolver, TypeResolver } from '../../types'
import {
  EntityPreResolver,
  EntityRevisionPreResolver,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'
import { DiscriminatorType } from '../abstract-uuid'
import { PagePreResolver, PageRevisionPreResolver } from '../page'
import { UserPreResolver } from '../user'

export type RepositoryType = EntityType | DiscriminatorType.Page

export type RepositoryPreResolver = EntityPreResolver | PagePreResolver
export interface AbstractRepositoryPreResolver
  extends Omit<AbstractRepository, 'currentRevision'> {
  __typename: RepositoryType
  currentRevisionId: number | null
}

export type RepositoryPayload = RepositoryPreResolver
export type AbstractRepositoryPayload = AbstractRepositoryPreResolver

export type RevisionType = EntityRevisionType | DiscriminatorType.PageRevision

export type RevisionPreResolver =
  | EntityRevisionPreResolver
  | PageRevisionPreResolver
export interface AbstractRevisionPreResolver
  extends Omit<AbstractRevision, 'author' | 'repository'> {
  __typename: RevisionType
  authorId: number
  repositoryId: number
}

export type RevisionPayload = RevisionPreResolver
export type AbstractRevisionPayload = AbstractRepositoryPreResolver

export interface AbstractRepositoryResolvers {
  AbstractRepository: {
    __resolveType: TypeResolver<RepositoryPreResolver>
  }
  AbstractRevision: {
    __resolveType: TypeResolver<RevisionPreResolver>
  }
}

export interface RepositoryResolvers<
  E extends AbstractRepositoryPreResolver,
  R extends AbstractRevisionPreResolver
> {
  currentRevision: Resolver<E, never, R | null>
}

export interface RevisionResolvers<
  E extends AbstractRepositoryPreResolver,
  R extends AbstractRevisionPreResolver
> {
  author: Resolver<R, never, Partial<UserPreResolver>>
  repository: Resolver<R, never, E>
}
