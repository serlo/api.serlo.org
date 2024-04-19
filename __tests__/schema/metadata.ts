import { jest } from '@jest/globals'
import gql from 'graphql-tag'
import * as R from 'ramda'

import { metadataExamples } from '../../__fixtures__/metadata'
import { Client, given } from '../__utils__'
import { encodeToBase64 } from '~/internals/graphql'
import { Instance } from '~/types'
import assert from 'assert'

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
      const after = afterForId(resource.identifier.value)
      await query.withVariables({ first: 1, after }).shouldReturnData({
        metadata: {
          resources: {
            nodes: [resource],
          },
        },
      })
    })
  })

  test('shows description when it is set', async () => {
    await global.database.mutate(`
      update entity_revision_field
      set value = "description for entity 2153"
      where id = 41509 and field = "meta_description";`)

    const after = afterForId(2153)
    const data = await query.withVariables({ first: 1, after }).getData()

    expect(R.path(['metadata', 'resources', 'nodes', 0], data)).toMatchObject({
      id: 'https://serlo.org/2153',
      description: 'description for entity 2153',
    })
  })

  test('with parameter "first"', async () => {
    const data = await query.withVariables({ first: 10 }).getData()
    const nodes = R.path(['metadata', 'resources', 'nodes'], data)

    assert(Array.isArray(nodes))

    expect(R.map(R.prop('id'), nodes)).toEqual([
      'https://serlo.org/1495',
      'https://serlo.org/1497',
      'https://serlo.org/1499',
      'https://serlo.org/1501',
      'https://serlo.org/1503',
      'https://serlo.org/1505',
      'https://serlo.org/1507',
      'https://serlo.org/1509',
      'https://serlo.org/1511',
      'https://serlo.org/1513',
    ])
  })

  test('fails when "first" parameter exceeds hardcoded limit (1000)', async () => {
    await query
      .withVariables({ first: 1001 })
      .shouldFailWithError('BAD_USER_INPUT')
  })

  test('with parameter "after"', async () => {
    const data = await query
      .withVariables({ first: 1, after: afterForId(1947) })
      .getData()

    expect(R.path(['metadata', 'resources', 'nodes', 0], data)).toMatchObject({
      id: 'https://serlo.org/1947',
    })
  })

  test('fails when "after" parameter is invalid', async () => {
    await query
      .withVariables({ after: 'foo' })
      .shouldFailWithError('BAD_USER_INPUT')
  })

  test('with parameter "modifiedAfter"', async () => {
    const data = await query
      .withVariables({ first: 1, modifiedAfter: '2015-01-01T00:00:00Z' })
      .getData()

    expect(R.path(['metadata', 'resources', 'nodes', 0], data)).toMatchObject({
      id: 'https://serlo.org/1647',
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

function afterForId(id: number) {
  return encodeToBase64((id - 1).toString())
}
