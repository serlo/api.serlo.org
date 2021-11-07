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
import { rest } from 'msw'

import { article, user, user2 } from '../../../__fixtures__'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  createTestClient,
  givenUuidQueryEndpoint,
  hasInternalServerError,
  Client,
  Database,
  returnsUuidsFromDatabase,
  MessageResolver,
  givenSerloEndpoint,
  assertSuccessfulGraphQLQuery,
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

beforeEach(() => {
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

  givenUserDeleteBotsEndpoint(
    defaultUserDeleteBotsEndpoint({ database, emailHashes })
  )
  givenUuidQueryEndpoint(returnsUuidsFromDatabase(database))

  client = createTestClient({ userId: user.id })

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
    const key = Buffer.from(authHeader.substr('Basic '.length), 'base64')
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
  await assertSuccessfulGraphQLMutation({
    ...createDeleteBotsMutation({ botIds: [user.id, user2.id] }),
    data: { user: { deleteBots: { success: true } } },
    client,
  })
})

test('updates the cache', async () => {
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query ($id: Int!) {
        uuid(id: $id) {
          id
        }
      }
    `,
    variables: { id: user.id },
    data: { uuid: { id: user.id } },
    client,
  })

  await assertSuccessfulGraphQLMutation({
    ...createDeleteBotsMutation({ botIds: [user.id] }),
    data: { user: { deleteBots: { success: true } } },
    client,
  })

  await assertSuccessfulGraphQLQuery({
    query: gql`
      query ($id: Int!) {
        uuid(id: $id) {
          id
        }
      }
    `,
    variables: { id: user.id },
    data: { uuid: null },
    client,
  })
})

describe('community chat', () => {
  beforeEach(() => {
    process.env.ENVIRONMENT = 'production'
  })

  test('deletes the user from the community chat in production', async () => {
    await assertSuccessfulGraphQLMutation({
      ...createDeleteBotsMutation({ botIds: [user.id] }),
      data: { user: { deleteBots: { success: true } } },
      client,
    })

    expect(chatUsers).toHaveLength(0)
    await assertNoErrorEvents()
  })

  test('does not sent a sentry event when the user is not in the community chat', async () => {
    await assertSuccessfulGraphQLMutation({
      ...createDeleteBotsMutation({ botIds: [user2.id] }),
      data: { user: { deleteBots: { success: true } } },
      client,
    })

    expect(chatUsers).toHaveLength(1)
    await assertNoErrorEvents()
  })

  test('send a sentry event when the user cannot be deleted from the community chat', async () => {
    givenChatDeleteUserEndpoint(
      returnsJson({ json: { success: false, errorType: 'unknown' } })
    )

    await assertSuccessfulGraphQLMutation({
      ...createDeleteBotsMutation({ botIds: [user2.id] }),
      data: { user: { deleteBots: { success: true } } },
      client,
    })

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
    await assertSuccessfulGraphQLMutation({
      ...createDeleteBotsMutation({ botIds: [user.id] }),
      data: { user: { deleteBots: { success: true } } },
      client,
    })

    expect(emailHashes).toHaveLength(0)
    await assertNoErrorEvents()
  })

  test('does not sent a sentry event when the user is not in the community chat', async () => {
    givenUserDeleteBotsEndpoint(
      defaultUserDeleteBotsEndpoint({ database, emailHashes: ['bar'] })
    )

    await assertSuccessfulGraphQLMutation({
      ...createDeleteBotsMutation({ botIds: [user2.id] }),
      data: { user: { deleteBots: { success: true } } },
      client,
    })

    expect(emailHashes).toHaveLength(1)
    await assertNoErrorEvents()
  })

  test('send a sentry event when the user cannot be deleted', async () => {
    givenUserDeleteBotsEndpoint(
      defaultUserDeleteBotsEndpoint({ database, emailHashes: ['bar'] })
    )
    givenMailchimpDeleteEmailEndpoint(
      returnsJson({ status: 405, json: { errorType: 'unknown' } })
    )

    await assertSuccessfulGraphQLMutation({
      ...createDeleteBotsMutation({ botIds: [user2.id] }),
      data: { user: { deleteBots: { success: true } } },
      client,
    })

    await assertErrorEvent({
      message: 'Cannot delete user from mailchimp',
      errorContext: { emailHash: 'bar' },
    })
  })
})

test('fails when one of the given bot ids is not a user', async () => {
  await assertFailingGraphQLMutation({
    ...createDeleteBotsMutation({ botIds: [castToUuid(article.id)] }),
    client,
    expectedError: 'BAD_USER_INPUT',
  })
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

  await assertFailingGraphQLMutation({
    ...createDeleteBotsMutation({ botIds: [user.id] }),
    client,
    expectedError: 'BAD_USER_INPUT',
  })
})

test('fails when user is not authenticated', async () => {
  const client = createTestClient({ userId: null })

  await assertFailingGraphQLMutation({
    ...createDeleteBotsMutation(),
    client,
    expectedError: 'UNAUTHENTICATED',
  })
})

test('fails when user does not have role "sysadmin"', async () => {
  database.hasUuid({ ...user, roles: ['login', 'de_admin'] })

  await assertFailingGraphQLMutation({
    ...createDeleteBotsMutation(),
    client,
    expectedError: 'FORBIDDEN',
  })
})

test('fails when database layer has an internal error', async () => {
  givenUserDeleteBotsEndpoint(hasInternalServerError())

  await assertFailingGraphQLMutation({
    ...createDeleteBotsMutation(),
    client,
    expectedError: 'INTERNAL_SERVER_ERROR',
  })
})

function createDeleteBotsMutation(args?: { botIds?: number[] }) {
  return {
    mutation: gql`
      mutation ($input: UserDeleteBotsInput!) {
        user {
          deleteBots(input: $input) {
            success
          }
        }
      }
    `,
    variables: { input: { botIds: args?.botIds ?? [user.id] } },
  }
}

function givenUserDeleteBotsEndpoint(
  resolver: MessageResolver<{
    botIds: number[]
  }>
) {
  givenSerloEndpoint('UserDeleteBotsMutation', resolver)
}

function defaultUserDeleteBotsEndpoint({
  database,
  emailHashes,
}: {
  database: Database
  emailHashes: string[]
}): MessageResolver<{ botIds: number[] }> {
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
