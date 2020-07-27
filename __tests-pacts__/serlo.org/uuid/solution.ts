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
import * as R from 'ramda'

import {
  exercise,
  exerciseRevision,
  license,
  solution,
  solutionAlias,
  solutionRevision,
} from '../../../__fixtures__'
import {
  ExercisePayload,
  ExerciseRevisionPayload,
} from '../../../src/graphql/schema/uuid/exercise'
import {
  addAliasInteraction,
  addSolutionInteraction,
  addSolutionRevisionInteraction,
  addUuidInteraction,
  assertSuccessfulGraphQLQuery,
} from '../../__utils__'

describe('Solution', () => {
  test('by alias', async () => {
    await addSolutionInteraction(solution)
    await addAliasInteraction(solutionAlias)
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "${solutionAlias.path}"
              }
            ) {
              __typename
              ... on Solution {
                id
                trashed
                instance
                alias
                date
                currentRevision {
                  id
                }
                license {
                  id
                }
              }
            }
          }
        `,
      data: {
        uuid: {
          ...R.omit(['currentRevisionId', 'licenseId', 'parentId'], solution),
          currentRevision: {
            id: solution.currentRevisionId,
          },
          license: {
            id: solution.licenseId,
          },
        },
      },
    })
  })

  test('by alias (w/ currentRevision)', async () => {
    await addSolutionInteraction(solution)
    await addAliasInteraction(solutionAlias)
    await addSolutionRevisionInteraction(solutionRevision)
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "${solutionAlias.path}"
              }
            ) {
              __typename
              ... on Solution {
                id
                trashed
                instance
                alias
                date
                currentRevision {
                  id
                  content
                  changes
                }
              }
            }
          }
        `,
      data: {
        uuid: {
          ...R.omit(['currentRevisionId', 'licenseId', 'parentId'], solution),
          currentRevision: {
            id: solutionRevision.id,
            content: solutionRevision.content,
            changes: solutionRevision.changes,
          },
        },
      },
    })
  })

  test('by alias (w/ exercise)', async () => {
    await addSolutionInteraction(solution)
    await addAliasInteraction(solutionAlias)
    await addUuidInteraction<ExerciseRevisionPayload>({
      __typename: exerciseRevision.__typename,
      id: exerciseRevision.id,
      trashed: Matchers.boolean(exerciseRevision.trashed),
      date: Matchers.iso8601DateTime(exerciseRevision.date),
      authorId: Matchers.integer(exerciseRevision.authorId),
      repositoryId: Matchers.integer(exerciseRevision.repositoryId),
      content: Matchers.string(exerciseRevision.content),
      changes: Matchers.string(exerciseRevision.changes),
    })
    await addUuidInteraction<ExercisePayload>({
      __typename: exercise.__typename,
      id: exercise.id,
      trashed: Matchers.boolean(exercise.trashed),
      instance: Matchers.string(exercise.instance),
      alias: exercise.alias ? Matchers.string(exercise.alias) : null,
      date: Matchers.iso8601DateTime(exercise.date),
      currentRevisionId: exercise.currentRevisionId
        ? Matchers.integer(exercise.currentRevisionId)
        : null,
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
          {
            uuid(
              alias: {
                instance: de
                path: "${solutionAlias.path}"
              }
            ) {
              __typename
              ... on Solution {
                id
                trashed
                instance
                alias
                date
                exercise {
                  id
                  currentRevision {
                    id
                    content
                    changes
                  }
                }
              }
            }
          }
        `,
      data: {
        uuid: {
          ...R.omit(['currentRevisionId', 'licenseId', 'parentId'], solution),
          exercise: {
            id: exercise.id,
            currentRevision: {
              id: exerciseRevision.id,
              content: exerciseRevision.content,
              changes: exerciseRevision.changes,
            },
          },
        },
      },
    })
  })

  test('by id', async () => {
    await addSolutionInteraction(solution)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${solution.id}) {
            __typename
            ... on Solution {
              id
              trashed
              alias
              instance
              date
              currentRevision {
                id
              }
              license {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          ...R.omit(['currentRevisionId', 'licenseId', 'parentId'], solution),
          currentRevision: {
            id: solutionRevision.id,
          },
          license: {
            id: license.id,
          },
        },
      },
    })
  })
})

describe('SolutionRevision', () => {
  test('by id', async () => {
    await addSolutionRevisionInteraction(solutionRevision)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${solutionRevision.id}) {
            __typename
            ... on SolutionRevision {
              id
              trashed
              date
              content
              changes
              author {
                id
              }
              solution {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          ...R.omit(['authorId', 'repositoryId'], solutionRevision),
          author: {
            id: solutionRevision.authorId,
          },
          solution: {
            id: solutionRevision.repositoryId,
          },
        },
      },
    })
  })

  test('by id (w/ solution)', async () => {
    await addSolutionRevisionInteraction(solutionRevision)
    await addSolutionInteraction(solution)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${solutionRevision.id}) {
            __typename
            ... on SolutionRevision {
              id
              trashed
              date
              content
              changes
              author {
                id
              }
              solution {
                id
                currentRevision {
                  id
                }
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          ...R.omit(['authorId', 'repositoryId'], solutionRevision),
          author: {
            id: solutionRevision.authorId,
          },
          solution: {
            id: solution.id,
            currentRevision: {
              id: solution.currentRevisionId,
            },
          },
        },
      },
    })
  })
})
