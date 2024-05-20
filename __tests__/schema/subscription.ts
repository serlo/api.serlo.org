import gql from 'graphql-tag'

import { Client, subscriptionsQuery } from '../__utils__'

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

test('getSubscriptions', async () => {
  await subscriptionsQuery.shouldReturnData({
    subscription: {
      getSubscriptions: {
        nodes: [
          { object: { id: 27393 }, sendEmail: true },
          { object: { id: 27781 }, sendEmail: false },
          { object: { id: 27998 }, sendEmail: true },
        ],
      },
    },
  })
})

describe('subscription mutation set', () => {
  const mutation = new Client({ userId: 27393 }).prepareQuery({
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

  test('when subscribe=true and sendEmail=true', async () => {
    await subscriptionsQuery.shouldReturnData({
      subscription: {
        getSubscriptions: {
          nodes: [
            { object: { id: 27393 }, sendEmail: true },
            { object: { id: 27781 }, sendEmail: false },
            { object: { id: 27998 }, sendEmail: true },
          ],
        },
      },
    })

    await mutation
      .withInput({ id: [27781, 1555], subscribe: true, sendEmail: true })
      .shouldReturnData({ subscription: { set: { success: true } } })

    await subscriptionsQuery.shouldReturnData({
      subscription: {
        getSubscriptions: {
          nodes: [
            { object: { id: 1555 }, sendEmail: true },
            { object: { id: 27393 }, sendEmail: true },
            { object: { id: 27781 }, sendEmail: true },
            { object: { id: 27998 }, sendEmail: true },
          ],
        },
      },
    })
  })

  test('when subscribe=true and sendEmail=false', async () => {
    await subscriptionsQuery.shouldReturnData({
      subscription: {
        getSubscriptions: {
          nodes: [
            { object: { id: 27393 }, sendEmail: true },
            { object: { id: 27781 }, sendEmail: false },
            { object: { id: 27998 }, sendEmail: true },
          ],
        },
      },
    })

    await mutation
      .withInput({ id: [27393, 1555], subscribe: true, sendEmail: false })
      .shouldReturnData({ subscription: { set: { success: true } } })

    await subscriptionsQuery.shouldReturnData({
      subscription: {
        getSubscriptions: {
          nodes: [
            { object: { id: 1555 }, sendEmail: false },
            { object: { id: 27393 }, sendEmail: false },
            { object: { id: 27781 }, sendEmail: false },
            { object: { id: 27998 }, sendEmail: true },
          ],
        },
      },
    })
  })

  test('when subscribe=false', async () => {
    await subscriptionsQuery.shouldReturnData({
      subscription: {
        getSubscriptions: {
          nodes: [
            { object: { id: 27393 }, sendEmail: true },
            { object: { id: 27781 }, sendEmail: false },
            { object: { id: 27998 }, sendEmail: true },
          ],
        },
      },
    })

    await mutation
      .withInput({ id: [27393, 1555], subscribe: false, sendEmail: false })
      .shouldReturnData({ subscription: { set: { success: true } } })

    await subscriptionsQuery.shouldReturnData({
      subscription: {
        getSubscriptions: {
          nodes: [
            { object: { id: 27781 }, sendEmail: false },
            { object: { id: 27998 }, sendEmail: true },
          ],
        },
      },
    })
  })

  test('unauthenticated', async () => {
    await mutation
      .forUnauthenticatedUser()
      .withInput({ id: 1565, subscribe: true, sendEmail: false })
      .shouldFailWithError('UNAUTHENTICATED')
  })
})
