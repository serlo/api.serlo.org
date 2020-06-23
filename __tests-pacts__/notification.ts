import { gql } from 'apollo-server'
import { createTestClient } from '../__tests__/__utils__/test-client'
import { Service } from '../src/graphql/schema/types'
import * as R from 'ramda'

import {
  addNotificationsInteraction,
  addNotificationEventInteraction,
  addUserInteraction,
  addArticleInteraction,
} from './__utils__/interactions'

import { event, notifications } from '../__fixtures__/notification'

import { user, article } from '../__fixtures__/uuid'

import { assertSuccessfulGraphQLQuery } from './__utils__/assertions'

test('Notifications', async () => {
  global.client = createTestClient({
    service: Service.Serlo,
    user: 2,
  }).client

  await addNotificationsInteraction(notifications)
  await addNotificationEventInteraction(event)
  await addUserInteraction(user)
  await addArticleInteraction(article)

  await assertSuccessfulGraphQLQuery({
    query: gql`
      {
        notifications {
          totalCount
          nodes {
            id
            unread
            event {
              id
              type
              instance
              date
              actor {
                id
                username
              }
              object {
                ... on Article {
                  id
                  trashed
                }
              }
              payload
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
            unread: true,
            event: {
              ...R.omit(['actorId', 'objectId'], event),
              actor: {
                id: 1,
                username: 'username',
              },
              object: {
                id: 1855,
                trashed: false,
              },
              payload: 'string',
            },
          },
        ],
      },
    },
  })
})
