import gql from 'graphql-tag'

import { user } from '../../__fixtures__'
import { Client, given } from '../__utils__'
import { Service } from '~/context/service'

const query = new Client({ userId: 1194 }).prepareQuery({
  query: gql`
    query notifications(
      $unread: Boolean
      $email: Boolean
      $emailSent: Boolean
      $userId: Int
    ) {
      notifications(
        unread: $unread
        email: $email
        emailSent: $emailSent
        userId: $userId
      ) {
        nodes {
          id
          unread
          email
          emailSent
        }
      }
    }
  `,
})

describe('notifications', () => {
  beforeEach(async () => {
    await global.databaseForTests.mutate(`
      update notification set seen = 1, email = 1,
      email_sent = 1 where id = 11599
    `)
  })

  test('notifications without filter', async () => {
    await query.shouldReturnData({
      notifications: {
        nodes: [
          { id: 11599, emailSent: true, email: true, unread: false },
          { id: 11551, emailSent: false, email: false, unread: true },
        ],
      },
    })
  })

  test('notifications (only unread)', async () => {
    await query.withVariables({ unread: false }).shouldReturnData({
      notifications: {
        nodes: [{ id: 11599, emailSent: true, email: true, unread: false }],
      },
    })
  })

  test('notifications (only read)', async () => {
    await query.withVariables({ unread: true }).shouldReturnData({
      notifications: {
        nodes: [{ id: 11551, emailSent: false, email: false, unread: true }],
      },
    })
  })

  test('notifications (only subscribed to receive email)', async () => {
    await query.withVariables({ email: true }).shouldReturnData({
      notifications: {
        nodes: [{ id: 11599, emailSent: true, email: true, unread: false }],
      },
    })
  })

  test('notifications (only sent email)', async () => {
    await query.withVariables({ emailSent: true }).shouldReturnData({
      notifications: {
        nodes: [{ id: 11599, emailSent: true, email: true, unread: false }],
      },
    })
  })

  describe('notifications (setting userId)', () => {
    test('is successful when service is notification email service', async () => {
      await query
        .withContext({
          service: Service.NotificationEmailService,
          userId: null,
        })
        .withVariables({ userId: 1194 })
        .shouldReturnData({
          notifications: {
            nodes: [
              { id: 11599, emailSent: true, email: true, unread: false },
              { id: 11551, emailSent: false, email: false, unread: true },
            ],
          },
        })
    })

    test.each([
      Service.SerloCloudflareWorker,
      Service.SerloCacheWorker,
      Service.Serlo,
    ])('fails when service is %s', async (service) => {
      await query
        .withContext({ service: service, userId: null })
        .withVariables({ userId: user.id })
        .shouldFailWithError('BAD_USER_INPUT')
    })
  })

  test('notifications (w/ event)', async () => {
    await new Client({ userId: 1194 })
      .prepareQuery({
        query: gql`
          {
            notifications {
              nodes {
                event {
                  id
                  __typename
                }
              }
            }
          }
        `,
      })
      .shouldReturnData({
        notifications: {
          nodes: [
            {
              event: {
                id: 86197,
                __typename: 'CreateCommentNotificationEvent',
              },
            },
            {
              event: {
                id: 85710,
                __typename: 'CreateCommentNotificationEvent',
              },
            },
          ],
        },
      })
  })
})

describe('mutation notification setState', () => {
  const mutation = new Client({ userId: 1194 })
    .prepareQuery({
      query: gql`
        mutation notification($input: NotificationSetStateInput!) {
          notification {
            setState(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withVariables({ input: { id: [11599, 11551], unread: false } })

  beforeEach(() => {
    given('UuidQuery').for(user)
  })

  test('authenticated with array of ids', async () => {
    await query.shouldReturnData({
      notifications: {
        nodes: [
          { id: 11599, emailSent: false, email: false, unread: true },
          { id: 11551, emailSent: false, email: false, unread: true },
        ],
      },
    })

    await mutation.shouldReturnData({
      notification: { setState: { success: true } },
    })

    await query.shouldReturnData({
      notifications: {
        nodes: [
          { id: 11599, emailSent: false, email: false, unread: false },
          { id: 11551, emailSent: false, email: false, unread: false },
        ],
      },
    })
  })

  test('unauthenticated', async () => {
    await mutation
      .forUnauthenticatedUser()
      .shouldFailWithError('UNAUTHENTICATED')
  })

  test('setting ids from other user', async () => {
    await mutation.withContext({ userId: 1 }).shouldFailWithError('FORBIDDEN')
  })
})
