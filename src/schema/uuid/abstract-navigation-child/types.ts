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
import { PagePayload } from '~/schema/uuid/page/types'
import { TaxonomyTermPayload } from '~/schema/uuid/taxonomy-term/types'
import { Instance, NavigationNode, NavigationPathArgs } from '~/types'

export type NavigationChildPayload = TaxonomyTermPayload | PagePayload

export interface Navigation {
  data: NodeData
  path: NavigationNode[]
}

export interface NavigationPayload {
  data: NodeData[]
  instance: Instance
}

export interface NodeData {
  label: string
  id?: number
  url?: string
  children?: NodeData[]
}

export interface AbstractNavigationChildResolvers {
  AbstractNavigationChild: {
    __resolveType: TypeResolver<NavigationChildPayload>
  }
  Navigation: {
    path: Resolver<Navigation, NavigationPathArgs, Connection<NavigationNode>>
  }
}
