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
import { Matchers } from '@pact-foundation/pact'
import { gql } from 'apollo-server'
import R from 'ramda'

import { solution, solutionRevision } from '../../../__fixtures__'
import {
  addUuidInteraction,
  assertSuccessfulGraphQLQuery,
} from '../../__utils__'
import { Model } from '~/internals/graphql'

test('Solution', async () => {
  await addUuidInteraction<Model<'Solution'>>({
    __typename: solution.__typename,
    id: solution.id,
    trashed: Matchers.boolean(solution.trashed),
    instance: Matchers.string(solution.instance),
    alias: Matchers.string(solution.alias),
    date: Matchers.iso8601DateTime(solution.date),
    currentRevisionId: solution.currentRevisionId
      ? Matchers.integer(solution.currentRevisionId)
      : null,
    revisionIds: Matchers.eachLike(solution.revisionIds[0]),
    licenseId: Matchers.integer(solution.licenseId),
    parentId: Matchers.integer(solution.parentId),
    canonicalSubjectId: solution.canonicalSubjectId
      ? Matchers.integer(solution.canonicalSubjectId)
      : null,
  })
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
      uuid: R.pick(
        ['__typename', 'id', 'trashed', 'instance', 'date'],
        solution
      ),
    },
  })
})

test('SolutionRevision', async () => {
  await addUuidInteraction<Model<'SolutionRevision'>>({
    __typename: solutionRevision.__typename,
    id: solutionRevision.id,
    trashed: Matchers.boolean(solutionRevision.trashed),
    alias: Matchers.string(solutionRevision.alias),
    date: Matchers.iso8601DateTime(solutionRevision.date),
    authorId: Matchers.integer(solutionRevision.authorId),
    repositoryId: Matchers.integer(solutionRevision.repositoryId),
    content: Matchers.string(solutionRevision.content),
    changes: Matchers.string(solutionRevision.changes),
  })
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
      uuid: R.pick(
        ['__typename', 'id', 'trashed', 'date', 'content', 'changes'],
        solutionRevision
      ),
    },
  })
})
