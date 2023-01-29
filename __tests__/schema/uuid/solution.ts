/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2023 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2023 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { gql } from 'apollo-server'
import R from 'ramda'

import { solution, solutionRevision, exercise } from '../../../__fixtures__'
import { getTypenameAndId, given, Client } from '../../__utils__'

describe('Solution', () => {
  beforeEach(() => {
    given('UuidQuery').for(solution)
  })

  test('by id', async () => {
    await new Client()
      .prepareQuery({
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
      })
      .withVariables(solution)
      .shouldReturnData({
        uuid: R.pick(
          ['__typename', 'id', 'trashed', 'instance', 'date'],
          solution
        ),
      })
  })

  test('by id (w/ exercise)', async () => {
    given('UuidQuery').for(exercise)

    await new Client()
      .prepareQuery({
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
      })
      .withVariables(solution)
      .shouldReturnData({
        uuid: {
          exercise: getTypenameAndId(exercise),
        },
      })
  })
})

test('SolutionRevision', async () => {
  given('UuidQuery').for(solutionRevision)

  await new Client()
    .prepareQuery({
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
    })
    .withVariables(solutionRevision)
    .shouldReturnData({
      uuid: R.pick(
        ['__typename', 'id', 'trashed', 'date', 'content', 'changes'],
        solutionRevision
      ),
    })
})
