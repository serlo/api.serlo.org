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
import { TaxonomyTermChildrenArgs, TaxonomyTerm } from '../../../../types'
import { Connection } from '../../connection'
import { Resolver } from '../../types'
import { NavigationChildResolvers } from '../abstract-navigation-child'
import { AbstractUuidPayload, DiscriminatorType } from '../abstract-uuid'

export interface TaxonomyTermPayload
  extends Omit<TaxonomyTerm, keyof TaxonomyTermResolvers['TaxonomyTerm']> {
  __typename: DiscriminatorType.TaxonomyTerm
  alias: string | null
  parentId: number | null
  childrenIds: number[]
}

export interface TaxonomyTermResolvers {
  TaxonomyTerm: {
    alias: Resolver<TaxonomyTermPayload, never, string | null>
    parent: Resolver<TaxonomyTermPayload, never, TaxonomyTermPayload | null>
    children: Resolver<
      TaxonomyTermPayload,
      TaxonomyTermChildrenArgs,
      Connection<AbstractUuidPayload>
    >
  } & NavigationChildResolvers<TaxonomyTermPayload>
}
