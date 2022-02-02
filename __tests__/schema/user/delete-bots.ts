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
import { rest } from 'msw'

import { article, user, user2 } from '../../../__fixtures__'
import {
  given,
  Client,
  Query,
  Database,
  returnsUuidsFromDatabase,
  MessageResolver,
  createActivityByTypeHandler,
  RestResolver,
  castToUuid,
  assertNoErrorEvents,
  returnsJson,
  assertErrorEvent,
} from '../../__utils__'

let database: Database

let client: Client
const users = [{ ...user, roles: ['sysadmin'] }, user2]
let chatUsers: string[]
let emailHashes: string[]
let mutation: Query

beforeEach(() => {
  client = new Client({ userId: user.id })
  mutation = client.prepareQuery({
    query: gql`
      mutation ($input: UserDeleteBotsInput!) {
        user {
          deleteBots(input: $input) {
            success
          }
        }
      }
    `,
    variables: { input: { botIds: [user.id] } },
  })

  emailHashes = ['foo']

  database = new Database()
  database.hasUuids(users)

  global.server.use(
    ...users.map((user) =>
      createActivityByTypeHandler({
        userId: user.id,
        activityByType: {
          edits: 1,
          comments: 0,
          reviews: 0,
          taxonomy: 0,
        },
      })
    )
  )

  given('UserDeleteBotsMutation').isDefinedBy(
    defaultUserDeleteBotsEndpoint({ database, emailHashes })
  )
  given('UuidQuery').isDefinedBy(returnsUuidsFromDatabase(database))

  chatUsers = [user.username]

  givenChatDeleteUserEndpoint((req, res, ctx) => {
    const { headers, body } = req

    if (
      headers.get('X-Auth-Token') !== process.env.ROCKET_CHAT_API_AUTH_TOKEN ||
      headers.get('X-User-Id') !== process.env.ROCKET_CHAT_API_USER_ID
    )
      return res(ctx.status(400))

    const { username } = body

    if (chatUsers.includes(username)) {
      chatUsers = chatUsers.filter((x) => x !== username)

      return res(ctx.json({ success: true }))
    } else {
      return res(ctx.json({ success: false, errorType: 'error-invalid-user' }))
    }
  })

  givenMailchimpDeleteEmailEndpoint((req, res, ctx) => {
    const authHeader = req.headers.get('Authorization') ?? ''
    const key = Buffer.from(authHeader.slice('Basic '.length), 'base64')
      .toString()
      .split(':')[1]

    if (key !== process.env.MAILCHIMP_API_KEY) return res(ctx.status(405))

    const { emailHash } = req.params

    if (emailHashes.includes(emailHash)) {
      emailHashes = emailHashes.filter((x) => x !== emailHash)

      return res(ctx.status(204))
    } else {
      return res(ctx.status(404))
    }
  })
})

test('runs successfully when mutation could be successfully executed', async () => {
  await mutation
    .withVariables({ input: { botIds: [user.id, user2.id] } })
    .shouldReturnData({ user: { deleteBots: { success: true } } })
})

test('updates the cache', async () => {
  const uuidQuery = client.prepareQuery({
    query: gql`
      query ($id: Int!) {
        uuid(id: $id) {
          id
        }
      }
    `,
    variables: { id: user.id },
  })

  await uuidQuery.execute()
  await mutation.execute()

  await uuidQuery.shouldReturnData({ uuid: null })
})

describe('community chat', () => {
  beforeEach(() => {
    process.env.ENVIRONMENT = 'production'
  })

  test('deletes the user from the community chat in production', async () => {
    await mutation.execute()

    expect(chatUsers).toHaveLength(0)
    await assertNoErrorEvents()
  })

  test('does not sent a sentry event when the user is not in the community chat', async () => {
    await mutation.withVariables({ input: { botIds: [user2.id] } }).execute()

    expect(chatUsers).toHaveLength(1)
    await assertNoErrorEvents()
  })

  test('send a sentry event when the user cannot be deleted from the community chat', async () => {
    givenChatDeleteUserEndpoint(
      returnsJson({ json: { success: false, errorType: 'unknown' } })
    )

    await mutation.withVariables({ input: { botIds: [user2.id] } }).execute()

    await assertErrorEvent({
      message: 'Cannot delete a user from community.serlo.org',
      errorContext: { user: user2 },
    })
  })
})

describe('mailchimp', () => {
  beforeEach(() => {
    process.env.ENVIRONMENT = 'production'
  })

  test('deletes the user from the mailchimp newsletter in production', async () => {
    await mutation.execute()

    expect(emailHashes).toHaveLength(0)
    await assertNoErrorEvents()
  })

  test('does not sent a sentry event when the user is not in the community chat', async () => {
    given('UserDeleteBotsMutation').isDefinedBy(
      defaultUserDeleteBotsEndpoint({ database, emailHashes: ['bar'] })
    )

    await mutation.withVariables({ input: { botIds: [user2.id] } }).execute()

    expect(emailHashes).toHaveLength(1)
    await assertNoErrorEvents()
  })

  test('send a sentry event when the user cannot be deleted', async () => {
    given('UserDeleteBotsMutation').isDefinedBy(
      defaultUserDeleteBotsEndpoint({ database, emailHashes: ['bar'] })
    )

    givenMailchimpDeleteEmailEndpoint(
      returnsJson({ status: 405, json: { errorType: 'unknown' } })
    )

    await mutation.withVariables({ input: { botIds: [user2.id] } }).execute()

    await assertErrorEvent({
      message: 'Cannot delete user from mailchimp',
      errorContext: { emailHash: 'bar' },
    })
  })
})

test('fails when one of the given bot ids is not a user', async () => {
  await mutation
    .withVariables({ input: { botIds: [castToUuid(article.id)] } })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails when one given bot id has more than 4 edits', async () => {
  global.server.use(
    createActivityByTypeHandler({
      userId: user.id,
      activityByType: {
        edits: 5,
        comments: 0,
        reviews: 0,
        taxonomy: 0,
      },
    })
  )

  await mutation.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "sysadmin"', async () => {
  database.hasUuid({ ...user, roles: ['login', 'de_admin'] })

  await mutation.shouldFailWithError('FORBIDDEN')
})

test('fails when database layer has an internal error', async () => {
  given('UserDeleteBotsMutation').hasInternalServerError()

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})

function defaultUserDeleteBotsEndpoint({
  database,
  emailHashes,
}: {
  database: Database
  emailHashes: string[]
}): MessageResolver<string, { botIds: number[] }> {
  return (req, res, ctx) => {
    const { botIds } = req.body.payload

    for (const id of botIds) {
      database.deleteUuid(id)
    }

    return res(ctx.json({ success: true, emailHashes }))
  }
}

function givenChatDeleteUserEndpoint(
  resolver: RestResolver<{ username: string }>
) {
  global.server.use(
    rest.post(`${process.env.ROCKET_CHAT_URL}api/v1/users.delete`, resolver)
  )
}

function givenMailchimpDeleteEmailEndpoint(
  resolver: RestResolver<never, { emailHash: string }>
) {
  const url =
    `https://us5.api.mailchimp.com/3.0/` +
    `lists/a7bb2bbc4f/members/:emailHash/actions/delete-permanent`

  global.server.use(rest.post(url, resolver))
}
