/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { Matchers } from '@pact-foundation/pact'
import { gql } from 'apollo-server'

import {
  exerciseGroup,
  exerciseGroupRevision,
  getExerciseGroupDataWithoutSubResolvers,
  getExerciseGroupRevisionDataWithoutSubResolvers,
} from '../../../__fixtures__'
import {
  ExerciseGroupPayload,
  ExerciseGroupRevisionPayload,
} from '../../../src/graphql/schema/uuid/exercise-group'
import {
  addUuidInteraction,
  assertSuccessfulGraphQLQuery,
} from '../../__utils__'

test('ExerciseGroup', async () => {
  await addUuidInteraction<ExerciseGroupPayload>({
    __typename: exerciseGroup.__typename,
    id: exerciseGroup.id,
    trashed: Matchers.boolean(exerciseGroup.trashed),
    instance: Matchers.string(exerciseGroup.instance),
    alias: exerciseGroup.alias ? Matchers.string(exerciseGroup.alias) : null,
    date: Matchers.iso8601DateTime(exerciseGroup.date),
    currentRevisionId: exerciseGroup.currentRevisionId
      ? Matchers.integer(exerciseGroup.currentRevisionId)
      : null,
    licenseId: Matchers.integer(exerciseGroup.licenseId),
    exerciseIds:
      exerciseGroup.exerciseIds.length > 0
        ? Matchers.eachLike(Matchers.like(exerciseGroup.exerciseIds[0]))
        : [],
    taxonomyTermIds:
      exerciseGroup.taxonomyTermIds.length > 0
        ? Matchers.eachLike(Matchers.like(exerciseGroup.taxonomyTermIds[0]))
        : [],
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query exerciseGroup($id: Int!) {
        uuid(id: $id) {
          __typename
          ... on ExerciseGroup {
            id
            trashed
            instance
            alias
            date
          }
        }
      }
    `,
    variables: exerciseGroup,
    data: {
      uuid: getExerciseGroupDataWithoutSubResolvers(exerciseGroup),
    },
  })
})

test('ExerciseGroupRevision', async () => {
  await addUuidInteraction<ExerciseGroupRevisionPayload>({
    __typename: exerciseGroupRevision.__typename,
    id: exerciseGroupRevision.id,
    trashed: Matchers.boolean(exerciseGroupRevision.trashed),
    date: Matchers.iso8601DateTime(exerciseGroupRevision.date),
    authorId: Matchers.integer(exerciseGroupRevision.authorId),
    repositoryId: Matchers.integer(exerciseGroupRevision.repositoryId),
    content: Matchers.string(exerciseGroupRevision.content),
    changes: Matchers.string(exerciseGroupRevision.changes),
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query exerciseGroupRevision($id: Int!) {
        uuid(id: $id) {
          __typename
          ... on ExerciseGroupRevision {
            id
            trashed
            date
            content
            changes
          }
        }
      }
    `,
    variables: exerciseGroupRevision,
    data: {
      uuid: getExerciseGroupRevisionDataWithoutSubResolvers(
        exerciseGroupRevision
      ),
    },
  })
})
