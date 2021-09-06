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
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  assertSuccessfulGraphQLQuery,
  castToUuid,
  Client,
  createMessageHandler,
  createNotificationEventHandler,
  createTestClient,
  createUuidHandler,
  getTypenameAndId,
} from '../__utils__'
import { mockEndpointsForThreads } from './thread/thread'
import { Payload } from '~/internals/model'
import { Instance } from '~/types'

describe('notifications', () => {
  let client: Client

  beforeEach(() => {
    client = createTestClient({ userId: user.id })
    global.server.use(
      createNotificationsHandler({
        userId: user.id,
        notifications: [
          { id: 3, unread: true, eventId: 3 },
          { id: 2, unread: false, eventId: 2 },
          { id: 1, unread: false, eventId: 1 },
        ],
      })
    )
  })

  test('notifications without filter', async () => {
    await assertSuccessfulGraphQLQuery({
      ...createNotificationsQuery(),
      data: {
        notifications: {
          totalCount: 3,
          nodes: [
            { id: 3, unread: true },
            { id: 2, unread: false },
            { id: 1, unread: false },
          ],
        },
      },
      client,
    })
  })

  test('notifications (only unread)', async () => {
    await assertSuccessfulGraphQLQuery({
      ...createNotificationsQuery(false),
      data: {
        notifications: {
          totalCount: 2,
          nodes: [
            { id: 2, unread: false },
            { id: 1, unread: false },
          ],
        },
      },
      client,
    })
  })

  test('notifications (only read)', async () => {
    await assertSuccessfulGraphQLQuery({
      ...createNotificationsQuery(true),
      data: {
        notifications: { totalCount: 1, nodes: [{ id: 3, unread: true }] },
      },
      client,
    })
  })

  test('notifications (w/ event)', async () => {
    global.server.use(
      createNotificationsHandler({
        userId: user.id,
        notifications: [
          {
            id: 1,
            unread: false,
            eventId: checkoutRevisionNotificationEvent.id,
          },
        ],
      }),
      createNotificationEventHandler(checkoutRevisionNotificationEvent)
    )
    await assertSuccessfulGraphQLQuery({
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
      data: {
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
      },
      client,
    })
  })

  function createNotificationsQuery(unread?: boolean) {
    return {
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
      variables: { unread },
    }
  }
})

