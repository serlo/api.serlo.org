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

import {
  exerciseGroup as baseExerciseGroup,
  user,
  groupedExercise,
} from '../../../__fixtures__'
import { castToUuid, Client, given } from '../../__utils__'

const exerciseGroup = {
  ...baseExerciseGroup,
  exerciseIds: [2219, 2220].map(castToUuid),
}

const mutation = new Client({ userId: user.id })
  .prepareQuery({
    query: gql`
      mutation ($input: EntitySortInput!) {
        entity {
          sort(input: $input) {
            success
          }
        }
      }
    `,
  })
  .withInput({ childrenIds: [2220, 2219], entityId: exerciseGroup.id })

beforeEach(() => {
  given('UuidQuery').for(user, exerciseGroup)

  given('EntitySortMutation')
    .withPayload({ childrenIds: [2220, 2219], entityId: exerciseGroup.id })
    .isDefinedBy((req, res, ctx) => {
      const { childrenIds } = req.body.payload

      given('UuidQuery').for({
        ...exerciseGroup,
        exerciseIds: childrenIds.map(castToUuid),
      })

      return res(ctx.json({ success: true }))
    })
})

test('returns "{ success: true }" when mutation could be successfully executed', async () => {
  await mutation.shouldReturnData({ entity: { sort: { success: true } } })
})

test('updates the cache', async () => {
  given('UuidQuery').for(
    { ...groupedExercise, id: castToUuid(2219) },
    { ...groupedExercise, id: castToUuid(2220) }
  )

  const query = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            ... on ExerciseGroup {
              exercises {
                id
              }
            }
          }
        }
      `,
    })
    .withVariables({ id: exerciseGroup.id })

  await query.shouldReturnData({
    uuid: { exercises: [{ id: 2219 }, { id: 2220 }] },
  })

  await mutation.execute()

  await query.shouldReturnData({
    uuid: { exercises: [{ id: 2220 }, { id: 2219 }] },
  })
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when database layer returns a 400er response', async () => {
  given('EntitySortMutation').returnsBadRequest()

  await mutation.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer has an internal error', async () => {
  given('EntitySortMutation').hasInternalServerError()

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
