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
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import {
  license,
  createLicenseQuery,
  createRemoveLicenseMutation,
  createSetLicenseMutation,
} from '../../__fixtures__/license'
import { Service } from '../../src/graphql/schema/types'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  assertSuccessfulGraphQLQuery,
} from '../__utils__/assertions'
import { createTestClient } from '../__utils__/test-client'

const server = setupServer(
  rest.get(
    `http://de.${process.env.SERLO_ORG_HOST}/api/license/1`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(license))
    }
  )
)

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

test('license', async () => {
  const { client } = createTestClient({
    service: Service.Playground,
    user: null,
  })
  await assertSuccessfulGraphQLQuery({
    ...createLicenseQuery(license),
    data: {
      license,
    },
    client,
  })
})
