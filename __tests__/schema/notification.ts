/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2023 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2023 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { gql } from 'apollo-server'
import R from 'ramda'

import {
  article,
  articleRevision,
  checkoutRevisionNotificationEvent,
  comment,
  createCommentNotificationEvent,
  createEntityLinkNotificationEvent,
  createEntityNotificationEvent,
  createEntityRevisionNotificationEvent,
  createTaxonomyLinkNotificationEvent,
  createTaxonomyTermNotificationEvent,
  createThreadNotificationEvent,
  exercise,
  rejectRevisionNotificationEvent,
  removeEntityLinkNotificationEvent,
  removeTaxonomyLinkNotificationEvent,
  setLicenseNotificationEvent,
  setTaxonomyParentNotificationEvent,
  setTaxonomyTermNotificationEvent,
  setThreadStateNotificationEvent,
  setUuidStateNotificationEvent,
  solution,
  taxonomyTermCurriculumTopic,
  taxonomyTermRoot,
  taxonomyTermSubject,
  user,
  user2,
} from '../../__fixtures__'
import {
  castToUuid,
  getTypenameAndId,
  givenThreads,
  Client,
  given,
} from '../__utils__'
import { Instance } from '~/types'

const notificationsQuery = new Client({ userId: user.id }).prepareQuery({
  query: gql`
    query notifications($unread: Boolean) {
      notifications(unread: $unread) {
        totalCount
        nodes {
          id
          unread
        }
      }
    }
  `,
})

describe('notifications', () => {
  beforeEach(() => {
    given('NotificationsQuery')
      .withPayload({
        userId: user.id,
      })
      .returns({
        notifications: [
          { id: 3, unread: true, eventId: 3 },
          { id: 2, unread: false, eventId: 2 },
          { id: 1, unread: false, eventId: 1 },
        ],
        userId: user.id,
      })
  })

  test('notifications without filter', async () => {
    await notificationsQuery.shouldReturnData({
      notifications: {
        totalCount: 3,
        nodes: [
          { id: 3, unread: true },
          { id: 2, unread: false },
          { id: 1, unread: false },
        ],
      },
    })
  })

  test('notifications (only unread)', async () => {
    await notificationsQuery.withVariables({ unread: false }).shouldReturnData({
      notifications: {
        totalCount: 2,
        nodes: [
          { id: 2, unread: false },
          { id: 1, unread: false },
        ],
      },
    })
  })

  test('notifications (only read)', async () => {
    await notificationsQuery.withVariables({ unread: true }).shouldReturnData({
      notifications: { totalCount: 1, nodes: [{ id: 3, unread: true }] },
    })
  })

  test('notifications (w/ event)', async () => {
    given('NotificationsQuery')
      .withPayload({
        userId: user.id,
      })
      .returns({
        notifications: [
          {
            id: 1,
            unread: false,
            eventId: checkoutRevisionNotificationEvent.id,
          },
        ],
        userId: user.id,
      })
    given('EventQuery').for(checkoutRevisionNotificationEvent)

    await new Client({ userId: user.id })
      .prepareQuery({
        query: gql`
          {
            notifications {
              totalCount
              nodes {
                id
                unread
                event {
                  __typename
                  ... on CheckoutRevisionNotificationEvent {
                    id
                    instance
                    date
                    objectId
                    reason
                  }
                }
              }
            }
          }
        `,
      })
      .shouldReturnData({
        notifications: {
          totalCount: 1,
          nodes: [
            {
              id: 1,
              unread: false,
              event: R.pick(
                ['__typename', 'id', 'instance', 'date', 'objectId', 'reason'],
                checkoutRevisionNotificationEvent
              ),
            },
          ],
        },
      })
  })
})

