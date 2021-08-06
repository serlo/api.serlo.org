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
import R from 'ramda'

import { groupedExercise, groupedExerciseRevision } from '../../../__fixtures__'
import {
  addUuidInteraction,
  assertSuccessfulGraphQLQuery,
} from '../../__utils__'
import { Model } from '~/internals/graphql'

test('GroupedExercise', async () => {
  await addUuidInteraction<Model<'GroupedExercise'>>({
    __typename: groupedExercise.__typename,
    id: groupedExercise.id,
    trashed: Matchers.boolean(groupedExercise.trashed),
    instance: Matchers.string(groupedExercise.instance),
    alias: groupedExercise.alias
      ? Matchers.string(groupedExercise.alias)
      : null,
    date: Matchers.iso8601DateTime(groupedExercise.date),
    currentRevisionId: groupedExercise.currentRevisionId
      ? Matchers.integer(groupedExercise.currentRevisionId)
      : null,
    revisionIds: Matchers.eachLike(groupedExercise.revisionIds[0]),
    licenseId: Matchers.integer(groupedExercise.licenseId),
    solutionId: groupedExercise.solutionId
      ? Matchers.integer(groupedExercise.solutionId)
      : null,
    parentId: groupedExercise.parentId,
    canonicalSubjectId: groupedExercise.canonicalSubjectId
      ? Matchers.integer(groupedExercise.canonicalSubjectId)
      : null,
  })
  await assertSuccessfulGraphQLQuery({
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
    variables: groupedExercise,
    data: {
      uuid: R.pick(
        ['__typename', 'id', 'trashed', 'instance', 'date'],
        groupedExercise
      ),
    },
  })
})

test('GroupedExerciseRevision', async () => {
  await addUuidInteraction<Model<'GroupedExerciseRevision'>>({
    __typename: groupedExerciseRevision.__typename,
    id: groupedExerciseRevision.id,
    trashed: Matchers.boolean(groupedExerciseRevision.trashed),
    alias: Matchers.string(groupedExerciseRevision.alias),
    date: Matchers.iso8601DateTime(groupedExerciseRevision.date),
    authorId: Matchers.integer(groupedExerciseRevision.authorId),
    repositoryId: Matchers.integer(groupedExerciseRevision.repositoryId),
    content: Matchers.string(groupedExerciseRevision.content),
    changes: Matchers.string(groupedExerciseRevision.changes),
  })
  await assertSuccessfulGraphQLQuery({
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
    variables: groupedExerciseRevision,
    data: {
      uuid: R.pick(
        ['__typename', 'id', 'trashed', 'date', 'content', 'changes'],
        groupedExerciseRevision
      ),
    },
  })
})
