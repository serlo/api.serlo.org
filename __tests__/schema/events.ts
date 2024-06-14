import gql from 'graphql-tag'

import { Client } from '../__utils__'
import { Instance } from '~/types'

const query = new Client().prepareQuery({
  query: gql`
    query (
      $after: String
      $first: Int
      $actorId: Int
      $actorUsername: String
      $objectId: Int
      $instance: Instance
    ) {
      events(
        after: $after
        first: $first
        actorId: $actorId
        actorUsername: $actorUsername
        objectId: $objectId
        instance: $instance
      ) {
        nodes {
          __typename
          id
        }
      }
    }
  `,
})

describe('query endpoint "events"', () => {
  test('returns event log', async () => {
    await query.shouldReturnData({
      events: {
        nodes: [
          { __typename: 'SetTaxonomyTermNotificationEvent', id: 86591 },
          { __typename: 'SetTaxonomyTermNotificationEvent', id: 86590 },
          { __typename: 'SetTaxonomyTermNotificationEvent', id: 86589 },
          { __typename: 'SetTaxonomyTermNotificationEvent', id: 86588 },
          { __typename: 'SetTaxonomyTermNotificationEvent', id: 86587 },
          { __typename: 'CreateTaxonomyTermNotificationEvent', id: 86586 },
          { __typename: 'CheckoutRevisionNotificationEvent', id: 86577 },
          { __typename: 'CreateEntityRevisionNotificationEvent', id: 86576 },
          { __typename: 'CheckoutRevisionNotificationEvent', id: 86575 },
          { __typename: 'CreateEntityRevisionNotificationEvent', id: 86574 },
          { __typename: 'CheckoutRevisionNotificationEvent', id: 86573 },
        ],
      },
    })
  })

  test('with filter "first"', async () => {
    await query.withVariables({ first: 1 }).shouldReturnData({
      events: {
        nodes: [{ __typename: 'SetTaxonomyTermNotificationEvent', id: 86591 }],
      },
    })
  })

  test('with filter "actorId"', async () => {
    await query.withVariables({ first: 1, actorId: 2 }).shouldReturnData({
      events: {
        nodes: [{ __typename: 'CreateCommentNotificationEvent', id: 53732 }],
      },
    })
  })

  test('with filter "actorUsername"', async () => {
    await query
      .withVariables({ first: 1, actorUsername: '1229793e' })
      .shouldReturnData({
        events: {
          nodes: [{ __typename: 'CreateCommentNotificationEvent', id: 53732 }],
        },
      })
  })

  test('with filter "instance"', async () => {
    await query
      .withVariables({ first: 1, instance: Instance.De })
      .shouldReturnData({
        events: {
          nodes: [
            { __typename: 'CreateEntityRevisionNotificationEvent', id: 86460 },
          ],
        },
      })
  })

  test('with filter "objectId"', async () => {
    await query.withVariables({ first: 1, objectId: 1855 }).shouldReturnData({
      events: {
        nodes: [{ __typename: 'CheckoutRevisionNotificationEvent', id: 77030 }],
      },
    })
  })

  test('with filter "after"', async () => {
    await query
      .withVariables({ first: 1, after: 'MTE5OA==' })
      .shouldReturnData({
        events: {
          nodes: [{ __typename: 'SetLicenseNotificationEvent', id: 1197 }],
        },
      })
  })

  test('fails when first > 500', async () => {
    await query
      .withVariables({ first: 600 })
      .shouldFailWithError('BAD_USER_INPUT')
  })
})
