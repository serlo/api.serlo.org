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
import { gql } from 'apollo-server'
import R from 'ramda'

import {
  exerciseGroup,
  exerciseGroupRevision,
  groupedExercise,
} from '../../../__fixtures__'
import { getTypenameAndId, Client, given } from '../../__utils__'

describe('ExerciseGroup', () => {
  beforeEach(() => {
    given('UuidQuery').for(exerciseGroup)
  })

  test('by id', async () => {
    await new Client()
      .prepareQuery({
        query: gql`
          query exerciseGroup($id: Int!) {
            uuid(id: $id) {
              __typename
              ... on ExerciseGroup {
                id
                trashed
                instance
                date
              }
            }
          }
        `,
      })
      .withVariables({ id: exerciseGroup.id })
      .shouldReturnData({
        uuid: R.pick(
          ['__typename', 'id', 'trashed', 'instance', 'date'],
          exerciseGroup
        ),
      })
  })

  test('by id (w/ exercises)', async () => {
    given('UuidQuery').for(groupedExercise)

    await new Client()
      .prepareQuery({
        query: gql`
          query exerciseGroup($id: Int!) {
            uuid(id: $id) {
              ... on ExerciseGroup {
                exercises {
                  __typename
                  id
                }
              }
            }
          }
        `,
      })
      .withVariables({ id: exerciseGroup.id })
      .shouldReturnData({
        uuid: { exercises: [getTypenameAndId(groupedExercise)] },
      })
  })

  test('ExerciseGroupRevision', async () => {
    given('UuidQuery').for(exerciseGroupRevision)

    await new Client()
      .prepareQuery({
        query: gql`
          query exerciseGroupRevision($id: Int!) {
            uuid(id: $id) {
              __typename
              ... on ExerciseGroupRevision {
                id
                trashed
                date
                cohesive
                content
                changes
              }
            }
          }
        `,
      })
      .withVariables({ id: exerciseGroupRevision.id })
      .shouldReturnData({
        uuid: R.pick(
          [
            '__typename',
            'id',
            'trashed',
            'date',
            'cohesive',
            'content',
            'changes',
          ],
          exerciseGroupRevision
        ),
      })
  })
})
