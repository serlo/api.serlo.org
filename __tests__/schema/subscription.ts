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

import { article, user } from '../../__fixtures__'
import {
  castToUuid,
  Client,
  getTypenameAndId,
  given,
  givenUuid,
  givenUuids,
  nextUuid,
} from '../__utils__'

describe('subscriptions', () => {
  beforeEach(() => {
    givenUuid(article)
    givenUuid(user)
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

  test('currentUserHasSubscribed (true case)', async () => {
    await new Client({ userId: user.id })
      .prepareQuery({
        query: gql`
          query subscription($id: Int!) {
            subscription {
              currentUserHasSubscribed(id: $id)
            }
          }
        `,
        variables: { id: article.id },
      })
      .shouldReturnData({ subscription: { currentUserHasSubscribed: true } })
  })

  test('currentUserHasSubscribed (false case)', async () => {
    await new Client({ userId: user.id })
      .prepareQuery({
        query: gql`
          query subscription($id: Int!) {
            subscription {
              currentUserHasSubscribed(id: $id)
            }
          }
        `,
        variables: { id: nextUuid(article.id) },
      })
      .shouldReturnData({ subscription: { currentUserHasSubscribed: false } })
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

  // given a single subscription to article.id
  beforeEach(async () => {
    // mock subscriptions handlers
    givenUuids(
      user,
      article,
      { ...article, id: castToUuid(1555) },
      { ...article, id: castToUuid(1565) }
    )
    given('SubscriptionsQuery')
      .withPayload({ userId: user.id })
      .returns({
        subscriptions: [
          { objectId: article.id, sendEmail: false },
          { objectId: castToUuid(1555), sendEmail: false },
        ],
      })

    // fill cache
    await getSubscriptionsQuery.execute()
  })

  test('when subscribe=true', async () => {
    given('SubscriptionSetMutation')
      .withPayload({
        ids: [castToUuid(1565), castToUuid(1555)],
        userId: user.id,
        subscribe: true,
        sendEmail: true,
      })
      .returns()

    await mutation
      .withVariables({
        input: { id: [1565, 1555], subscribe: true, sendEmail: true },
      })
      .shouldReturnData({ subscription: { set: { success: true } } })

    //check cache
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
      .withVariables({
        input: { id: [article.id], subscribe: false, sendEmail: false },
      })
      .shouldReturnData({ subscription: { set: { success: true } } })

    //check cache
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
      .withVariables({
        input: { id: 1565, subscribe: true, sendEmail: false },
      })
      .shouldFailWithError('UNAUTHENTICATED')
  })
})
