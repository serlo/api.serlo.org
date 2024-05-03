import gql from 'graphql-tag'
import * as R from 'ramda'

import {
  article,
  articleRevision,
  checkoutRevisionNotificationEvent,
  comment,
  course,
  coursePage,
  createCommentNotificationEvent,
  createEntityLinkNotificationEvent,
  createEntityNotificationEvent,
  createEntityRevisionNotificationEvent,
  createTaxonomyLinkNotificationEvent,
  createTaxonomyTermNotificationEvent,
  createThreadNotificationEvent,
  rejectRevisionNotificationEvent,
  removeEntityLinkNotificationEvent,
  removeTaxonomyLinkNotificationEvent,
  setLicenseNotificationEvent,
  setTaxonomyParentNotificationEvent,
  setTaxonomyTermNotificationEvent,
  setThreadStateNotificationEvent,
  setUuidStateNotificationEvent,
  taxonomyTermCurriculumTopic,
  taxonomyTermRoot,
  taxonomyTermSubject,
  user,
} from '../../__fixtures__'
import { getTypenameAndId, givenThreads, Client, given } from '../__utils__'
import { Service } from '~/context/service'
import { Instance } from '~/types'

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
    await global.database.mutate(`
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

describe('notificationEvent', () => {
  let client: Client

  beforeEach(() => {
    client = new Client({ userId: null })
  })

  describe('CheckoutRevisionNotification', () => {
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
            checkoutRevisionNotificationEvent,
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
            rejectRevisionNotificationEvent,
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
            createCommentNotificationEvent,
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
            comment: {
              __typename: 'Comment',
              id: comment.id,
            },
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
            createEntityNotificationEvent,
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
            createEntityLinkNotificationEvent,
          ),
        })
    })

    test('by id (w/ actor)', async () => {
      const actor = {
        ...user,
        id: createEntityLinkNotificationEvent.actorId,
      }

      given('UuidQuery').for(actor)

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
          notificationEvent: { actor: getTypenameAndId(actor) },
        })
    })

    test('by id (w/ parent)', async () => {
      given('UuidQuery').for(course)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on CreateEntityLinkNotificationEvent {
                  parent {
                    __typename
                    ... on Course {
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
            parent: getTypenameAndId(course),
          },
        })
    })

    test('by id (w/ child)', async () => {
      given('UuidQuery').for(coursePage)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on CreateEntityLinkNotificationEvent {
                  child {
                    __typename
                    ... on CoursePage {
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
            child: getTypenameAndId(coursePage),
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
            removeEntityLinkNotificationEvent,
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
      given('UuidQuery').for(course)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on RemoveEntityLinkNotificationEvent {
                  parent {
                    __typename
                    ... on Course {
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
            parent: getTypenameAndId(course),
          },
        })
    })

    test('by id (w/ child)', async () => {
      given('UuidQuery').for(coursePage)

      await client
        .prepareQuery({
          query: gql`
            query notificationEvent($id: Int!) {
              notificationEvent(id: $id) {
                ... on RemoveEntityLinkNotificationEvent {
                  child {
                    __typename
                    ... on CoursePage {
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
            child: getTypenameAndId(coursePage),
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
            createEntityRevisionNotificationEvent,
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
            createTaxonomyTermNotificationEvent,
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
            setTaxonomyTermNotificationEvent,
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
            createTaxonomyLinkNotificationEvent,
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
            removeTaxonomyLinkNotificationEvent,
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
            setTaxonomyParentNotificationEvent,
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
            createThreadNotificationEvent,
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
            setLicenseNotificationEvent,
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
            setThreadStateNotificationEvent,
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
            setUuidStateNotificationEvent,
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
        id: 1337,
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
