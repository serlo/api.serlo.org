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
            setNotificationState(id: 1, state: false)
          }
        `,
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('UNAUTHENTICATED')
      }
    )
    // TODO: similarly to _setLicense (forbidden)
  })
  /*
  test('setNotificationState (authenticated)', async () => {
    // TODO:similarly to _setLicense (authenticated)
    // 1. execute mutation setNotificationState
    // 2. check that notification has now the correct state
    const { client } = createTestClient({ service: Service.Serlo, user: 1 })
    await assertSuccessfulGraphQLMutation({
      mutation: gql`
        mutation {
          setNotificationState(id: 1, state: false)
        }
      `,
      client,
    })
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          notifications {
            notifications {
              id
              unread
            }
          }
        }
      `,
      data: {
        notifications: {
          notifications: {
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
