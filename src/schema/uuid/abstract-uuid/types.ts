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
import { Connection } from '../../connection'
import {
  EntityPayload,
  EntityRevisionPayload,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'
import { PagePayload, PageRevisionPayload } from '../page'
import { TaxonomyTermPayload } from '../taxonomy-term'
import { CommentPayload, ThreadData } from '../thread/types'
import { UserPayload } from '../user'
import { QueryResolver, Resolver, TypeResolver } from '~/internals/graphql'
import { AbstractUuid, AbstractUuidThreadsArgs, QueryUuidArgs } from '~/types'

export enum DiscriminatorType {
  Page = 'Page',
  PageRevision = 'PageRevision',
  User = 'User',
  TaxonomyTerm = 'TaxonomyTerm',
  Comment = 'Comment',
}

export type UuidType = DiscriminatorType | EntityType | EntityRevisionType

export type UuidPayload =
  | EntityPayload
  | EntityRevisionPayload
  | PagePayload
  | PageRevisionPayload
  | UserPayload
  | TaxonomyTermPayload
  | CommentPayload
export interface AbstractUuidPayload
  extends Omit<AbstractUuid, keyof UuidResolvers> {
  __typename: UuidType
  alias: string | null
}

export interface UuidResolvers {
  alias: Resolver<AbstractUuidPayload, never, string | null>
  threads: Resolver<
    AbstractUuidPayload,
    AbstractUuidThreadsArgs,
    Connection<ThreadData>
  >
}
export interface AbstractUuidResolvers {
  AbstractUuid: {
    __resolveType: TypeResolver<UuidPayload>
  }
  Query: {
    uuid: QueryResolver<QueryUuidArgs, UuidPayload | null>
  }
}
