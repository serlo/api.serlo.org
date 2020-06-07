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
import { MutationResolver, QueryResolver, TypeResolver } from '../../types'
import { EntityRevisionType, EntityType } from '../abstract-entity'
import { AliasInput } from '../alias'

export enum DiscriminatorType {
  Page = 'Page',
  PageRevision = 'PageRevision',
  User = 'User',
  TaxonomyTerm = 'TaxonomyTerm',
}

export type UuidType =
  | DiscriminatorType
  | EntityType
  | EntityRevisionType
  | 'UnsupportedUuid'

export interface Uuid {
  __typename: UuidType
  id: number
  trashed: boolean
}

export interface UuidPayload {
  id: number
  trashed: boolean
}

export interface UnsupportedUuid extends Uuid {
  __typename: 'UnsupportedUuid'
  discriminator: string
}

export interface UnsupportedUuidPayload {
  discriminator: string
  id: number
  trashed: boolean
}

export interface UuidResolvers {
  Query: {
    uuid: QueryResolver<
      { alias?: AliasInput; id?: number },
      Uuid | UnsupportedUuid
    >
  }
  Mutation: {
    _removeUuid: MutationResolver<{ id: number }>
  }
  Uuid: {
    __resolveType: TypeResolver<Uuid>
  }
}
