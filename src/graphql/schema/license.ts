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
import { Schema } from './utils'

export const licenseSchema = new Schema()

/**
 * type License
 */
export interface License {
  id: number
  instance: Instance
  default: boolean
  title: string
  url: string
  content: string
  agreement: string
  iconHref: string
}
licenseSchema.addTypeDef(gql`
  """
  Represents a Serlo.org license, e.g. CC BY-SA 4.0. A license is tied to an \`Instance\` and can be uniquely
  identified by its ID.
  """
  type License {
    """
    ID of the license
    """
    id: Int!
    """
    The \`Instance\` the license is tied to
    """
    instance: Instance!
    """
    \`true\` iff this is the default license in the instance
    """
    default: Boolean!
    """
    Title of the license
    """
    title: String!
    """
    The URL the license should link to (e.g. to the license text or the copyright holder)
    """
    url: String!
    """
    The license notice shown below content
    """
    content: String!
    """
    The agreement that authors need to consent to
    """
    agreement: String!
    """
    The URL of the icon (or \`""\` if there is no icon)
    """
    iconHref: String!
  }
`)

/**
 * query license
 */
licenseSchema.addQuery<unknown, { id: number }, License>(
  'license',
  async (_parent, { id }, { dataSources }) => {
    return dataSources.serlo.getLicense({ id })
  }
)
licenseSchema.addTypeDef(gql`
  extend type Query {
    """
    Returns the \`License\` with the given ID.
    """
    license(
      """
      The ID of the license
      """
      id: Int!
    ): License
  }
`)

/**
 * mutation _removeLicense
 */
licenseSchema.addMutation<unknown, { id: number }, null>(
  '_removeLicense',
  (_parent, { id }, { dataSources, service }) => {
    if (service !== 'serlo.org') {
      throw new ForbiddenError(
        'You do not have the permissions to remove a license'
      )
    }
    return dataSources.serlo.removeLicense({ id })
  }
)
licenseSchema.addTypeDef(gql`
  extend type Mutation {
    """
    Removes the \`License\` with the given ID from cache. May only be called by \`serlo.org\` when a license has been removed.
    """
    _removeLicense(
      """
      The ID of the license
      """
      id: Int!
    ): Boolean
  }
`)

/**
 * mutation _setLicense
 */
licenseSchema.addMutation<unknown, License, null>(
  '_setLicense',
  (_parent, license, { dataSources, service }) => {
    if (service !== 'serlo.org') {
      throw new ForbiddenError(
        'You do not have the permissions to set a license'
      )
    }
    return dataSources.serlo.setLicense(license)
  }
)
licenseSchema.addTypeDef(gql`
  extend type Mutation {
    """
    Inserts the given \`License\` into the cache. May only be called by \`serlo.org\` when a license has been created or updated.
    """
    _setLicense(
      """
      The ID of the license
      """
      id: Int!
      """
      The \`Instance\` the license is tied to
      """
      instance: Instance!
      """
      \`true\` iff this is the default license in the instance
      """
      default: Boolean!
      """
      Title of the license
      """
      title: String!
      """
      The URL the license should link to (e.g. to the license text or the copyright holder)
      """
      url: String!
      """
      The license notice shown below content
      """
      content: String!
      """
      The agreement that authors need to consent to
      """
      agreement: String!
      """
      The URL of the icon (or \`""\` if there is no icon)
      """
      iconHref: String!
    ): Boolean
  }
`)
