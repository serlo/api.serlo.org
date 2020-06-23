import { gql } from 'apollo-server'

import { Service } from '../src/graphql/schema/types'
import { createTestClient } from './__utils__/test-client'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  assertSuccessfulGraphQLQuery,
} from './__utils__/assertions'

describe('Notifications', () => {
  test('setNotificationState (forbidden)', async () => {
    const { client } = createTestClient({
      service: Service.Playground,
      user: null,
    })
    await assertFailingGraphQLMutation(
      {
        mutation: gql`
          mutation {
            setNotificationState(id: 1, unread: false)
          }
        `,
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('UNAUTHENTICATED')
      }
    )
  })
  /*
  test('setNotificationState (authenticated)', async () => {
    const { client } = createTestClient({ service: Service.Serlo, user: 1 })
    await assertSuccessfulGraphQLMutation({
      mutation: gql`
        mutation {
          setNotificationState(id: 1, unread: false)
        }
      `,
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          notifications {
            nodes {
              id
              unread
            }
          }
        }
      `,
      data: {
        notifications: {
          nodes: {
            id: 1,
            unread: false,
          },
        },
      },
      client,
    })
  })
  */
})
