import gql from 'graphql-tag'

import { article, user } from '../../__fixtures__'
import { Client, getTypenameAndId, given } from '../__utils__'

describe('currentUserHasSubscribed', () => {
  const query = new Client({ userId: 1 }).prepareQuery({
    query: gql`
      query ($id: Int!) {
        subscription {
          currentUserHasSubscribed(id: $id)
        }
      }
    `,
  })

  test('when user has subscribed', async () => {
    await query.withVariables({ id: 35564 }).shouldReturnData({
      subscription: { currentUserHasSubscribed: true },
    })
  })

  test('when user has not subscribed', async () => {
    await query.withVariables({ id: 1855 }).shouldReturnData({
      subscription: { currentUserHasSubscribed: false },
    })
  })
})

describe('subscriptions', () => {
  beforeEach(() => {
    given('UuidQuery').for(article, user)
    given('SubscriptionsQuery')
      .withPayload({ userId: user.id })
      .returns({
        subscriptions: [{ objectId: article.id, sendEmail: true }],
      })
  })

  test('Article', async () => {
    await new Client({ userId: 1 })
      .prepareQuery({
        query: gql`
          query {
            subscription {
              getSubscriptions {
                nodes {
                  object {
                    __typename
                    id
                  }
                  sendEmail
                }
              }
            }
          }
        `,
      })
      .shouldReturnData({
        subscription: {
          getSubscriptions: {
            nodes: [{ object: getTypenameAndId(article), sendEmail: true }],
          },
        },
      })
  })
})

describe('subscription mutation set', () => {
  const mutation = new Client({ userId: user.id }).prepareQuery({
    query: gql`
      mutation set($input: SubscriptionSetInput!) {
        subscription {
          set(input: $input) {
            success
          }
        }
      }
    `,
  })

  const getSubscriptionsQuery = new Client({ userId: user.id }).prepareQuery({
    query: gql`
      query {
        subscription {
          getSubscriptions {
            nodes {
              object {
                id
              }
              sendEmail
            }
          }
        }
      }
    `,
  })

  beforeEach(async () => {
    given('UuidQuery').for(
      user,
      article,
      { ...article, id: 1555 },
      { ...article, id: 1565 },
    )
    given('SubscriptionsQuery')
      .withPayload({ userId: user.id })
      .returns({
        subscriptions: [
          { objectId: article.id, sendEmail: false },
          { objectId: 1555, sendEmail: false },
        ],
      })

    await getSubscriptionsQuery.shouldReturnData({
      subscription: {
        getSubscriptions: {
          nodes: [
            { object: { id: article.id }, sendEmail: false },
            { object: { id: 1555 }, sendEmail: false },
          ],
        },
      },
    })
  })

  test('when subscribe=true', async () => {
    given('SubscriptionSetMutation')
      .withPayload({
        ids: [1565, 1555],
        userId: user.id,
        subscribe: true,
        sendEmail: true,
      })
      .returns()

    await mutation
      .withInput({ id: [1565, 1555], subscribe: true, sendEmail: true })
      .shouldReturnData({ subscription: { set: { success: true } } })

    await getSubscriptionsQuery.shouldReturnData({
      subscription: {
        getSubscriptions: {
          nodes: [
            { object: { id: 1555 }, sendEmail: true },
            { object: { id: 1565 }, sendEmail: true },
            { object: { id: article.id }, sendEmail: false },
          ],
        },
      },
    })
  })

  test('when subscribe=false', async () => {
    given('SubscriptionSetMutation')
      .withPayload({
        ids: [article.id],
        userId: user.id,
        subscribe: false,
        sendEmail: false,
      })
      .returns()

    await mutation
      .withInput({ id: [article.id], subscribe: false, sendEmail: false })
      .shouldReturnData({ subscription: { set: { success: true } } })

    await getSubscriptionsQuery.shouldReturnData({
      subscription: {
        getSubscriptions: {
          nodes: [{ object: { id: 1555 }, sendEmail: false }],
        },
      },
    })
  })

  test('unauthenticated', async () => {
    await mutation
      .forUnauthenticatedUser()
      .withInput({
        id: 1565,
        subscribe: true,
        sendEmail: false,
      })
      .shouldFailWithError('UNAUTHENTICATED')
  })
})
