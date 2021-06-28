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
import { gql } from 'apollo-server'

import { license } from '../../__fixtures__'
import {
  assertSuccessfulGraphQLQuery,
  createLicenseHandler,
  createMessageHandler,
  createTestClient,
} from '../__utils__'

// Next: change type of decoder => search for getLicense()
const query = gql`
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
`

test('license', async () => {
  global.server.use(createLicenseHandler(license))
  await assertSuccessfulGraphQLQuery({
    query,
    variables: { id: license.id },
    data: { license },
    client: createTestClient(),
  })
})

test('license returns null when queried with a certain id', async () => {
  global.server.use(
    createMessageHandler({
      message: {
        type: 'LicenseQuery',
        payload: { id: 100 },
      },
      statusCode: 404,
      body: null,
    })
  )
  await assertSuccessfulGraphQLQuery({
    query,
    variables: { id: 100 },
    data: { license: null },
    client: createTestClient(),
  })
})
