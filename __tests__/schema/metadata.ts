import { jest } from '@jest/globals'
import assert from 'assert'
import gql from 'graphql-tag'
import * as R from 'ramda'

import { metadataExamples } from '../../__fixtures__'
import { Client } from '../__utils__'
import { encodeToBase64 } from '~/internals/graphql'

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
    await global.databaseForTests.mutate(`
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

  test('returns creators sorted by contributions', async () => {
    const after = afterForId(9066)
    const data = await query.withVariables({ first: 1, after }).getData()
    const creators = R.path(
      ['metadata', 'resources', 'nodes', 0, 'creator'],
      data,
    )
    assert(Array.isArray(creators))

    // There are two edits from user with id 15491 which is why they
    // should be listed first
    expect(R.map(R.prop('id'), creators)).toEqual([
      'https://serlo.org/15491',
      'https://serlo.org/6',
    ])
  })

  test('returns several subjects in about property', async () => {
    const after = afterForId(25506)
    const data = await query.withVariables({ first: 1, after }).getData()

    expect(R.path(['metadata', 'resources', 'nodes', 0], data)).toMatchObject({
      about: [
        {
          type: 'Concept',
          id: 'http://w3id.org/kim/schulfaecher/s1001',
          inScheme: { id: 'http://w3id.org/kim/schulfaecher/' },
        },
        {
          type: 'Concept',
          id: 'http://w3id.org/kim/schulfaecher/s1008',
          inScheme: { id: 'http://w3id.org/kim/schulfaecher/' },
        },
      ],
    })
  })

  test('returns original source as creator followed by serlo authors', async () => {
    const after = afterForId(12160)
    const data = await query.withVariables({ first: 1, after }).getData()

    expect(R.path(['metadata', 'resources', 'nodes', 0], data)).toMatchObject({
      creator: [
        {
          type: 'Organization',
          id: 'http://www.raschweb.de/',
          name: 'http://www.raschweb.de/',
        },
        {
          affiliation: {
            id: 'https://serlo.org/organization',
            name: 'Serlo Education e.V.',
            type: 'Organization',
          },
          id: 'https://serlo.org/6',
          name: '12297c72',
          type: 'Person',
        },
      ],
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
    process.env.METADATA_API_LAST_CHANGES_DATE = '2014-12-30T00:00:00Z'

    const data = await query
      .withVariables({ first: 1, modifiedAfter: '2015-01-01T00:00:00Z' })
      .getData()

    expect(R.path(['metadata', 'resources', 'nodes', 0], data)).toMatchObject({
      id: 'https://serlo.org/1647',
    })
  })

  test('returns all resources when "modifiedAfter" is smaller than last change in metadata API', async () => {
    process.env.METADATA_API_LAST_CHANGES_DATE = '2015-01-01T00:00:01Z'

    const data = await query
      .withVariables({ first: 1, modifiedAfter: '2015-01-01T00:00:00Z' })
      .getData()

    expect(R.path(['metadata', 'resources', 'nodes', 0], data)).toMatchObject({
      id: 'https://serlo.org/1495',
    })
  })

  test('fails when "modifiedAfter" is an invalid date', async () => {
    await query
      .withVariables({ first: 1, modifiedAfter: 'hello' })
      .shouldFailWithError('BAD_USER_INPUT')
  })

  test('with parameter "instance"', async () => {
    const data = await query
      .withVariables({ first: 1, instance: 'en' })
      .getData()

    expect(R.path(['metadata', 'resources', 'nodes', 0], data)).toMatchObject({
      id: 'https://serlo.org/32996',
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
