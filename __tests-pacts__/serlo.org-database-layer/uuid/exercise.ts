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
import { Matchers } from '@pact-foundation/pact'
import { gql } from 'apollo-server'

import {
  exercise,
  exerciseRevision,
  getExerciseDataWithoutSubResolvers,
  getExerciseRevisionDataWithoutSubResolvers,
} from '../../../__fixtures__'
import {
  addUuidInteraction,
  assertSuccessfulGraphQLQuery,
} from '../../__utils__'
import { ExercisePayload, ExerciseRevisionPayload } from '~/schema/uuid'

test('Exercise', async () => {
  await addUuidInteraction<ExercisePayload>({
    __typename: exercise.__typename,
    id: exercise.id,
    trashed: Matchers.boolean(exercise.trashed),
    instance: Matchers.string(exercise.instance),
    alias: Matchers.string(exercise.alias),
    date: Matchers.iso8601DateTime(exercise.date),
    currentRevisionId: exercise.currentRevisionId
      ? Matchers.integer(exercise.currentRevisionId)
      : null,
    revisionIds: Matchers.eachLike(exercise.revisionIds[0]),
    licenseId: Matchers.integer(exercise.licenseId),
    solutionId: exercise.solutionId
      ? Matchers.integer(exercise.solutionId)
      : null,
    taxonomyTermIds:
      exercise.taxonomyTermIds.length > 0
        ? Matchers.eachLike(Matchers.like(exercise.taxonomyTermIds[0]))
        : [],
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query exercise($id: Int!) {
        uuid(id: $id) {
          __typename
          ... on Exercise {
            id
            trashed
            instance
            date
          }
        }
      }
    `,
    variables: exercise,
    data: {
      uuid: getExerciseDataWithoutSubResolvers(exercise),
    },
  })
})

test('ExerciseRevision', async () => {
  await addUuidInteraction<ExerciseRevisionPayload>({
    __typename: exerciseRevision.__typename,
    id: exerciseRevision.id,
    trashed: Matchers.boolean(exerciseRevision.trashed),
    alias: Matchers.string(exerciseRevision.alias),
    date: Matchers.iso8601DateTime(exerciseRevision.date),
    authorId: Matchers.integer(exerciseRevision.authorId),
    repositoryId: Matchers.integer(exerciseRevision.repositoryId),
    content: Matchers.string(exerciseRevision.content),
    changes: Matchers.string(exerciseRevision.changes),
  })

  await assertSuccessfulGraphQLQuery({
    query: gql`
      query exerciseRevision($id: Int!) {
        uuid(id: $id) {
          __typename
          ... on ExerciseRevision {
            id
            trashed
            date
            content
            changes
          }
        }
      }
    `,
    variables: exerciseRevision,
    data: {
      uuid: getExerciseRevisionDataWithoutSubResolvers(exerciseRevision),
    },
  })
})
