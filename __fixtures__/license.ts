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
import { gql } from 'apollo-server'

import { Instance } from '../src/graphql/schema/instance'
import { License, LicensePayload } from '../src/graphql/schema/license'

export const license: License = {
  id: 1,
  instance: Instance.De,
  default: true,
  title: 'title',
  url: 'url',
  content: 'content',
  agreement: 'agreement',
  iconHref: 'iconHref',
}

export function createLicenseQuery(variables: { id: number }) {
  return {
    query: gql`
      query license($id: Int!) {
        license(id: $id) {
          id
          instance
          default
          title
          url
          content
          agreement
          iconHref
        }
      }
    `,
    variables,
  }
}

export function createRemoveLicenseMutation(variables: { id: number }) {
  return {
    mutation: gql`
      mutation removeLicense($id: Int!) {
        _removeLicense(id: $id)
      }
    `,
    variables,
  }
}

export function createSetLicenseMutation(variables: LicensePayload) {
  return {
    mutation: gql`
      mutation setLicense(
        $id: Int!
        $instance: Instance!
        $default: Boolean!
        $title: String!
        $url: String!
        $content: String!
        $agreement: String!
        $iconHref: String!
      ) {
        _setLicense(
          id: $id
          instance: $instance
          default: $default
          title: $title
          url: $url
          content: $content
          agreement: $agreement
          iconHref: $iconHref
        )
      }
    `,
    variables,
  }
}
