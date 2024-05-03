import gql from 'graphql-tag'

import { article } from '../../__fixtures__'
import { given, Client } from '../__utils__'
import { encodeId } from '~/internals/graphql'
import { Instance } from '~/types'
import { HttpResponse } from 'msw'

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
    given('AliasQuery').returns({
      id: 2,
      instance: Instance.De,
      path: '/user/profile/1229793e',
    })
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
        nodes: [{ __typename: 'CreateEntityNotificationEvent', id: 1198 }],
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

describe('event types', () => {
  beforeEach(() => {
    given('UuidQuery').isDefinedBy(async ({ request }) => {
      const payload = await request.json()

      console.log(payload)

      return HttpResponse.json({ id: 1 })
    })
  })

  test('CheckoutRevisionNotificationEvent', async () => {
    given('UuidQuery').for({ ...article, id: 35603 })

    expect(await getEvent(86577)).toEqual({})
  })

  async function getEvent(id: number) {
    const query = new Client().prepareQuery({
      query: gql`
        query ($after: String) {
          events(after: $after, first: 1) {
            nodes {
              __typename
              id
              instance
              actor {
                id
              }
              objectId

              ... on CheckoutRevisionNotificationEvent {
                repository {
                  id
                }
                revision {
                  id
                }
                reason
              }
            }
          }
        }
      `,
      variables: { after: encodeId({ id: id + 1 }) },
    })

    const result = await query.execute()

    if (result.body.kind === 'single' && result.body.singleResult['errors']) {
      console.log(result.body.singleResult['errors'])
    }

    const { events } = (await query.getData()) as {
      events: { nodes: unknown[] }
    }

    expect(events.nodes).toHaveLength(1)

    console.log(JSON.stringify(events.nodes[0]))

    return events.nodes[0]
  }
})
