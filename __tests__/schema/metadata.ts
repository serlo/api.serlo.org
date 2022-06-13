/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { Instance } from '@serlo/api'
import { gql } from 'apollo-server'

import { Client, given } from '../__utils__'

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
          id: 'https://serlo.org/',
        }) as unknown,
      },
    })
})

describe('endpoint "entities"', () => {
  const query = new Client().prepareQuery({
    query: gql`
      query (
        $first: Int
        $after: String
        $instance: Instance
        $modifiedAfter: String
      ) {
        metadata {
          entities(
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

  test('returns list of metadata for entities', async () => {
    given('EntitiesMetadataQuery')
      .withPayload({ first: 101 })
      .returns({
        entities: [{ identifier: { value: 1 }, id: 'https://serlo.org/1' }],
      })

    await query.shouldReturnData({
      metadata: {
        entities: {
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
        entities: {
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
        entities: {
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
          entities: {
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
        entities: {
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
  await new Client()
    .prepareQuery({
      query: gql`
        query {
          metadata {
            version
          }
        }
      `,
    })
    .shouldReturnData({
      metadata: {
        version: expect.stringMatching(/^\d+\.\d+\.\d+/) as unknown,
      },
    })
})
