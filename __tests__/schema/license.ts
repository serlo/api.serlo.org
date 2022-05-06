/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { gql } from 'apollo-server'

import { license } from '../../__fixtures__'
import { Client } from '../__utils__'
import { licenses } from '~/config'

const licenseQuery = new Client().prepareQuery({
  query: gql`
    query license($id: Int!) {
      license {
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
    }
  `,
})

const licensesQuery = new Client().prepareQuery({
  query: gql`
    query licenses($instance: Instance) {
      license {
        licenses(instance: $instance) {
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
    }
  `,
})

describe('endpoint "license"', () => {
  test('returns one license', async () => {
    await licenseQuery
      .withVariables({ id: license.id })
      .shouldReturnData({ license: { license } })
  })

  test('returns null when license with given id does not exist', async () => {
    await licenseQuery
      .withVariables({ id: 100 })
      .shouldReturnData({ license: { license: null } })
  })
})

describe('endpoint "licenses"', () => {
  test('returns array of licenses filtered by instance', async () => {
    await licensesQuery
      .withVariables({ instance: 'en' })
      .shouldReturnData({ license: { licenses: [licenses[8]] } })
  })

  test('returns all licenses when used without filter', async () => {
    await licensesQuery.shouldReturnData({ license: { licenses } })
  })

  test('returns undefined when instance does not exist', async () => {
    await licensesQuery
      .withVariables({ instance: 'xx' })
      .shouldReturnData(undefined)
  })
})
