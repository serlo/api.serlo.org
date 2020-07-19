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

import { user, user2, article } from '../__fixtures__/uuid'
import {
  UuidPayload,
  ArticlePayload,
  UserPayload,
} from '../src/graphql/schema/uuid'
import { assertSuccessfulGraphQLQuery } from './__utils__/assertions'
import { createTestClient } from './__utils__/test-client'

const server = setupServer()
const { client, cache } = createTestClient()

beforeAll(() => {
  server.listen()
})

afterEach(async () => {
  server.resetHandlers()
  await cache.flush()
})

afterAll(() => {
  server.close()
})

describe('property activeDonor', () => {
  test('when user is an active donor', async () => {
    addUser(user)
    addActiveDonorIds([user.id])

    await expectActiveDonorPropertyToBe(true)
  })

  test('when user is not an active donor', async () => {
    addUser(user)
    addActiveDonorIds([])

    await expectActiveDonorPropertyToBe(false)
  })

  async function expectActiveDonorPropertyToBe(activeDonor: boolean) {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${user.id}) {
            ...on User {
              username
              activeDonor
            }
          }
        }
      `,
      data: {
        uuid: { username: user.username, activeDonor },
      },
      client,
    })
  }
})

describe('endpoint activeDonors', () => {
  test('returns a list of active donors', async () => {
    addUser(user)
    addUser(user2)
    addActiveDonorIds([user.id, user2.id])

    await expectActiveDonors([user, user2])
  })

  test('filter all uuids which are not users', async () => {
    addUser(user)
    addArticle(article)
    addActiveDonorIds([user.id, article.id])

    await expectActiveDonors([user])
  })

  async function expectActiveDonors(users: UserPayload[]) {
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
        activeDonors: users.map((user) => ({
          id: user.id,
          username: user.username,
        })),
      },
      client,
    })
  }
})

describe('parsing of spreadsheet with active donor ids', () => {
  test('extract user ids from first column with omitting the header', async () => {
    addUserWithIDs([1, 2, 3])
    addActiveDonorSheet([['Header', '1', '2', '3']])

    await expectActiveDonorIds([1, 2, 3])
  })

  test('removes entries which are no valid uuids', async () => {
    addUserWithIDs([23])
    addActiveDonorSheet([['Header', '23', 'foo', '-1', '', '1.5']])

    await expectActiveDonorIds([23])
  })

  test('cell entries are trimmed of leading and trailing whitespaces', async () => {
    addUserWithIDs([10, 20])
    addActiveDonorSheet([['Header', ' 10 ', '  20']])

    await expectActiveDonorIds([10, 20])
  })

  test('returns empty list when spreadsheet is empty', async () => {
    addActiveDonorSheet([[]])

    await expectActiveDonorIds([])
  })

  test('returns empty list when an error occured while accessing the spreadsheet', async () => {
    addActiveDonorSheetResponse({})

    await expectActiveDonorIds([])
  })

  async function expectActiveDonorIds(ids: number[]) {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          activeDonors {
            id
          }
        }
      `,
      data: { activeDonors: ids.map((id) => ({ id })) },
      client,
    })
  }
})

function addUserWithIDs(ids: number[]) {
  ids.forEach((id) => addUser({ ...user, id }))
}

function addUser(user: UserPayload) {
  addUuid(user, 'user')
}

function addArticle(article: ArticlePayload) {
  addUuid(article, 'entity')
}

function addUuid(payload: UuidPayload, discriminator: string) {
  server.use(
    rest.get(
      `http://de.${process.env.SERLO_ORG_HOST}/api/uuid/${payload.id}`,
      (_req, res, ctx) => {
        return res.once(
          ctx.status(200),
          ctx.json({ discriminator, ...payload })
        )
      }
    )
  )
}

function addActiveDonorIds(ids: number[]) {
  addActiveDonorSheet([['Header', ...ids.map(String)]])
}

function addActiveDonorSheet(values: string[][]) {
  addActiveDonorSheetResponse({
    range: 'Tabellenblatt1!A:A',
    majorDimension: 'COLUMNS',
    values,
  })
}

function addActiveDonorSheetResponse(response: Record<string, unknown>) {
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/` +
    `${process.env.ACTIVE_DONORS_SPREADSHEET_ID}/values/Tabellenblatt1!A:A` +
    `?majorDimension=COLUMNS&key=${process.env.GOOGLE_API_KEY}`

  server.use(
    rest.get(url, (_req, res, ctx) => {
      return res.once(ctx.status(200), ctx.json(response))
    })
  )
}