describe('notificationEvent', () => {
  let client: Client

  beforeEach(() => {
    client = new Client({ userId: null })
  })

  describe('CheckoutRevisionNotification', () => {
    beforeEach(() => {
      given('EventQuery').for(checkoutRevisionNotificationEvent)
    })

    test('by id', async () => {
      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                __typename
                ... on CheckoutRevisionNotificationEvent {
                  id
                }
              }
            }
          `,
        })
        .withVariables(checkoutRevisionNotificationEvent)
        .shouldReturnData({
          notificationEvent: getTypenameAndId(
            checkoutRevisionNotificationEvent
          ),
        })
    })

    test('by id (w/ actor)', async () => {
      given('UuidQuery').for(user)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on CheckoutRevisionNotificationEvent {
                  actor {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(checkoutRevisionNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        })
    })

    test('by id (w/ repository)', async () => {
      given('UuidQuery').for(article)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on CheckoutRevisionNotificationEvent {
                  repository {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(checkoutRevisionNotificationEvent)
        .shouldReturnData({
          notificationEvent: { repository: getTypenameAndId(article) },
        })
    })

    test('by id (w/ revision)', async () => {
      given('UuidQuery').for(articleRevision)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on CheckoutRevisionNotificationEvent {
                  revision {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(checkoutRevisionNotificationEvent)
        .shouldReturnData({
          notificationEvent: { revision: getTypenameAndId(articleRevision) },
        })
    })
  })

  describe('RejectRevisionNotification', () => {
    beforeEach(() => {
      given('EventQuery').for(rejectRevisionNotificationEvent)
    })

    test('by id', async () => {
      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                __typename
                ... on RejectRevisionNotificationEvent {
                  id
                  instance
                  date
                  reason
                  objectId
                }
              }
            }
          `,
        })
        .withVariables(rejectRevisionNotificationEvent)
        .shouldReturnData({
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'reason', 'objectId'],
            rejectRevisionNotificationEvent
          ),
        })
    })

    test('by id (w/ actor)', async () => {
      given('UuidQuery').for(user)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on RejectRevisionNotificationEvent {
                  actor {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(rejectRevisionNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        })
    })

    test('by id (w/ repository)', async () => {
      given('UuidQuery').for(article)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on RejectRevisionNotificationEvent {
                  repository {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(rejectRevisionNotificationEvent)
        .shouldReturnData({
          notificationEvent: { repository: getTypenameAndId(article) },
        })
    })

    test('by id (w/ revision)', async () => {
      given('UuidQuery').for(articleRevision)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on RejectRevisionNotificationEvent {
                  revision {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(rejectRevisionNotificationEvent)
        .shouldReturnData({
          notificationEvent: { revision: getTypenameAndId(articleRevision) },
        })
    })
  })

  describe('CreateCommentNotificationEvent', () => {
    beforeEach(() => {
      given('EventQuery').for(createCommentNotificationEvent)
    })

    test('by id', async () => {
      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                __typename
                ... on CreateCommentNotificationEvent {
                  id
                  instance
                  date
                  objectId
                }
              }
            }
          `,
        })
        .withVariables(createCommentNotificationEvent)
        .shouldReturnData({
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId'],
            createCommentNotificationEvent
          ),
        })
    })

    test('by id (w/ actor)', async () => {
      given('UuidQuery').for(user)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on CreateCommentNotificationEvent {
                  actor {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(createCommentNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        })
    })

    test('by id (w/ thread)', async () => {
      givenThreads({ uuid: article, threads: [[comment]] })

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on CreateCommentNotificationEvent {
                  thread {
                    title
                  }
                }
              }
            }
          `,
        })
        .withVariables(createCommentNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            thread: { title: comment.title },
          },
        })
    })

    test('by id (w/ comment)', async () => {
      given('UuidQuery').for(comment)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on CreateCommentNotificationEvent {
                  comment {
                    id
                    __typename
                  }
                }
              }
            }
          `,
        })
        .withVariables(createCommentNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            comment: getTypenameAndId(comment),
          },
        })
    })
  })

  describe('CreateEntityNotificationEvent', () => {
    beforeEach(() => {
      given('EventQuery').for(createEntityNotificationEvent)
    })

    test('by id', async () => {
      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                __typename
                ... on CreateEntityNotificationEvent {
                  id
                  instance
                  date
                  objectId
                }
              }
            }
          `,
        })
        .withVariables(createEntityNotificationEvent)
        .shouldReturnData({
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId'],
            createEntityNotificationEvent
          ),
        })
    })

    test('by id (w/ actor)', async () => {
      given('UuidQuery').for(user)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on CreateEntityNotificationEvent {
                  actor {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(createEntityNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        })
    })

    test('by id (w/ entity)', async () => {
      given('UuidQuery').for(article)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on CreateEntityNotificationEvent {
                  entity {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(createEntityNotificationEvent)
        .shouldReturnData({
          notificationEvent: { entity: getTypenameAndId(article) },
        })
    })
  })

  describe('CreateEntityLinkNotificationEvent', () => {
    beforeEach(() => {
      given('EventQuery').for(createEntityLinkNotificationEvent)
    })

    test('by id', async () => {
      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                __typename
                ... on CreateEntityLinkNotificationEvent {
                  id
                  instance
                  date
                  objectId
                }
              }
            }
          `,
        })
        .withVariables(createEntityLinkNotificationEvent)
        .shouldReturnData({
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId'],
            createEntityLinkNotificationEvent
          ),
        })
    })

    test('by id (w/ actor)', async () => {
      given('UuidQuery').for(user)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on CreateEntityLinkNotificationEvent {
                  actor {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(createEntityLinkNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        })
    })

    test('by id (w/ parent)', async () => {
      given('UuidQuery').for(exercise)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on CreateEntityLinkNotificationEvent {
                  parent {
                    __typename
                    ... on Exercise {
                      id
                    }
                  }
                }
              }
            }
          `,
        })
        .withVariables(createEntityLinkNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            parent: getTypenameAndId(exercise),
          },
        })
    })

    test('by id (w/ child)', async () => {
      given('UuidQuery').for(solution)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on CreateEntityLinkNotificationEvent {
                  child {
                    __typename
                    ... on Solution {
                      id
                    }
                  }
                }
              }
            }
          `,
        })
        .withVariables(createEntityLinkNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            child: getTypenameAndId(solution),
          },
        })
    })
  })

  describe('RemoveEntityLinkNotificationEvent', () => {
    beforeEach(() => {
      given('EventQuery').for(removeEntityLinkNotificationEvent)
    })

    test('by id', async () => {
      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                __typename
                ... on RemoveEntityLinkNotificationEvent {
                  id
                  instance
                  date
                  objectId
                }
              }
            }
          `,
        })
        .withVariables(removeEntityLinkNotificationEvent)
        .shouldReturnData({
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId'],
            removeEntityLinkNotificationEvent
          ),
        })
    })

    test('by id (w/ actor)', async () => {
      given('UuidQuery').for(user)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on RemoveEntityLinkNotificationEvent {
                  actor {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(removeEntityLinkNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        })
    })

    test('by id (w/ parent)', async () => {
      given('UuidQuery').for(exercise)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on RemoveEntityLinkNotificationEvent {
                  parent {
                    __typename
                    ... on Exercise {
                      id
                    }
                  }
                }
              }
            }
          `,
        })
        .withVariables(removeEntityLinkNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            parent: getTypenameAndId(exercise),
          },
        })
    })

    test('by id (w/ child)', async () => {
      given('UuidQuery').for(solution)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on RemoveEntityLinkNotificationEvent {
                  child {
                    __typename
                    ... on Solution {
                      id
                    }
                  }
                }
              }
            }
          `,
        })
        .withVariables(removeEntityLinkNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            child: getTypenameAndId(solution),
          },
        })
    })
  })

  describe('CreateEntityRevisionNotificationEvent', () => {
    beforeEach(() => {
      given('EventQuery').for(createEntityRevisionNotificationEvent)
    })

    test('by id', async () => {
      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                __typename
                ... on CreateEntityRevisionNotificationEvent {
                  id
                  instance
                  date
                  objectId
                }
              }
            }
          `,
        })
        .withVariables(createEntityRevisionNotificationEvent)
        .shouldReturnData({
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId'],
            createEntityRevisionNotificationEvent
          ),
        })
    })

    test('by id (w/ actor)', async () => {
      given('UuidQuery').for(user)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on CreateEntityRevisionNotificationEvent {
                  actor {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(createEntityRevisionNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        })
    })

    test('by id (w/ entity)', async () => {
      given('UuidQuery').for(article)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on CreateEntityRevisionNotificationEvent {
                  entity {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(createEntityRevisionNotificationEvent)
        .shouldReturnData({
          notificationEvent: { entity: getTypenameAndId(article) },
        })
    })

    test('by id (w/ entityRevision)', async () => {
      given('UuidQuery').for(articleRevision)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on CreateEntityRevisionNotificationEvent {
                  entityRevision {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(createEntityRevisionNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            entityRevision: getTypenameAndId(articleRevision),
          },
        })
    })
  })

  describe('CreateTaxonomyTermNotificationEvent', () => {
    beforeEach(() => {
      given('EventQuery').for(createTaxonomyTermNotificationEvent)
    })

    test('by id', async () => {
      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                __typename
                ... on CreateTaxonomyTermNotificationEvent {
                  id
                  instance
                  date
                  objectId
                }
              }
            }
          `,
        })
        .withVariables(createTaxonomyTermNotificationEvent)
        .shouldReturnData({
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId'],
            createTaxonomyTermNotificationEvent
          ),
        })
    })

    test('by id (w/ actor)', async () => {
      given('UuidQuery').for(user)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on CreateTaxonomyTermNotificationEvent {
                  actor {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(createTaxonomyTermNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        })
    })

    test('by id (w/ taxonomyTerm)', async () => {
      given('UuidQuery').for(taxonomyTermCurriculumTopic)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on CreateTaxonomyTermNotificationEvent {
                  taxonomyTerm {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(createTaxonomyTermNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            taxonomyTerm: getTypenameAndId(taxonomyTermCurriculumTopic),
          },
        })
    })
  })

  describe('SetTaxonomyTermNotificationEvent', () => {
    beforeEach(() => {
      given('EventQuery').for(setTaxonomyTermNotificationEvent)
    })

    test('by id', async () => {
      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                __typename
                ... on SetTaxonomyTermNotificationEvent {
                  id
                  instance
                  date
                  objectId
                }
              }
            }
          `,
        })
        .withVariables(setTaxonomyTermNotificationEvent)
        .shouldReturnData({
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId'],
            setTaxonomyTermNotificationEvent
          ),
        })
    })

    test('by id (w/ actor)', async () => {
      given('UuidQuery').for(user)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on SetTaxonomyTermNotificationEvent {
                  actor {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(setTaxonomyTermNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        })
    })

    test('by id (w/ taxonomyTerm)', async () => {
      given('UuidQuery').for(taxonomyTermCurriculumTopic)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on SetTaxonomyTermNotificationEvent {
                  taxonomyTerm {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(setTaxonomyTermNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            taxonomyTerm: getTypenameAndId(taxonomyTermCurriculumTopic),
          },
        })
    })
  })

  describe('CreateTaxonomyLinkNotificationEvent', () => {
    beforeEach(() => {
      given('EventQuery').for(createTaxonomyLinkNotificationEvent)
    })

    test('by id', async () => {
      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                __typename
                ... on CreateTaxonomyLinkNotificationEvent {
                  id
                  instance
                  date
                  objectId
                }
              }
            }
          `,
        })
        .withVariables(createTaxonomyLinkNotificationEvent)
        .shouldReturnData({
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId'],
            createTaxonomyLinkNotificationEvent
          ),
        })
    })

    test('by id (w/ actor)', async () => {
      given('UuidQuery').for(user)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on CreateTaxonomyLinkNotificationEvent {
                  actor {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(createTaxonomyLinkNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        })
    })

    test('by id (w/ parent)', async () => {
      given('UuidQuery').for(taxonomyTermCurriculumTopic)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on CreateTaxonomyLinkNotificationEvent {
                  parent {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(createTaxonomyLinkNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            parent: getTypenameAndId(taxonomyTermCurriculumTopic),
          },
        })
    })

    test('by id (w/ child)', async () => {
      given('UuidQuery').for(article)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on CreateTaxonomyLinkNotificationEvent {
                  child {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(createTaxonomyLinkNotificationEvent)
        .shouldReturnData({
          notificationEvent: { child: getTypenameAndId(article) },
        })
    })
  })

  describe('RemoveTaxonomyLinkNotificationEvent', () => {
    beforeEach(() => {
      given('EventQuery').for(removeTaxonomyLinkNotificationEvent)
    })

    test('by id', async () => {
      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                __typename
                ... on RemoveTaxonomyLinkNotificationEvent {
                  id
                  instance
                  objectId
                  date
                }
              }
            }
          `,
        })
        .withVariables(removeTaxonomyLinkNotificationEvent)
        .shouldReturnData({
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId'],
            removeTaxonomyLinkNotificationEvent
          ),
        })
    })

    test('by id (w/ actor)', async () => {
      given('UuidQuery').for(user)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on RemoveTaxonomyLinkNotificationEvent {
                  actor {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(removeTaxonomyLinkNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        })
    })

    test('by id (w/ parent)', async () => {
      given('UuidQuery').for(taxonomyTermCurriculumTopic)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on RemoveTaxonomyLinkNotificationEvent {
                  parent {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(removeTaxonomyLinkNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            parent: getTypenameAndId(taxonomyTermCurriculumTopic),
          },
        })
    })

    test('by id (w/ child)', async () => {
      given('UuidQuery').for(article)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on RemoveTaxonomyLinkNotificationEvent {
                  child {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(removeTaxonomyLinkNotificationEvent)
        .shouldReturnData({
          notificationEvent: { child: getTypenameAndId(article) },
        })
    })
  })

  describe('SetTaxonomyParentNotificationEvent', () => {
    beforeEach(() => {
      given('EventQuery').for(setTaxonomyParentNotificationEvent)
    })

    test('by id', async () => {
      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                __typename
                ... on SetTaxonomyParentNotificationEvent {
                  id
                  instance
                  objectId
                  date
                }
              }
            }
          `,
        })
        .withVariables(setTaxonomyParentNotificationEvent)
        .shouldReturnData({
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId'],
            setTaxonomyParentNotificationEvent
          ),
        })
    })

    test('by id (w/ actor)', async () => {
      given('UuidQuery').for(user)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on SetTaxonomyParentNotificationEvent {
                  actor {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(setTaxonomyParentNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        })
    })

    test('by id (w/ previousParent)', async () => {
      given('UuidQuery').for(taxonomyTermRoot)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on SetTaxonomyParentNotificationEvent {
                  previousParent {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(setTaxonomyParentNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            previousParent: getTypenameAndId(taxonomyTermRoot),
          },
        })
    })

    test('by id (w/ parent)', async () => {
      given('UuidQuery').for(taxonomyTermSubject)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on SetTaxonomyParentNotificationEvent {
                  parent {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(setTaxonomyParentNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            parent: getTypenameAndId(taxonomyTermSubject),
          },
        })
    })

    test('by id (w/ child)', async () => {
      given('UuidQuery').for(taxonomyTermCurriculumTopic)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on SetTaxonomyParentNotificationEvent {
                  child {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(setTaxonomyParentNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            child: getTypenameAndId(taxonomyTermCurriculumTopic),
          },
        })
    })
  })

  describe('CreateThreadNotificationEvent', () => {
    beforeEach(() => {
      given('EventQuery').for(createThreadNotificationEvent)
    })

    test('by id', async () => {
      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                __typename
                ... on CreateThreadNotificationEvent {
                  id
                  instance
                  date
                  objectId
                }
              }
            }
          `,
        })
        .withVariables(createThreadNotificationEvent)
        .shouldReturnData({
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId'],
            createThreadNotificationEvent
          ),
        })
    })

    test('by id (w/ actor)', async () => {
      given('UuidQuery').for(user)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on CreateThreadNotificationEvent {
                  actor {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(createThreadNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        })
    })

    test('by id (w/ object)', async () => {
      given('UuidQuery').for(article)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on CreateThreadNotificationEvent {
                  object {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(createThreadNotificationEvent)
        .shouldReturnData({
          notificationEvent: { object: getTypenameAndId(article) },
        })
    })

    test('by id (w/ thread)', async () => {
      givenThreads({ uuid: article, threads: [[comment]] })

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on CreateThreadNotificationEvent {
                  thread {
                    title
                  }
                }
              }
            }
          `,
        })
        .withVariables(createThreadNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            thread: {
              title: comment.title,
            },
          },
        })
    })
  })

  describe('SetLicenseNotification', () => {
    beforeEach(() => {
      given('EventQuery').for(setLicenseNotificationEvent)
    })

    test('by id', async () => {
      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                __typename
                ... on SetLicenseNotificationEvent {
                  id
                  instance
                  objectId
                  date
                }
              }
            }
          `,
        })
        .withVariables(setLicenseNotificationEvent)
        .shouldReturnData({
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId'],
            setLicenseNotificationEvent
          ),
        })
    })

    test('by id (w/ actor)', async () => {
      given('UuidQuery').for(user)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on SetLicenseNotificationEvent {
                  actor {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(setLicenseNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        })
    })

    test('by id (w/ repository)', async () => {
      given('UuidQuery').for(article)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on SetLicenseNotificationEvent {
                  repository {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(setLicenseNotificationEvent)
        .shouldReturnData({
          notificationEvent: { repository: getTypenameAndId(article) },
        })
    })
  })

  describe('SetThreadStateNotificationEvent', () => {
    beforeEach(() => {
      given('EventQuery').for(setThreadStateNotificationEvent)
    })

    test('by id', async () => {
      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                __typename
                ... on SetThreadStateNotificationEvent {
                  id
                  instance
                  date
                  objectId
                  archived
                }
              }
            }
          `,
        })
        .withVariables(setThreadStateNotificationEvent)
        .shouldReturnData({
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId', 'archived'],
            setThreadStateNotificationEvent
          ),
        })
    })

    test('by id (w/ actor)', async () => {
      given('UuidQuery').for(user)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on SetThreadStateNotificationEvent {
                  actor {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(setThreadStateNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        })
    })

    test('by id (w/ thread)', async () => {
      givenThreads({ uuid: article, threads: [[comment]] })

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on SetThreadStateNotificationEvent {
                  thread {
                    title
                  }
                }
              }
            }
          `,
        })
        .withVariables(setThreadStateNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            thread: {
              title: comment.title,
            },
          },
        })
    })
  })

  describe('SetUuidStateNotificationEvent', () => {
    beforeEach(() => {
      given('EventQuery').for(setUuidStateNotificationEvent)
    })

    test('by id', async () => {
      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                __typename
                ... on SetUuidStateNotificationEvent {
                  id
                  instance
                  date
                  objectId
                  trashed
                }
              }
            }
          `,
        })
        .withVariables(setUuidStateNotificationEvent)
        .shouldReturnData({
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId', 'trashed'],
            setUuidStateNotificationEvent
          ),
        })
    })

    test('by id (w/ actor)', async () => {
      given('UuidQuery').for(user)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on SetUuidStateNotificationEvent {
                  actor {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(setUuidStateNotificationEvent)
        .shouldReturnData({
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        })
    })

    test('by id (w/ object)', async () => {
      given('UuidQuery').for(article)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on SetUuidStateNotificationEvent {
                  object {
                    __typename
                    id
                  }
                }
              }
            }
          `,
        })
        .withVariables(setUuidStateNotificationEvent)
        .shouldReturnData({
          notificationEvent: { object: getTypenameAndId(article) },
        })
    })
  })

  describe('UnsupportedNotificationEvent', () => {
    beforeEach(() => {
      given('EventQuery').for({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error We assume here that we get an invalid type name
        __typename: 'SomeFancyNotificationEvent',
        id: castToUuid(1337),
        instance: Instance.De,
        date: '2014-03-01T20:45:56Z',
      })
    })

    test('by id', async () => {
      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                __typename
                id
                instance
                date
              }
            }
          `,
        })
        .withVariables({ id: 1337 })
        .shouldReturnData({
          notificationEvent: null,
        })
    })
  })

  test('notificationEvent returns null when event cannot be found', async () => {
    given('EventQuery').withPayload({ id: 1234567 }).returnsNotFound()

    await client
      .prepareQuery({
        query: gql`
          query notificationEvent($id: Int!) {
            notificationEvent(id: $id) {
              ... on CheckoutRevisionNotificationEvent {
                __typename
                id
              }
            }
          }
        `,
      })
      .withVariables({ id: 1234567 })
      .shouldReturnData({ notificationEvent: null })
  })
})

