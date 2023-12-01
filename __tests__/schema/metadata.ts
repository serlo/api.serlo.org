import gql from 'graphql-tag'

import { Client, given } from '../__utils__'
import { Instance } from '~/types'

test('endpoint `publisher` returns publisher', async () => {
  await new Client()
    .prepareQuery({
      query: gql`
        query {
          metadata {
            publisher
          }
        }
      `,
    })
    .shouldReturnData({
      metadata: {
        publisher: expect.objectContaining({
          id: 'https://serlo.org/organization',
        }) as unknown,
      },
    })
})

describe('endpoint "resources"', () => {
  const query = new Client().prepareQuery({
    query: gql`
      query (
        $first: Int
        $after: String
        $instance: Instance
        $modifiedAfter: String
      ) {
        metadata {
          resources(
            first: $first
            after: $after
            instance: $instance
            modifiedAfter: $modifiedAfter
          ) {
            nodes
          }
        }
      }
    `,
  })

  test('returns list of metadata for resources', async () => {
    given('EntitiesMetadataQuery')
      .withPayload({ first: 101 })
      .returns({
        entities: [{ identifier: { value: 1 }, id: 'https://serlo.org/1' }],
      })

    await query.shouldReturnData({
      metadata: {
        resources: {
          nodes: [{ identifier: { value: 1 }, id: 'https://serlo.org/1' }],
        },
      },
    })
  })

  test('with parameter "first"', async () => {
    given('EntitiesMetadataQuery')
      .withPayload({ first: 11 })
      .returns({
        entities: [{ identifier: { value: 1 }, id: 'https://serlo.org/1' }],
      })

    await query.withVariables({ first: 10 }).shouldReturnData({
      metadata: {
        resources: {
          nodes: [{ identifier: { value: 1 }, id: 'https://serlo.org/1' }],
        },
      },
    })
  })

  test('with parameter "after"', async () => {
    given('EntitiesMetadataQuery')
      .withPayload({ first: 101, after: 1513 })
      .returns({
        entities: [{ identifier: { value: 11 }, id: 'https://serlo.org/11' }],
      })

    await query.withVariables({ after: 'MTUxMw==' }).shouldReturnData({
      metadata: {
        resources: {
          nodes: [{ identifier: { value: 11 }, id: 'https://serlo.org/11' }],
        },
      },
    })
  })

  test('fails when "after" parameter is invalid', async () => {
    await query
      .withVariables({ after: 'foo' })
      .shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when "first" parameter exceeds hardcoded limit (1000)', async () => {
    await query
      .withVariables({ first: 1001 })
      .shouldFailWithError('BAD_USER_INPUT')
  })

  test('with parameter "modifiedAfter"', async () => {
    given('EntitiesMetadataQuery')
      .withPayload({ first: 101, modifiedAfter: '2019-12-01' })
      .returns({
        entities: [{ identifier: { value: 1 }, id: 'https://serlo.org/1' }],
      })

    await query
      .withVariables({ modifiedAfter: '2019-12-01' })
      .shouldReturnData({
        metadata: {
          resources: {
            nodes: [{ identifier: { value: 1 }, id: 'https://serlo.org/1' }],
          },
        },
      })
  })

  test('with parameter "instance"', async () => {
    given('EntitiesMetadataQuery')
      .withPayload({ first: 101, instance: Instance.De })
      .returns({
        entities: [{ identifier: { value: 1 }, id: 'https://serlo.org/1' }],
      })

    await query.withVariables({ instance: Instance.De }).shouldReturnData({
      metadata: {
        resources: {
          nodes: [{ identifier: { value: 1 }, id: 'https://serlo.org/1' }],
        },
      },
    })
  })

  test('fails when database layer returns bad request', async () => {
    given('EntitiesMetadataQuery').returnsBadRequest()

    await query.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has internal server error', async () => {
    given('EntitiesMetadataQuery').hasInternalServerError()

    await query.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})

test('endpoint `version` returns string that could be semver', async () => {
  const versionQuery = new Client().prepareQuery({
    query: gql`
      query {
        metadata {
          version
        }
      }
    `,
  })
  await versionQuery.shouldReturnData({
    metadata: {
      version: expect.not.stringContaining('0.0.0') as unknown,
    },
  })

  await versionQuery.shouldReturnData({
    metadata: {
      version: expect.stringMatching(/^\d+\.\d+\.\d+/) as unknown,
    },
  })
})
