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

import {
  article,
  articleRevision,
  checkoutRevisionNotificationEvent,
  createCommentNotificationEvent,
  createEntityLinkNotificationEvent,
  createEntityNotificationEvent,
  createEntityRevisionNotificationEvent,
  createTaxonomyLinkNotificationEvent,
  createTaxonomyTermNotificationEvent,
  createThreadNotificationEvent,
  exercise,
  getArticleDataWithoutSubResolvers,
  getArticleRevisionDataWithoutSubResolvers,
  getCheckoutRevisionNotificationEventDataWithoutSubResolvers,
  getCreateCommentNotificationEventDataWithoutSubResolvers,
  getCreateEntityLinkNotificationEventDataWithoutSubResolvers,
  getCreateEntityNotificationEventDataWithoutSubResolvers,
  getCreateEntityRevisionNotificationEventDataWithoutSubResolvers,
  getCreateTaxonomyLinkNotificationEventDataWithoutSubResolvers,
  getCreateTaxonomyTermNotificationEventDataWithoutSubResolvers,
  getCreateThreadNotificationEventDataWithoutSubResolvers,
  getExerciseDataWithoutSubResolvers,
  getRejectRevisionNotificationEventDataWithoutSubResolvers,
  getRemoveEntityLinkNotificationEventDataWithoutSubResolvers,
  getRemoveTaxonomyLinkNotificationEventDataWithoutSubResolvers,
  getSetLicenseNotificationEventDataWithoutSubResolvers,
  getSetTaxonomyParentNotificationEventDataWithoutSubResolvers,
  getSetTaxonomyTermNotificationEventDataWithoutSubResolvers,
  getSetThreadStateNotificationEventDataWithoutSubResolvers,
  getSetUuidStateNotificationEventDataWithoutSubResolvers,
  getSolutionDataWithoutSubResolvers,
  getTaxonomyTermDataWithoutSubResolvers,
  getUserDataWithoutSubResolvers,
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
  unsupportedComment,
  unsupportedThread,
  user,
  user2,
} from '../../__fixtures__'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  assertSuccessfulGraphQLQuery,
  Client,
  createNotificationEventHandler,
  createTestClient,
  createUuidHandler,
} from '../__utils__'
import { Service } from '~/internals/auth'
import { Instance } from '~/types'