describe('mutation notification setState', () => {
  const mutation = new Client({ userId: user.id })
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
    .withVariables({
      input: { id: [1, 2, 3], unread: false },
    })

  const notificationQuery = new Client({ userId: user.id }).prepareQuery({
    query: gql`
      query {
        notifications {
          nodes {
            id
            unread
          }
          totalCount
        }
      }
    `,
  })

  beforeEach(() => {
    given('NotificationsQuery')
      .withPayload({ userId: user.id })
      .returns({
        notifications: [
          { id: 3, unread: true, eventId: 3 },
          { id: 2, unread: false, eventId: 2 },
          { id: 1, unread: false, eventId: 1 },
        ],
        userId: user.id,
      })

    given('UuidQuery').for(user, user2, article)
  })

  test('authenticated with array of ids', async () => {
    given('NotificationSetStateMutation')
      .withPayload({
        ids: [1, 2, 3],
        userId: user.id,
        unread: false,
      })
      .returns()
    given('EventQuery').for([
      {
        ...createEntityNotificationEvent,
        id: castToUuid(1),
        objectId: article.id,
      },
      {
        ...createEntityNotificationEvent,
        id: castToUuid(2),
        objectId: article.id,
      },
      {
        ...createEntityNotificationEvent,
        id: castToUuid(3),
        objectId: article.id,
      },
    ])
    await mutation.shouldReturnData({
      notification: { setState: { success: true } },
    })
  })

  test('unauthenticated', async () => {
    await mutation
      .forUnauthenticatedUser()
      .shouldFailWithError('UNAUTHENTICATED')
  })

  test('setting ids from other user', async () => {
    given('NotificationSetStateMutation')
      .withPayload({
        ids: [1, 2, 3],
        userId: user2.id,
        unread: false,
      })
      .returns()

    given('NotificationsQuery')
      .withPayload({ userId: user2.id })
      .returns({
        notifications: [
          { id: 4, unread: true, eventId: 3 },
          { id: 5, unread: false, eventId: 2 },
        ],
        userId: user2.id,
      })

    await mutation
      .withContext({ userId: user2.id })
      .shouldFailWithError('FORBIDDEN')
  })

  test('cache is mutated as expected: single id', async () => {
    given('NotificationSetStateMutation')
      .withPayload({
        ids: [1],
        userId: user.id,
        unread: true,
      })
      .returns()
    given('EventQuery').for([
      {
        ...createEntityNotificationEvent,
        id: castToUuid(1),
        objectId: article.id,
      },
    ])

    //fill notification cache
    await notificationQuery.withVariables({}).shouldReturnData({
      notifications: {
        nodes: [
          { id: 3, unread: true },
          { id: 2, unread: false },
          { id: 1, unread: false },
        ],
        totalCount: 3,
      },
    })

    await mutation.withInput({ id: 1, unread: true }).execute()

    await notificationQuery.shouldReturnData({
      notifications: {
        nodes: [
          { id: 3, unread: true },
          { id: 2, unread: false },
          { id: 1, unread: true },
        ],
        totalCount: 3,
      },
    })
  })

  test('cache is mutated as expected: array', async () => {
    given('NotificationSetStateMutation')
      .withPayload({
        ids: [1, 2, 3],
        userId: user.id,
        unread: false,
      })
      .returns()
    given('EventQuery').for([
      {
        ...createEntityNotificationEvent,
        id: castToUuid(1),
        objectId: article.id,
      },
      {
        ...createEntityNotificationEvent,
        id: castToUuid(2),
        objectId: article.id,
      },
      {
        ...createEntityNotificationEvent,
        id: castToUuid(3),
        objectId: article.id,
      },
    ])

    //fill notification cache
    await notificationQuery.withVariables({}).shouldReturnData({
      notifications: {
        nodes: [
          { id: 3, unread: true },
          { id: 2, unread: false },
          { id: 1, unread: false },
        ],
        totalCount: 3,
      },
    })

    await mutation.withInput({ id: [1, 2, 3], unread: false }).execute()

    await notificationQuery.shouldReturnData({
      notifications: {
        nodes: [
          { id: 3, unread: false },
          { id: 2, unread: false },
          { id: 1, unread: false },
        ],
        totalCount: 3,
      },
    })
  })
})