describe('notificationEvent', () => {
  let client: Client

  beforeEach(() => {
    client = createTestClient({ userId: null })
  })

  describe('CheckoutRevisionNotification', () => {
    beforeEach(() => {
      global.server.use(
        createNotificationEventHandler(checkoutRevisionNotificationEvent)
      )
    })

    test('by id', async () => {
      await assertSuccessfulGraphQLQuery({
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
        variables: checkoutRevisionNotificationEvent,
        data: {
          notificationEvent: getTypenameAndId(
            checkoutRevisionNotificationEvent
          ),
        },
        client,
      })
    })

    test('by id (w/ actor)', async () => {
      global.server.use(createUuidHandler(user))
      await assertSuccessfulGraphQLQuery({
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
        variables: checkoutRevisionNotificationEvent,
        data: {
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        },
        client,
      })
    })

    test('by id (w/ repository)', async () => {
      global.server.use(createUuidHandler(article))
      await assertSuccessfulGraphQLQuery({
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
        variables: checkoutRevisionNotificationEvent,
        data: { notificationEvent: { repository: getTypenameAndId(article) } },
        client,
      })
    })

    test('by id (w/ revision)', async () => {
      global.server.use(createUuidHandler(articleRevision))
      await assertSuccessfulGraphQLQuery({
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
        variables: checkoutRevisionNotificationEvent,
        data: {
          notificationEvent: { revision: getTypenameAndId(articleRevision) },
        },
        client,
      })
    })
  })

  describe('RejectRevisionNotification', () => {
    beforeEach(() => {
      global.server.use(
        createNotificationEventHandler(rejectRevisionNotificationEvent)
      )
    })

    test('by id', async () => {
      await assertSuccessfulGraphQLQuery({
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
        variables: rejectRevisionNotificationEvent,
        data: {
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'reason', 'objectId'],
            rejectRevisionNotificationEvent
          ),
        },
        client,
      })
    })

    test('by id (w/ actor)', async () => {
      global.server.use(createUuidHandler(user))
      await assertSuccessfulGraphQLQuery({
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
        variables: rejectRevisionNotificationEvent,
        data: {
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        },
        client,
      })
    })

    test('by id (w/ repository)', async () => {
      global.server.use(createUuidHandler(article))
      await assertSuccessfulGraphQLQuery({
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
        variables: rejectRevisionNotificationEvent,
        data: { notificationEvent: { repository: getTypenameAndId(article) } },
        client,
      })
    })

    test('by id (w/ revision)', async () => {
      global.server.use(createUuidHandler(articleRevision))
      await assertSuccessfulGraphQLQuery({
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
        variables: rejectRevisionNotificationEvent,
        data: {
          notificationEvent: { revision: getTypenameAndId(articleRevision) },
        },
        client,
      })
    })
  })

  describe('CreateCommentNotificationEvent', () => {
    beforeEach(() => {
      global.server.use(
        createNotificationEventHandler(createCommentNotificationEvent)
      )
    })

    test('by id', async () => {
      await assertSuccessfulGraphQLQuery({
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
        variables: createCommentNotificationEvent,
        data: {
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId'],
            createCommentNotificationEvent
          ),
        },
        client,
      })
    })

    test('by id (w/ actor)', async () => {
      global.server.use(createUuidHandler(user))
      await assertSuccessfulGraphQLQuery({
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
        variables: createCommentNotificationEvent,
        data: {
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        },
        client,
      })
    })

    test('by id (w/ thread)', async () => {
      mockEndpointsForThreads(article, [[comment]])
      await assertSuccessfulGraphQLQuery({
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
        variables: createCommentNotificationEvent,
        data: {
          notificationEvent: {
            thread: { title: comment.title },
          },
        },
        client,
      })
    })

    test('by id (w/ comment)', async () => {
      global.server.use(createUuidHandler(comment))
      await assertSuccessfulGraphQLQuery({
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
        variables: createCommentNotificationEvent,
        data: {
          notificationEvent: {
            comment: getTypenameAndId(comment),
          },
        },
        client,
      })
    })
  })

  describe('CreateEntityNotificationEvent', () => {
    beforeEach(() => {
      global.server.use(
        createNotificationEventHandler(createEntityNotificationEvent)
      )
    })

    test('by id', async () => {
      await assertSuccessfulGraphQLQuery({
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
        variables: createEntityNotificationEvent,
        data: {
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId'],
            createEntityNotificationEvent
          ),
        },
        client,
      })
    })

    test('by id (w/ actor)', async () => {
      global.server.use(createUuidHandler(user))
      await assertSuccessfulGraphQLQuery({
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
        variables: createEntityNotificationEvent,
        data: {
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        },
        client,
      })
    })

    test('by id (w/ entity)', async () => {
      global.server.use(createUuidHandler(article))
      await assertSuccessfulGraphQLQuery({
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
        variables: createEntityNotificationEvent,
        data: { notificationEvent: { entity: getTypenameAndId(article) } },
        client,
      })
    })
  })

  describe('CreateEntityLinkNotificationEvent', () => {
    beforeEach(() => {
      global.server.use(
        createNotificationEventHandler(createEntityLinkNotificationEvent)
      )
    })

    test('by id', async () => {
      await assertSuccessfulGraphQLQuery({
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
        variables: createEntityLinkNotificationEvent,
        data: {
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId'],
            createEntityLinkNotificationEvent
          ),
        },
        client,
      })
    })

    test('by id (w/ actor)', async () => {
      global.server.use(createUuidHandler(user))
      await assertSuccessfulGraphQLQuery({
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
        variables: createEntityLinkNotificationEvent,
        data: {
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        },
        client,
      })
    })

    test('by id (w/ parent)', async () => {
      global.server.use(createUuidHandler(exercise))
      await assertSuccessfulGraphQLQuery({
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
        variables: createEntityLinkNotificationEvent,
        data: {
          notificationEvent: {
            parent: getTypenameAndId(exercise),
          },
        },
        client,
      })
    })

    test('by id (w/ child)', async () => {
      global.server.use(createUuidHandler(solution))
      await assertSuccessfulGraphQLQuery({
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
        variables: createEntityLinkNotificationEvent,
        data: {
          notificationEvent: {
            child: getTypenameAndId(solution),
          },
        },
        client,
      })
    })
  })

  describe('RemoveEntityLinkNotificationEvent', () => {
    beforeEach(() => {
      global.server.use(
        createNotificationEventHandler(removeEntityLinkNotificationEvent)
      )
    })

    test('by id', async () => {
      await assertSuccessfulGraphQLQuery({
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
        variables: removeEntityLinkNotificationEvent,
        data: {
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId'],
            removeEntityLinkNotificationEvent
          ),
        },
        client,
      })
    })

    test('by id (w/ actor)', async () => {
      global.server.use(createUuidHandler(user))
      await assertSuccessfulGraphQLQuery({
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
        variables: removeEntityLinkNotificationEvent,
        data: {
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        },
        client,
      })
    })

    test('by id (w/ parent)', async () => {
      global.server.use(createUuidHandler(exercise))
      await assertSuccessfulGraphQLQuery({
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
        variables: removeEntityLinkNotificationEvent,
        data: {
          notificationEvent: {
            parent: getTypenameAndId(exercise),
          },
        },
        client,
      })
    })

    test('by id (w/ child)', async () => {
      global.server.use(createUuidHandler(solution))
      await assertSuccessfulGraphQLQuery({
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
        variables: removeEntityLinkNotificationEvent,
        data: {
          notificationEvent: {
            child: getTypenameAndId(solution),
          },
        },
        client,
      })
    })
  })

  describe('CreateEntityRevisionNotificationEvent', () => {
    beforeEach(() => {
      global.server.use(
        createNotificationEventHandler(createEntityRevisionNotificationEvent)
      )
    })

    test('by id', async () => {
      await assertSuccessfulGraphQLQuery({
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
        variables: createEntityRevisionNotificationEvent,
        data: {
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId'],
            createEntityRevisionNotificationEvent
          ),
        },
        client,
      })
    })

    test('by id (w/ actor)', async () => {
      global.server.use(createUuidHandler(user))
      await assertSuccessfulGraphQLQuery({
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
        variables: createEntityRevisionNotificationEvent,
        data: {
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        },
        client,
      })
    })

    test('by id (w/ entity)', async () => {
      global.server.use(createUuidHandler(article))
      await assertSuccessfulGraphQLQuery({
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
        variables: createEntityRevisionNotificationEvent,
        data: { notificationEvent: { entity: getTypenameAndId(article) } },
        client,
      })
    })

    test('by id (w/ entityRevision)', async () => {
      global.server.use(createUuidHandler(articleRevision))
      await assertSuccessfulGraphQLQuery({
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
        variables: createEntityRevisionNotificationEvent,
        data: {
          notificationEvent: {
            entityRevision: getTypenameAndId(articleRevision),
          },
        },
        client,
      })
    })
  })

  describe('CreateTaxonomyTermNotificationEvent', () => {
    beforeEach(() => {
      global.server.use(
        createNotificationEventHandler(createTaxonomyTermNotificationEvent)
      )
    })

    test('by id', async () => {
      await assertSuccessfulGraphQLQuery({
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
        variables: createTaxonomyTermNotificationEvent,
        data: {
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId'],
            createTaxonomyTermNotificationEvent
          ),
        },
        client,
      })
    })

    test('by id (w/ actor)', async () => {
      global.server.use(createUuidHandler(user))
      await assertSuccessfulGraphQLQuery({
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
        variables: createTaxonomyTermNotificationEvent,
        data: {
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        },
        client,
      })
    })

    test('by id (w/ taxonomyTerm)', async () => {
      global.server.use(createUuidHandler(taxonomyTermCurriculumTopic))
      await assertSuccessfulGraphQLQuery({
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
        variables: createTaxonomyTermNotificationEvent,
        data: {
          notificationEvent: {
            taxonomyTerm: getTypenameAndId(taxonomyTermCurriculumTopic),
          },
        },
        client,
      })
    })
  })

  describe('SetTaxonomyTermNotificationEvent', () => {
    beforeEach(() => {
      global.server.use(
        createNotificationEventHandler(setTaxonomyTermNotificationEvent)
      )
    })

    test('by id', async () => {
      await assertSuccessfulGraphQLQuery({
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
        variables: setTaxonomyTermNotificationEvent,
        data: {
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId'],
            setTaxonomyTermNotificationEvent
          ),
        },
        client,
      })
    })

    test('by id (w/ actor)', async () => {
      global.server.use(createUuidHandler(user))
      await assertSuccessfulGraphQLQuery({
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
        variables: setTaxonomyTermNotificationEvent,
        data: {
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        },
        client,
      })
    })

    test('by id (w/ taxonomyTerm)', async () => {
      global.server.use(createUuidHandler(taxonomyTermCurriculumTopic))
      await assertSuccessfulGraphQLQuery({
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
        variables: setTaxonomyTermNotificationEvent,
        data: {
          notificationEvent: {
            taxonomyTerm: getTypenameAndId(taxonomyTermCurriculumTopic),
          },
        },
        client,
      })
    })
  })

  describe('CreateTaxonomyLinkNotificationEvent', () => {
    beforeEach(() => {
      global.server.use(
        createNotificationEventHandler(createTaxonomyLinkNotificationEvent)
      )
    })

    test('by id', async () => {
      await assertSuccessfulGraphQLQuery({
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
        variables: createTaxonomyLinkNotificationEvent,
        data: {
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId'],
            createTaxonomyLinkNotificationEvent
          ),
        },
        client,
      })
    })

    test('by id (w/ actor)', async () => {
      global.server.use(createUuidHandler(user))
      await assertSuccessfulGraphQLQuery({
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
        variables: createTaxonomyLinkNotificationEvent,
        data: {
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        },
        client,
      })
    })

    test('by id (w/ parent)', async () => {
      global.server.use(createUuidHandler(taxonomyTermCurriculumTopic))
      await assertSuccessfulGraphQLQuery({
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
        variables: createTaxonomyLinkNotificationEvent,
        data: {
          notificationEvent: {
            parent: getTypenameAndId(taxonomyTermCurriculumTopic),
          },
        },
        client,
      })
    })

    test('by id (w/ child)', async () => {
      global.server.use(createUuidHandler(article))
      await assertSuccessfulGraphQLQuery({
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
        variables: createTaxonomyLinkNotificationEvent,
        data: { notificationEvent: { child: getTypenameAndId(article) } },
        client,
      })
    })
  })

  describe('RemoveTaxonomyLinkNotificationEvent', () => {
    beforeEach(() => {
      global.server.use(
        createNotificationEventHandler(removeTaxonomyLinkNotificationEvent)
      )
    })

    test('by id', async () => {
      await assertSuccessfulGraphQLQuery({
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
        variables: removeTaxonomyLinkNotificationEvent,
        data: {
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId'],
            removeTaxonomyLinkNotificationEvent
          ),
        },
        client,
      })
    })

    test('by id (w/ actor)', async () => {
      global.server.use(createUuidHandler(user))
      await assertSuccessfulGraphQLQuery({
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
        variables: removeTaxonomyLinkNotificationEvent,
        data: {
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        },
        client,
      })
    })

    test('by id (w/ parent)', async () => {
      global.server.use(createUuidHandler(taxonomyTermCurriculumTopic))
      await assertSuccessfulGraphQLQuery({
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
        variables: removeTaxonomyLinkNotificationEvent,
        data: {
          notificationEvent: {
            parent: getTypenameAndId(taxonomyTermCurriculumTopic),
          },
        },
        client,
      })
    })

    test('by id (w/ child)', async () => {
      global.server.use(createUuidHandler(article))
      await assertSuccessfulGraphQLQuery({
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
        variables: removeTaxonomyLinkNotificationEvent,
        data: { notificationEvent: { child: getTypenameAndId(article) } },
        client,
      })
    })
  })

  describe('SetTaxonomyParentNotificationEvent', () => {
    beforeEach(() => {
      global.server.use(
        createNotificationEventHandler(setTaxonomyParentNotificationEvent)
      )
    })

    test('by id', async () => {
      await assertSuccessfulGraphQLQuery({
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
        variables: setTaxonomyParentNotificationEvent,
        data: {
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId'],
            setTaxonomyParentNotificationEvent
          ),
        },
        client,
      })
    })

    test('by id (w/ actor)', async () => {
      global.server.use(createUuidHandler(user))
      await assertSuccessfulGraphQLQuery({
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
        variables: setTaxonomyParentNotificationEvent,
        data: {
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        },
        client,
      })
    })

    test('by id (w/ previousParent)', async () => {
      global.server.use(createUuidHandler(taxonomyTermRoot))
      await assertSuccessfulGraphQLQuery({
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
        variables: setTaxonomyParentNotificationEvent,
        data: {
          notificationEvent: {
            previousParent: getTypenameAndId(taxonomyTermRoot),
          },
        },
        client,
      })
    })

    test('by id (w/ parent)', async () => {
      global.server.use(createUuidHandler(taxonomyTermSubject))
      await assertSuccessfulGraphQLQuery({
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
        variables: setTaxonomyParentNotificationEvent,
        data: {
          notificationEvent: {
            parent: getTypenameAndId(taxonomyTermSubject),
          },
        },
        client,
      })
    })

    test('by id (w/ child)', async () => {
      global.server.use(createUuidHandler(taxonomyTermCurriculumTopic))
      await assertSuccessfulGraphQLQuery({
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
        variables: setTaxonomyParentNotificationEvent,
        data: {
          notificationEvent: {
            child: getTypenameAndId(taxonomyTermCurriculumTopic),
          },
        },
        client,
      })
    })
  })

  describe('CreateThreadNotificationEvent', () => {
    beforeEach(() => {
      global.server.use(
        createNotificationEventHandler(createThreadNotificationEvent)
      )
    })

    test('by id', async () => {
      await assertSuccessfulGraphQLQuery({
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
        variables: createThreadNotificationEvent,
        data: {
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId'],
            createThreadNotificationEvent
          ),
        },
        client,
      })
    })

    test('by id (w/ actor)', async () => {
      global.server.use(createUuidHandler(user))
      await assertSuccessfulGraphQLQuery({
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
        variables: createThreadNotificationEvent,
        data: {
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        },
        client,
      })
    })

    test('by id (w/ object)', async () => {
      global.server.use(createUuidHandler(article))
      await assertSuccessfulGraphQLQuery({
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
        variables: createThreadNotificationEvent,
        data: { notificationEvent: { object: getTypenameAndId(article) } },
        client,
      })
    })

    test('by id (w/ thread)', async () => {
      mockEndpointsForThreads(article, [[comment]])
      await assertSuccessfulGraphQLQuery({
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
        variables: createThreadNotificationEvent,
        data: {
          notificationEvent: {
            thread: {
              title: comment.title,
            },
          },
        },
        client,
      })
    })
  })

  describe('SetLicenseNotification', () => {
    beforeEach(() => {
      global.server.use(
        createNotificationEventHandler(setLicenseNotificationEvent)
      )
    })

    test('by id', async () => {
      await assertSuccessfulGraphQLQuery({
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
        variables: setLicenseNotificationEvent,
        data: {
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId'],
            setLicenseNotificationEvent
          ),
        },
        client,
      })
    })

    test('by id (w/ actor)', async () => {
      global.server.use(createUuidHandler(user))
      await assertSuccessfulGraphQLQuery({
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
        variables: setLicenseNotificationEvent,
        data: {
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        },
        client,
      })
    })

    test('by id (w/ repository)', async () => {
      global.server.use(createUuidHandler(article))
      await assertSuccessfulGraphQLQuery({
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
        variables: setLicenseNotificationEvent,
        data: { notificationEvent: { repository: getTypenameAndId(article) } },
        client,
      })
    })
  })

  describe('SetThreadStateNotificationEvent', () => {
    beforeEach(() => {
      global.server.use(
        createNotificationEventHandler(setThreadStateNotificationEvent)
      )
    })

    test('by id', async () => {
      await assertSuccessfulGraphQLQuery({
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
        variables: setThreadStateNotificationEvent,
        data: {
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId', 'archived'],
            setThreadStateNotificationEvent
          ),
        },
        client,
      })
    })

    test('by id (w/ actor)', async () => {
      global.server.use(createUuidHandler(user))
      await assertSuccessfulGraphQLQuery({
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
        variables: setThreadStateNotificationEvent,
        data: {
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        },
        client,
      })
    })

    test('by id (w/ thread)', async () => {
      mockEndpointsForThreads(article, [[comment]])
      await assertSuccessfulGraphQLQuery({
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
        variables: setThreadStateNotificationEvent,
        data: {
          notificationEvent: {
            thread: {
              title: comment.title,
            },
          },
        },
        client,
      })
    })
  })

  describe('SetUuidStateNotificationEvent', () => {
    beforeEach(() => {
      global.server.use(
        createNotificationEventHandler(setUuidStateNotificationEvent)
      )
    })

    test('by id', async () => {
      await assertSuccessfulGraphQLQuery({
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
        variables: setUuidStateNotificationEvent,
        data: {
          notificationEvent: R.pick(
            ['__typename', 'id', 'instance', 'date', 'objectId', 'trashed'],
            setUuidStateNotificationEvent
          ),
        },
        client,
      })
    })

    test('by id (w/ actor)', async () => {
      global.server.use(createUuidHandler(user))
      await assertSuccessfulGraphQLQuery({
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
        variables: setUuidStateNotificationEvent,
        data: {
          notificationEvent: {
            actor: getTypenameAndId(user),
          },
        },
        client,
      })
    })

    test('by id (w/ object)', async () => {
      global.server.use(createUuidHandler(article))
      await assertSuccessfulGraphQLQuery({
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
        variables: setUuidStateNotificationEvent,
        data: { notificationEvent: { object: getTypenameAndId(article) } },
        client,
      })
    })
  })

  describe('UnsupportedNotificationEvent', () => {
    beforeEach(() => {
      global.server.use(
        createNotificationEventHandler({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error We assume here that we get an invalid type name
          __typename: 'SomeFancyNotificationEvent',
          id: castToUuid(1337),
          instance: Instance.De,
          date: '2014-03-01T20:45:56Z',
        })
      )
    })

    test('by id', async () => {
      await assertSuccessfulGraphQLQuery({
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
        variables: { id: 1337 },
        data: {
          notificationEvent: null,
        },
        client,
      })
    })
  })

  test('notificationEvent returns null when event cannot be found', async () => {
    global.server.use(
      createMessageHandler({
        message: { type: 'EventQuery', payload: { id: 1234567 } },
        statusCode: 404,
        body: null,
      })
    )

    await assertSuccessfulGraphQLQuery({
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
      variables: { id: 1234567 },
      data: { notificationEvent: null },
      client,
    })
  })
})