describe('notifications', () => {
  let client: Client

  beforeEach(() => {
    client = createTestClient({
      service: Service.SerloCloudflareWorker,
      user: user.id,
    })
    global.server.use(
      rest.get(
        `http://de.${process.env.SERLO_ORG_HOST}/api/notifications/${user.id}`,
        (_req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              userId: user.id,
              notifications: [
                { id: 3, unread: true, eventId: 3 },
                { id: 2, unread: false, eventId: 2 },
                { id: 1, unread: false, eventId: 1 },
              ],
            })
          )
        }
      )
    )
  })

  test('notifications without filter', async () => {
    const client = createTestClient({
      service: Service.SerloCloudflareWorker,
      user: 1,
    })
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
    const client = createTestClient({
      service: Service.SerloCloudflareWorker,
      user: 1,
    })
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
    const client = createTestClient({
      service: Service.SerloCloudflareWorker,
      user: 1,
    })
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
      rest.get(
        `http://de.${process.env.SERLO_ORG_HOST}/api/notifications/${user.id}`,
        (_req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              userId: user.id,
              notifications: [
                {
                  id: 1,
                  unread: false,
                  eventId: checkoutRevisionNotificationEvent.id,
                },
              ],
            })
          )
        }
      ),
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
              event: getCheckoutRevisionNotificationEventDataWithoutSubResolvers(
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
    client = createTestClient({
      service: Service.SerloCloudflareWorker,
      user: null,
    })
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
                instance
                date
                objectId
                reason
              }
            }
          }
        `,
        variables: checkoutRevisionNotificationEvent,
        data: {
          notificationEvent: getCheckoutRevisionNotificationEventDataWithoutSubResolvers(
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
                  trashed
                  username
                  date
                  lastLogin
                  description
                }
              }
            }
          }
        `,
        variables: checkoutRevisionNotificationEvent,
        data: {
          notificationEvent: {
            actor: getUserDataWithoutSubResolvers(user),
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
                  ... on Article {
                    id
                    trashed
                    instance
                    date
                  }
                }
              }
            }
          }
        `,
        variables: checkoutRevisionNotificationEvent,
        data: {
          notificationEvent: {
            repository: getArticleDataWithoutSubResolvers(article),
          },
        },
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
                  ... on ArticleRevision {
                    id
                    trashed
                    date
                    title
                    content
                    changes
                    metaTitle
                    metaDescription
                  }
                }
              }
            }
          }
        `,
        variables: checkoutRevisionNotificationEvent,
        data: {
          notificationEvent: {
            revision: getArticleRevisionDataWithoutSubResolvers(
              articleRevision
            ),
          },
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
          notificationEvent: getRejectRevisionNotificationEventDataWithoutSubResolvers(
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
                  trashed
                  username
                  date
                  lastLogin
                  description
                }
              }
            }
          }
        `,
        variables: rejectRevisionNotificationEvent,
        data: {
          notificationEvent: {
            actor: getUserDataWithoutSubResolvers(user),
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
                  ... on Article {
                    id
                    trashed
                    instance
                    date
                  }
                }
              }
            }
          }
        `,
        variables: rejectRevisionNotificationEvent,
        data: {
          notificationEvent: {
            repository: getArticleDataWithoutSubResolvers(article),
          },
        },
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
                  ... on ArticleRevision {
                    id
                    trashed
                    date
                    title
                    content
                    changes
                    metaTitle
                    metaDescription
                  }
                }
              }
            }
          }
        `,
        variables: rejectRevisionNotificationEvent,
        data: {
          notificationEvent: {
            revision: getArticleRevisionDataWithoutSubResolvers(
              articleRevision
            ),
          },
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
          notificationEvent: getCreateCommentNotificationEventDataWithoutSubResolvers(
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
                  trashed
                  username
                  date
                  lastLogin
                  description
                }
              }
            }
          }
        `,
        variables: createCommentNotificationEvent,
        data: {
          notificationEvent: {
            actor: getUserDataWithoutSubResolvers(user),
          },
        },
        client,
      })
    })

    test('by id (w/ thread)', async () => {
      await assertSuccessfulGraphQLQuery({
        query: gql`
          query notificationEvent($id: Int!) {
            notificationEvent(id: $id) {
              ... on CreateCommentNotificationEvent {
                thread {
                  id
                }
              }
            }
          }
        `,
        variables: createCommentNotificationEvent,
        data: {
          notificationEvent: {
            thread: unsupportedThread,
          },
        },
        client,
      })
    })

    test('by id (w/ comment)', async () => {
      await assertSuccessfulGraphQLQuery({
        query: gql`
          query notificationEvent($id: Int!) {
            notificationEvent(id: $id) {
              ... on CreateCommentNotificationEvent {
                comment {
                  id
                }
              }
            }
          }
        `,
        variables: createCommentNotificationEvent,
        data: {
          notificationEvent: {
            comment: unsupportedComment,
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
          notificationEvent: getCreateEntityNotificationEventDataWithoutSubResolvers(
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
                  trashed
                  username
                  date
                  lastLogin
                  description
                }
              }
            }
          }
        `,
        variables: createEntityNotificationEvent,
        data: {
          notificationEvent: {
            actor: getUserDataWithoutSubResolvers(user),
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
                  ... on Article {
                    id
                    trashed
                    instance
                    date
                  }
                }
              }
            }
          }
        `,
        variables: createEntityNotificationEvent,
        data: {
          notificationEvent: {
            entity: getArticleDataWithoutSubResolvers(article),
          },
        },
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
          notificationEvent: getCreateEntityLinkNotificationEventDataWithoutSubResolvers(
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
                  trashed
                  username
                  date
                  lastLogin
                  description
                }
              }
            }
          }
        `,
        variables: createEntityLinkNotificationEvent,
        data: {
          notificationEvent: {
            actor: getUserDataWithoutSubResolvers(user),
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
                    trashed
                    instance
                    date
                  }
                }
              }
            }
          }
        `,
        variables: createEntityLinkNotificationEvent,
        data: {
          notificationEvent: {
            parent: getExerciseDataWithoutSubResolvers(exercise),
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
                    trashed
                    instance
                    date
                  }
                }
              }
            }
          }
        `,
        variables: createEntityLinkNotificationEvent,
        data: {
          notificationEvent: {
            child: getSolutionDataWithoutSubResolvers(solution),
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
          notificationEvent: getRemoveEntityLinkNotificationEventDataWithoutSubResolvers(
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
                  trashed
                  username
                  date
                  lastLogin
                  description
                }
              }
            }
          }
        `,
        variables: removeEntityLinkNotificationEvent,
        data: {
          notificationEvent: {
            actor: getUserDataWithoutSubResolvers(user),
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
                    trashed
                    instance
                    date
                  }
                }
              }
            }
          }
        `,
        variables: removeEntityLinkNotificationEvent,
        data: {
          notificationEvent: {
            parent: getExerciseDataWithoutSubResolvers(exercise),
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
                    trashed
                    instance
                    date
                  }
                }
              }
            }
          }
        `,
        variables: removeEntityLinkNotificationEvent,
        data: {
          notificationEvent: {
            child: getSolutionDataWithoutSubResolvers(solution),
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
          notificationEvent: getCreateEntityRevisionNotificationEventDataWithoutSubResolvers(
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
                  trashed
                  username
                  date
                  lastLogin
                  description
                }
              }
            }
          }
        `,
        variables: createEntityRevisionNotificationEvent,
        data: {
          notificationEvent: {
            actor: getUserDataWithoutSubResolvers(user),
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
                  ... on Article {
                    id
                    trashed
                    instance
                    date
                  }
                }
              }
            }
          }
        `,
        variables: createEntityRevisionNotificationEvent,
        data: {
          notificationEvent: {
            entity: getArticleDataWithoutSubResolvers(article),
          },
        },
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
                  ... on ArticleRevision {
                    id
                    trashed
                    date
                    title
                    content
                    changes
                    metaTitle
                    metaDescription
                  }
                }
              }
            }
          }
        `,
        variables: createEntityRevisionNotificationEvent,
        data: {
          notificationEvent: {
            entityRevision: getArticleRevisionDataWithoutSubResolvers(
              articleRevision
            ),
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
          notificationEvent: getCreateTaxonomyTermNotificationEventDataWithoutSubResolvers(
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
                  trashed
                  username
                  date
                  lastLogin
                  description
                }
              }
            }
          }
        `,
        variables: createTaxonomyTermNotificationEvent,
        data: {
          notificationEvent: {
            actor: getUserDataWithoutSubResolvers(user),
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
                  type
                  trashed
                  instance
                  name
                  description
                  weight
                }
              }
            }
          }
        `,
        variables: createTaxonomyTermNotificationEvent,
        data: {
          notificationEvent: {
            taxonomyTerm: getTaxonomyTermDataWithoutSubResolvers(
              taxonomyTermCurriculumTopic
            ),
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
          notificationEvent: getSetTaxonomyTermNotificationEventDataWithoutSubResolvers(
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
                  trashed
                  username
                  date
                  lastLogin
                  description
                }
              }
            }
          }
        `,
        variables: setTaxonomyTermNotificationEvent,
        data: {
          notificationEvent: {
            actor: getUserDataWithoutSubResolvers(user),
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
                  type
                  trashed
                  instance
                  name
                  description
                  weight
                }
              }
            }
          }
        `,
        variables: setTaxonomyTermNotificationEvent,
        data: {
          notificationEvent: {
            taxonomyTerm: getTaxonomyTermDataWithoutSubResolvers(
              taxonomyTermCurriculumTopic
            ),
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
          notificationEvent: getCreateTaxonomyLinkNotificationEventDataWithoutSubResolvers(
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
                  trashed
                  username
                  date
                  lastLogin
                  description
                }
              }
            }
          }
        `,
        variables: createTaxonomyLinkNotificationEvent,
        data: {
          notificationEvent: {
            actor: getUserDataWithoutSubResolvers(user),
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
                  type
                  trashed
                  instance
                  name
                  description
                  weight
                }
              }
            }
          }
        `,
        variables: createTaxonomyLinkNotificationEvent,
        data: {
          notificationEvent: {
            parent: getTaxonomyTermDataWithoutSubResolvers(
              taxonomyTermCurriculumTopic
            ),
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
                  ... on Article {
                    id
                    trashed
                    instance
                    date
                  }
                }
              }
            }
          }
        `,
        variables: createTaxonomyLinkNotificationEvent,
        data: {
          notificationEvent: {
            child: getArticleDataWithoutSubResolvers(article),
          },
        },
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
          notificationEvent: getRemoveTaxonomyLinkNotificationEventDataWithoutSubResolvers(
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
                  trashed
                  username
                  date
                  lastLogin
                  description
                }
              }
            }
          }
        `,
        variables: removeTaxonomyLinkNotificationEvent,
        data: {
          notificationEvent: {
            actor: getUserDataWithoutSubResolvers(user),
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
                  type
                  trashed
                  instance
                  name
                  description
                  weight
                }
              }
            }
          }
        `,
        variables: removeTaxonomyLinkNotificationEvent,
        data: {
          notificationEvent: {
            parent: getTaxonomyTermDataWithoutSubResolvers(
              taxonomyTermCurriculumTopic
            ),
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
                  ... on Article {
                    id
                    trashed
                    instance
                    date
                  }
                }
              }
            }
          }
        `,
        variables: removeTaxonomyLinkNotificationEvent,
        data: {
          notificationEvent: {
            child: getArticleDataWithoutSubResolvers(article),
          },
        },
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
          notificationEvent: getSetTaxonomyParentNotificationEventDataWithoutSubResolvers(
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
                  trashed
                  username
                  date
                  lastLogin
                  description
                }
              }
            }
          }
        `,
        variables: setTaxonomyParentNotificationEvent,
        data: {
          notificationEvent: {
            actor: getUserDataWithoutSubResolvers(user),
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
                  type
                  trashed
                  instance
                  name
                  description
                  weight
                }
              }
            }
          }
        `,
        variables: setTaxonomyParentNotificationEvent,
        data: {
          notificationEvent: {
            previousParent: getTaxonomyTermDataWithoutSubResolvers(
              taxonomyTermRoot
            ),
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
                  type
                  trashed
                  instance
                  name
                  description
                  weight
                }
              }
            }
          }
        `,
        variables: setTaxonomyParentNotificationEvent,
        data: {
          notificationEvent: {
            parent: getTaxonomyTermDataWithoutSubResolvers(taxonomyTermSubject),
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
                  type
                  trashed
                  instance
                  name
                  description
                  weight
                }
              }
            }
          }
        `,
        variables: setTaxonomyParentNotificationEvent,
        data: {
          notificationEvent: {
            child: getTaxonomyTermDataWithoutSubResolvers(
              taxonomyTermCurriculumTopic
            ),
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
          notificationEvent: getCreateThreadNotificationEventDataWithoutSubResolvers(
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
                  trashed
                  username
                  date
                  lastLogin
                  description
                }
              }
            }
          }
        `,
        variables: createThreadNotificationEvent,
        data: {
          notificationEvent: {
            actor: getUserDataWithoutSubResolvers(user),
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
                  ... on Article {
                    id
                    trashed
                    instance
                    date
                  }
                }
              }
            }
          }
        `,
        variables: createThreadNotificationEvent,
        data: {
          notificationEvent: {
            object: getArticleDataWithoutSubResolvers(article),
          },
        },
        client,
      })
    })

    test('by id (w/ thread)', async () => {
      await assertSuccessfulGraphQLQuery({
        query: gql`
          query notificationEvent($id: Int!) {
            notificationEvent(id: $id) {
              ... on CreateThreadNotificationEvent {
                thread {
                  id
                }
              }
            }
          }
        `,
        variables: createThreadNotificationEvent,
        data: {
          notificationEvent: {
            thread: unsupportedThread,
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
          notificationEvent: getSetLicenseNotificationEventDataWithoutSubResolvers(
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
                  trashed
                  username
                  date
                  lastLogin
                  description
                }
              }
            }
          }
        `,
        variables: setLicenseNotificationEvent,
        data: {
          notificationEvent: {
            actor: getUserDataWithoutSubResolvers(user),
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
                  ... on Article {
                    id
                    trashed
                    instance
                    date
                  }
                }
              }
            }
          }
        `,
        variables: setLicenseNotificationEvent,
        data: {
          notificationEvent: {
            repository: getArticleDataWithoutSubResolvers(article),
          },
        },
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
          notificationEvent: getSetThreadStateNotificationEventDataWithoutSubResolvers(
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
                  trashed
                  username
                  date
                  lastLogin
                  description
                }
              }
            }
          }
        `,
        variables: setThreadStateNotificationEvent,
        data: {
          notificationEvent: {
            actor: getUserDataWithoutSubResolvers(user),
          },
        },
        client,
      })
    })

    test('by id (w/ thread)', async () => {
      await assertSuccessfulGraphQLQuery({
        query: gql`
          query notificationEvent($id: Int!) {
            notificationEvent(id: $id) {
              ... on SetThreadStateNotificationEvent {
                thread {
                  id
                }
              }
            }
          }
        `,
        variables: setThreadStateNotificationEvent,
        data: {
          notificationEvent: {
            thread: unsupportedThread,
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
          notificationEvent: getSetUuidStateNotificationEventDataWithoutSubResolvers(
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
                  trashed
                  username
                  date
                  lastLogin
                  description
                }
              }
            }
          }
        `,
        variables: setUuidStateNotificationEvent,
        data: {
          notificationEvent: {
            actor: getUserDataWithoutSubResolvers(user),
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
                  ... on Article {
                    id
                    trashed
                    instance
                    date
                  }
                }
              }
            }
          }
        `,
        variables: setUuidStateNotificationEvent,
        data: {
          notificationEvent: {
            object: getArticleDataWithoutSubResolvers(article),
          },
        },
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
          id: 1337,
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
})

describe('setNotificationState', () => {
  const mutation = gql`
    mutation notification($input: NotificationSetStateInput!) {
      notification {
        setState(input: $input) {
          success
        }
      }
    }
  `

  test('authenticated with array of ids', async () => {
    global.server.use(
      rest.post(
        `http://de.${process.env.SERLO_ORG_HOST}/api/set-notification-state/:id`,
        (req, res, ctx) => {
          const id = parseInt(req.params.id)

          if (![1, 2, 3].includes(id)) return res(ctx.status(404))

          return res(
            ctx.json({
              notifications: [{ id, unread: false, eventId: id }],
              userId: user.id,
            })
          )
        }
      )
    )

    const client = createTestClient({ user: user.id })

    await assertSuccessfulGraphQLMutation({
      mutation,
      variables: {
        input: { id: [1, 2, 3], unread: false },
      },
      data: { notification: { setState: { success: true } } },
      client,
    })
  })

  test('unauthenticated', async () => {
    await assertFailingGraphQLMutation(
      {
        mutation,
        variables: { input: { id: 1, unread: false } },
        client: createTestClient({ user: null }),
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('UNAUTHENTICATED')
      }
    )
  })

  test('wrong user id', async () => {
    global.server.use(
      rest.post(
        `http://de.${process.env.SERLO_ORG_HOST}/api/set-notification-state/1`,
        (_req, res, ctx) => {
          return res(ctx.status(403))
        }
      )
    )

    const client = createTestClient({ user: user2.id })

    await assertFailingGraphQLMutation(
      {
        mutation,
        variables: { input: { id: 1, unread: false } },
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
      }
    )
  })
})
