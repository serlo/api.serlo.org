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
  // Enable the mocking before all tests
  server.listen()
})

afterAll(() => {
  // Clean up the mocking once done
  server.close()
})

test('license', async () => {
  const { client } = createTestClient()
  await assertSuccessfulGraphQLQuery({
    ...createLicenseQuery(license),
    data: {
      license,
    },
    client,
  })
})

test('_removeLicense (forbidden)', async () => {
  const { client } = createTestClient({ service: Service.Playground })
  await assertFailingGraphQLMutation(
    {
      ...createRemoveLicenseMutation(license),
      client,
    },
    (errors) => {
      expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
    }
  )
})

test('_removeLicense (authenticated)', async () => {
  const { client } = createTestClient({ service: Service.Serlo })
  await assertSuccessfulGraphQLMutation({
    ...createRemoveLicenseMutation(license),
    client,
  })
  await assertSuccessfulGraphQLQuery({
    ...createLicenseQuery(license),
    data: { license: null },
    client,
  })
})

test('_setLicense (forbidden)', async () => {
  const { client } = createTestClient({ service: Service.Playground })
  await assertFailingGraphQLMutation(
    {
      ...createSetLicenseMutation(license),
      client,
    },
    (errors) => {
      expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
    }
  )
})

test('_setLicense (authenticated)', async () => {
  const { client } = createTestClient({ service: Service.Serlo })
  await assertSuccessfulGraphQLMutation({
    ...createSetLicenseMutation(license),
    client,
  })
  await assertSuccessfulGraphQLQuery({
    ...createLicenseQuery(license),
    data: {
      license,
    },
    client,
  })
})