describe('mutation notification setState', () => {
  const mutation = gql`
    mutation notification($input: NotificationSetStateInput!) {
      notification {
        setState(input: $input) {
          success
        }
      }
    }
  `

  const notificationQuery = gql`
    query {
      notifications {
        nodes {
          id
          unread
        }
        totalCount
      }
    }
  `

  beforeEach(() => {
    global.server.use(
      createNotificationsHandler({
        userId: user.id,
        notifications: [
          { id: 3, unread: true, eventId: 3 },
          { id: 2, unread: false, eventId: 2 },
          { id: 1, unread: false, eventId: 1 },
        ],
      })
    )
  })

  test('authenticated with array of ids', async () => {
    global.server.use(
      createMessageHandler({
        message: {
          type: 'NotificationSetStateMutation',
          payload: { ids: [1, 2, 3], userId: user.id, unread: false },
        },
      }),
      createUuidHandler(user),
      createUuidHandler(article),
      createNotificationEventHandler({
        ...createEntityNotificationEvent,
        id: castToUuid(1),
        objectId: article.id,
      }),
      createNotificationEventHandler({
        ...createEntityNotificationEvent,
        id: castToUuid(2),
        objectId: article.id,
      }),
      createNotificationEventHandler({
        ...createEntityNotificationEvent,
        id: castToUuid(3),
        objectId: article.id,
      })
    )
    await assertSuccessfulGraphQLMutation({
      mutation,
      variables: {
        input: { id: [1, 2, 3], unread: false },
      },
      data: { notification: { setState: { success: true } } },
      client: createTestClient({ userId: user.id }),
    })
  })

  test('unauthenticated', async () => {
    await assertFailingGraphQLMutation({
      mutation,
      variables: { input: { id: 1, unread: false } },
      client: createTestClient({ userId: null }),
      expectedError: 'UNAUTHENTICATED',
    })
  })

  test('setting ids from other user', async () => {
    global.server.use(
      createMessageHandler({
        message: {
          type: 'NotificationSetStateMutation',
          payload: { ids: [1, 2, 3], userId: user2.id, unread: false },
        },
      }),
      createNotificationsHandler({
        userId: user2.id,
        notifications: [
          { id: 4, unread: true, eventId: 3 },
          { id: 5, unread: false, eventId: 2 },
        ],
      })
    )
    await assertFailingGraphQLMutation({
      mutation,
      variables: { input: { id: [1, 2, 3], unread: false } },
      client: createTestClient({ userId: user2.id }),
      expectedError: 'FORBIDDEN',
    })
  })

  test('cache is mutated as expected: single id', async () => {
    global.server.use(
      createMessageHandler({
        message: {
          type: 'NotificationSetStateMutation',
          payload: { ids: [1], userId: user.id, unread: true },
        },
      }),
      createUuidHandler(user),
      createUuidHandler(article),
      createNotificationEventHandler({
        ...createEntityNotificationEvent,
        id: castToUuid(1),
        objectId: article.id,
      })
    )

    const client = createTestClient({ userId: user.id })

    //fill notification cache
    await client.query({
      query: notificationQuery,
      variables: {},
    })

    await assertSuccessfulGraphQLMutation({
      mutation,
      variables: {
        input: { id: 1, unread: true },
      },
      data: { notification: { setState: { success: true } } },
      client,
    })

    await assertSuccessfulGraphQLQuery({
      query: notificationQuery,
      data: {
        notifications: {
          nodes: [
            { id: 3, unread: true },
            { id: 2, unread: false },
            { id: 1, unread: true },
          ],
          totalCount: 3,
        },
      },
      client,
    })
  })

  test('cache is mutated as expected: array', async () => {
    global.server.use(
      createMessageHandler({
        message: {
          type: 'NotificationSetStateMutation',
          payload: { ids: [1, 2, 3], userId: user.id, unread: false },
        },
      }),
      createUuidHandler(user),
      createUuidHandler(article),
      createNotificationEventHandler({
        ...createEntityNotificationEvent,
        id: castToUuid(1),
        objectId: article.id,
      }),
      createNotificationEventHandler({
        ...createEntityNotificationEvent,
        id: castToUuid(2),
        objectId: article.id,
      }),
      createNotificationEventHandler({
        ...createEntityNotificationEvent,
        id: castToUuid(3),
        objectId: article.id,
      })
    )

    const client = createTestClient({ userId: user.id })

    //fill notification cache
    await client.query({
      query: notificationQuery,
      variables: {},
    })

    await assertSuccessfulGraphQLMutation({
      mutation,
      variables: {
        input: { id: [1, 2, 3], unread: false },
      },
      data: { notification: { setState: { success: true } } },
      client,
    })

    await assertSuccessfulGraphQLQuery({
      query: notificationQuery,
      data: {
        notifications: {
          nodes: [
            { id: 3, unread: false },
            { id: 2, unread: false },
            { id: 1, unread: false },
          ],
          totalCount: 3,
        },
      },
      client,
    })
  })
})

function createNotificationsHandler(
  payload: Payload<'serlo', 'getNotifications'>
) {
  return createMessageHandler({
    message: {
      type: 'NotificationsQuery',
      payload: { userId: payload.userId },
    },
    body: payload,
  })
}
