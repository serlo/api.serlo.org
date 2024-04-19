import { jest } from '@jest/globals'
import gql from 'graphql-tag'

import { metadataExamples } from '../../__fixtures__/metadata'
import { Client, given } from '../__utils__'
import { encodeToBase64 } from '~/internals/graphql'
import { Instance } from '~/types'

jest.setTimeout(60 * 1000)

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

  describe('returns metadata of learning resources', () => {
    const testCases = metadataExamples.map((res) => {
      const name = `${res.type[1]} ${res.identifier.value}`
      return [name, res] as const
    })

    test.each(testCases)('%s', async (_, resource) => {
      const after = encodeToBase64((resource.identifier.value - 1).toString())
      await query.withVariables({ first: 1, after }).shouldReturnData({
        metadata: {
          resources: {
            nodes: [resource],
          },
        },
      })
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
      version: expect.stringMatching(/^\d+\.\d+\.\d+/) as unknown,
    },
  })
})
