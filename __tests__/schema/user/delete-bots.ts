import { createHash } from 'crypto'
import gql from 'graphql-tag'
import { HttpResponse, ResponseResolver, http } from 'msw'

import { article, user, user2 } from '../../../__fixtures__'
import {
  given,
  Client,
  Query,
  returnsJson,
  assertErrorEvent,
  assertNoErrorEvents,
} from '../../__utils__'

let client: Client
const users = [{ ...user, roles: ['sysadmin'] }, user2]
let chatUsers: string[]
const emailHash = createHash('md5').update(`admin@localhost`).digest('hex')
let mailchimpEmails: string[]
let mutation: Query

beforeEach(() => {
  client = new Client({ userId: user.id })
  mutation = client
    .prepareQuery({
      query: gql`
        mutation ($input: UserDeleteBotsInput!) {
          user {
            deleteBots(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withInput({ botIds: [user.id] })

  mailchimpEmails = [emailHash]

  for (const user of users) {
    given('ActivityByTypeQuery')
      .withPayload({ userId: user.id })
      .returns({ edits: 1, comments: 0, reviews: 0, taxonomy: 0 })
  }

  given('UuidQuery').for(users, article)

  chatUsers = [user.username]

  givenChatDeleteUserEndpoint(async ({ request }) => {
    const body = (await request.json()) as {
      username: string
    }
    const { headers } = request

    if (
      headers.get('X-Auth-Token') !== process.env.ROCKET_CHAT_API_AUTH_TOKEN ||
      headers.get('X-User-Id') !== process.env.ROCKET_CHAT_API_USER_ID
    )
      return new HttpResponse(null, { status: 400 })

    const { username } = body

    if (chatUsers.includes(username)) {
      chatUsers = chatUsers.filter((x) => x !== username)

      return HttpResponse.json({ success: true })
    } else {
      return HttpResponse.json({
        success: false,
        errorType: 'error-invalid-user',
      })
    }
  })

  givenMailchimpDeleteEmailEndpoint(({ request, params }) => {
    const authHeader = request.headers.get('Authorization') ?? ''
    const key = Buffer.from(authHeader.slice('Basic '.length), 'base64')
      .toString()
      .split(':')[1]

    if (key !== process.env.MAILCHIMP_API_KEY)
      return new HttpResponse(null, { status: 405 })

    const { emailHash } = params

    if (mailchimpEmails.includes(emailHash)) {
      mailchimpEmails = mailchimpEmails.filter((x) => x !== emailHash)

      return new HttpResponse(null, { status: 204 })
    } else {
      return new HttpResponse(null, { status: 404 })
    }
  })
})

test('runs successfully if mutation could be successfully executed', async () => {
  expect(global.kratos.identities).toHaveLength(users.length)
  await mutation
    .withInput({ botIds: [user.id, user2.id] })
    .shouldReturnData({ user: { deleteBots: { success: true } } })
  expect(global.kratos.identities).toHaveLength(users.length - 2)
})

test('updates the cache', async () => {
  const uuidQuery = client
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            id
          }
        }
      `,
    })
    .withVariables({ id: user.id })

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

  test('does not sent a sentry event if the user is not in the community chat', async () => {
    await mutation.withInput({ botIds: [user2.id] }).execute()

    expect(chatUsers).toHaveLength(1)
    await assertNoErrorEvents()
  })

  test('send a sentry event if the user cannot be deleted from the community chat', async () => {
    givenChatDeleteUserEndpoint(
      returnsJson({ json: { success: false, errorType: 'unknown' } }),
    )

    await mutation.withInput({ botIds: [user2.id] }).execute()

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

    expect(mailchimpEmails).toHaveLength(0)
    await assertNoErrorEvents()
  })

  test('does not sent a sentry event if the user is not in the newsletter', async () => {
    await mutation.withInput({ botIds: [user2.id] }).execute()

    expect(mailchimpEmails).toHaveLength(1)
    await assertNoErrorEvents()
  })

  test('send a sentry event if the user cannot be deleted', async () => {
    givenMailchimpDeleteEmailEndpoint(
      returnsJson({ status: 405, json: { errorType: 'unknown' } }),
    )

    await mutation.execute()

    await assertErrorEvent({
      message: 'Cannot delete user from mailchimp',
      errorContext: { emailHash },
    })
  })
})

test('fails if one of the given bot ids is not a user', async () => {
  await mutation
    .withInput({ botIds: [article.id] })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails if one given bot id has more than 4 edits', async () => {
  given('ActivityByTypeQuery')
    .withPayload({ userId: user.id })
    .returns({ edits: 5, comments: 0, reviews: 0, taxonomy: 0 })

  await mutation.shouldFailWithError('BAD_USER_INPUT')
})

test('fails if user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails if user does not have role "sysadmin"', async () => {
  const newMutation = await mutation.forUser('de_admin')
  await newMutation.shouldFailWithError('FORBIDDEN')
})

test('fails if kratos has an error', async () => {
  global.kratos.admin.deleteIdentity = () => {
    throw new Error('Error in kratos')
  }

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})

function givenChatDeleteUserEndpoint(resolver: ResponseResolver) {
  global.server.use(
    http.post(`${process.env.ROCKET_CHAT_URL}api/v1/users.delete`, resolver),
  )
}

function givenMailchimpDeleteEmailEndpoint(
  resolver: MailchimpResponseResolver,
) {
  const url =
    `https://us5.api.mailchimp.com/3.0/` +
    `lists/a7bb2bbc4f/members/:emailHash/actions/delete-permanent`

  global.server.use(http.post(url, resolver))
}

type MailchimpResponseResolver = ResponseResolver<{
  params: { emailHash: string }
}>
