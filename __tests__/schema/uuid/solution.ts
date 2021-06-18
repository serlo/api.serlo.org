/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { gql } from 'apollo-server'

import {
  solution,
  solutionRevision,
  getSolutionDataWithoutSubResolvers,
  getSolutionRevisionDataWithoutSubResolvers,
  exercise,
} from '../../../__fixtures__'
import {
  assertSuccessfulGraphQLQuery,
  Client,
  createTestClient,
  createUuidHandler,
  getTypenameAndId,
} from '../../__utils__'

let client: Client

beforeEach(() => {
  client = createTestClient()
})

describe('Solution', () => {
  beforeEach(() => {
    global.server.use(createUuidHandler(solution))
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query solution($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on Solution {
              id
              trashed
              instance
              date
            }
          }
        }
      `,
      variables: solution,
      data: {
        uuid: getSolutionDataWithoutSubResolvers(solution),
      },
      client,
    })
  })

  test('by id (w/ exercise)', async () => {
    global.server.use(createUuidHandler(exercise))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query solution($id: Int!) {
          uuid(id: $id) {
            ... on Solution {
              exercise {
                __typename
                id
              }
            }
          }
        }
      `,
      variables: solution,
      data: {
        uuid: {
          exercise: getTypenameAndId(exercise),
        },
      },
      client,
    })
  })
})

test('SolutionRevision', async () => {
  global.server.use(createUuidHandler(solutionRevision))
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query solutionRevision($id: Int!) {
        uuid(id: $id) {
          __typename
          ... on SolutionRevision {
            id
            trashed
            date
            content
            changes
          }
        }
      }
    `,
    variables: solutionRevision,
    data: {
      uuid: getSolutionRevisionDataWithoutSubResolvers(solutionRevision),
    },
    client,
  })
})
