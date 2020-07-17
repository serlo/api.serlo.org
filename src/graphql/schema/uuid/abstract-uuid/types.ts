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
import { Mutation_RemoveUuidArgs, QueryUuidArgs, Uuid } from '../../../../types'
import { MutationResolver, QueryResolver, TypeResolver } from '../../types'
import {
  EntityPreResolver,
  EntityRevisionPreResolver,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'
import { PagePayload, PageRevisionPayload } from '../page'
import { TaxonomyTermPayload } from '../taxonomy-term'
import { UserPayload } from '../user'

export enum DiscriminatorType {
  Page = 'Page',
  PageRevision = 'PageRevision',
  User = 'User',
  TaxonomyTerm = 'TaxonomyTerm',
}

export type UuidType = DiscriminatorType | EntityType | EntityRevisionType

export type UuidPreResolver =
  | EntityPreResolver
  | EntityRevisionPreResolver
  | PagePayload
  | PageRevisionPayload
  | UserPayload
  | TaxonomyTermPayload
export interface AbstractUuidPreResolver extends Uuid {
  __typename: UuidType
}

export type UuidPayload = UuidPreResolver
export type AbstractUuidPayload = AbstractUuidPreResolver

export interface UuidResolvers {
  Uuid: {
    // FIXME: this should be UuidPreResolver when refactoring is done
    __resolveType: TypeResolver<AbstractUuidPreResolver>
  }
  Query: {
    // FIXME: this should be UuidPreResolver when refactoring is done
    uuid: QueryResolver<QueryUuidArgs, AbstractUuidPreResolver>
  }
  Mutation: {
    _removeUuid: MutationResolver<Mutation_RemoveUuidArgs>
  }
}
