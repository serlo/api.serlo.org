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
import { ForbiddenError, gql } from 'apollo-server'

import { Instance } from '../../../types'
import { Service } from '../types'
import { Schema } from '../utils'

export const navigationSchema = new Schema()

export interface Navigation {
  data: string
  path: NavigationNode[]
}
navigationSchema.addTypeDef(gql`
  type Navigation {
    data: String!
    path: [NavigationNode!]!
  }
`)

export interface NavigationNode {
  label: string
  url: string | null
  id: number | null
}
navigationSchema.addTypeDef(gql`
  type NavigationNode {
    label: String!
    url: String
    id: Int
  }
`)

/**
 * mutation _setNavigation
 */
navigationSchema.addMutation<unknown, NavigationPayload, null>(
  '_setNavigation',
  async (_parent, payload, { dataSources, service }) => {
    if (service !== Service.Serlo) {
      throw new ForbiddenError(
        `You do not have the permissions to set the navigation`
      )
    }
    await dataSources.serlo.setNavigation(payload)
  }
)
export interface NavigationPayload {
  data: string
  instance: Instance
}
navigationSchema.addTypeDef(gql`
  extend type Mutation {
    _setNavigation(data: String!, instance: Instance!): Boolean
  }
`)
export function setNavigation(variables: NavigationPayload) {
  return {
    mutation: gql`
      mutation setNavigation($data: String!, $instance: Instance!) {
        _setNavigation(data: $data, instance: $instance)
      }
    `,
    variables,
  }
}
