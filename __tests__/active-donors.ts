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
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { env } from 'process'

import { user, user2, article } from '../__fixtures__/uuid'
import { UuidPayload } from '../src/graphql/schema/uuid'
import { assertSuccessfulGraphQLQuery } from './__utils__/assertions'
import { createTestClient } from './__utils__/test-client'

const server = setupServer()
const { client } = createTestClient()

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

describe('endpoint activeDonors', () => {
  test('returns a list of active donors', async () => {
    addUuid(user)
    addUuid(user2)
    addActiveDonorIds([user.id, user2.id])

    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          activeDonors {
            id
            username
          }
        }
      `,
      data: {
        activeDonors: [
          { id: user.id, username: user.username },
          { id: user2.id, username: user2.username },
        ],
      },
      client,
    })
  })

  test('filter all uuids which are not users', async () => {
    addUuid(user)
    addUuid(article)
    addActiveDonorIds([user.id, article.id])

    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          activeDonors {
            id
            username
          }
        }
      `,
      data: { activeDonors: [{ id: user.id, username: user.username }] },
      client,
    })
  })
})

function addUuid(payload: UuidPayload) {
  server.use(
    rest.get(
      `http://de.${env.SERLO_ORG_HOST}/api/uuid/${payload.id}`,
      (_req, res, ctx) => {
        return res.once(ctx.status(200), ctx.json(payload))
      }
    )
  )
}

function addActiveDonorIds(ids: number[]) {
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/` +
    `${env.ACTIVE_DONORS_SPREADSHEET_ID}/values/Tabellenblatt1!A:A` +
    `?majorDimension=COLUMNS&key=${env.GOOGLE_API_KEY}`

  server.use(
    rest.get(url, (_req, res, ctx) => {
      return res.once(
        ctx.status(200),
        ctx.json({
          range: 'Tabellenblatt1!A:A',
          majorDimension: 'COLUMNS',
          values: [['Header', ...ids.map(String)]],
        })
      )
    })
  )
}
