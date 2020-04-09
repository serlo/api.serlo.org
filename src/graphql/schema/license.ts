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
import { gql, ForbiddenError } from 'apollo-server'

import { Instance } from './instance'
import { Context, Resolver } from './types'

export const licenseTypeDefs = gql`
  extend type Query {
    license(id: Int!): License
  }

  extend type Mutation {
    _removeLicense(id: Int!): Boolean

    _setLicense(
      id: Int!
      instance: Instance!
      default: Boolean!
      title: String!
      url: String!
      content: String!
      agreement: String!
      iconHref: String!
    ): Boolean
  }

  type License {
    id: Int!
    instance: Instance!
    default: Boolean!
    title: String!
    url: String!
    content: String!
    agreement: String!
    iconHref: String!
  }
`

export interface License {
  id: number
  instance: Instance
  default: boolean
  title: string
  content: string
  agreement: string
  iconHref: string
}

export const licenseResolvers: {
  Query: {
    license: Resolver<undefined, { id: number }, License>
  }
  Mutation: {
    _removeLicense: Resolver<undefined, { id: number }, null>
    _setLicense: Resolver<undefined, License, null>
  }
} = {
  Query: {
    license,
  },
  Mutation: {
    _removeLicense,
    _setLicense,
  },
}

async function license(
  _parent: unknown,
  { id }: { id: number },
  { dataSources }: Context
) {
  return dataSources.serlo.getLicense({ id })
}

async function _removeLicense(
  _parent: unknown,
  { id }: { id: number },
  { dataSources, service }: Context
) {
  if (service !== 'serlo.org') {
    throw new ForbiddenError(
      'You do not have the permissions to remove the license'
    )
  }
  return dataSources.serlo.removeLicense({ id })
}

async function _setLicense(
  _parent: unknown,
  license: License,
  { dataSources, service }: Context
) {
  if (service !== 'serlo.org') {
    throw new ForbiddenError(
      'You do not have the permissions to set the license'
    )
  }
  return dataSources.serlo.setLicense(license)
}
