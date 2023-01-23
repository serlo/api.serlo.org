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

import {
  groupedExercise,
  groupedExerciseRevision,
  exerciseGroup,
} from '../../../__fixtures__'
import { getTypenameAndId, given, Client } from '../../__utils__'

describe('GroupedExercise', () => {
  beforeEach(() => {
    given('UuidQuery').for(groupedExercise)
  })

  test('by id', async () => {
    given('UuidQuery').for(groupedExercise)

    await new Client()
      .prepareQuery({
        query: gql`
          query groupedExercise($id: Int!) {
            uuid(id: $id) {
              __typename
              ... on GroupedExercise {
                id
                trashed
                instance
                date
              }
            }
          }
        `,
      })
      .withVariables(groupedExercise)
      .shouldReturnData({
        uuid: R.pick(
          ['__typename', 'id', 'trashed', 'instance', 'date'],
          groupedExercise
        ),
      })
  })

  test('by id (w/ exerciseGroup)', async () => {
    given('UuidQuery').for(exerciseGroup)

    await new Client()
      .prepareQuery({
        query: gql`
          query groupedExercise($id: Int!) {
            uuid(id: $id) {
              ... on GroupedExercise {
                exerciseGroup {
                  __typename
                  id
                }
              }
            }
          }
        `,
      })
      .withVariables(groupedExercise)
      .shouldReturnData({
        uuid: { exerciseGroup: getTypenameAndId(exerciseGroup) },
      })
  })
})

test('GroupedExerciseRevision', async () => {
  given('UuidQuery').for(groupedExerciseRevision)

  await new Client()
    .prepareQuery({
      query: gql`
        query groupedExerciseRevision($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on GroupedExerciseRevision {
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
    .withVariables(groupedExerciseRevision)
    .shouldReturnData({
      uuid: R.pick(
        ['__typename', 'id', 'trashed', 'date', 'content', 'changes'],
        groupedExerciseRevision
      ),
    })
})
