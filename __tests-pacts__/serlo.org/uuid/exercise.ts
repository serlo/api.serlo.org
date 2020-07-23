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
import { gql } from 'apollo-server'
import * as R from 'ramda'

import {
  exercise,
  exerciseAlias,
  exerciseRevision,
  license,
  solution,
  solutionRevision,
  taxonomyTermSubject,
  user,
} from '../../../__fixtures__'
import { assertSuccessfulGraphQLQuery } from '../../__utils__/assertions'
import {
  addAliasInteraction,
  addExerciseInteraction,
  addExerciseRevisionInteraction,
  addLicenseInteraction,
  addSolutionInteraction,
  addSolutionRevisionInteraction,
  addTaxonomyTermInteraction,
  addUserInteraction,
} from '../../__utils__/interactions'

describe('Exercise', () => {
  test('by alias', async () => {
    await addExerciseInteraction(exercise)
    await addAliasInteraction(exerciseAlias)
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "${exerciseAlias.path}"
              }
            ) {
              __typename
              ... on Exercise {
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
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds', 'solutionId'],
            exercise
          ),
          currentRevision: {
            id: exercise.currentRevisionId,
          },
          license: {
            id: 1,
          },
        },
      },
    })
  })

  test('by alias (w/ license)', async () => {
    await addExerciseInteraction(exercise)
    await addAliasInteraction(exerciseAlias)
    await addLicenseInteraction(license)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(
            alias: {
              instance: de
              path: "${exerciseAlias.path}"
            }
          ) {
            __typename
            ... on Exercise {
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
                title
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds', 'solutionId'],
            exercise
          ),
          currentRevision: {
            id: exercise.currentRevisionId,
          },
          license: {
            id: 1,
            title: 'title',
          },
        },
      },
    })
  })

  test('by alias (w/ currentRevision)', async () => {
    await addExerciseInteraction(exercise)
    await addAliasInteraction(exerciseAlias)
    await addExerciseRevisionInteraction(exerciseRevision)
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "${exerciseAlias.path}"
              }
            ) {
              __typename
              ... on Exercise {
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
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds', 'solutionId'],
            exercise
          ),
          currentRevision: {
            id: exercise.currentRevisionId,
            content: 'content',
            changes: 'changes',
          },
        },
      },
    })
  })

  test('by alias (w/ taxonomyTerms)', async () => {
    await addExerciseInteraction(exercise)
    await addAliasInteraction(exerciseAlias)
    await addTaxonomyTermInteraction(taxonomyTermSubject)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(
            alias: {
              instance: de
              path: "${exerciseAlias.path}"
            }
          ) {
            __typename
            ... on Exercise {
              id
              trashed
              instance
              alias
              date
              taxonomyTerms {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds', 'solutionId'],
            exercise
          ),
          taxonomyTerms: [{ id: 5 }],
        },
      },
    })
  })

  test('by alias (w/ solution)', async () => {
    await addExerciseInteraction(exercise)
    await addAliasInteraction(exerciseAlias)
    await addSolutionRevisionInteraction(solutionRevision)
    await addSolutionInteraction(solution)
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "${exerciseAlias.path}"
              }
            ) {
              __typename
              ... on Exercise {
                id
                trashed
                instance
                alias
                date
                solution {
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
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds', 'solutionId'],
            exercise
          ),
          solution: {
            id: solution.id,
            currentRevision: {
              id: solutionRevision.id,
              content: 'content',
              changes: 'changes',
            },
          },
        },
      },
    })
  })

  test('by id', async () => {
    await addExerciseInteraction(exercise)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${exercise.id}) {
            __typename
            ... on Exercise {
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
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds', 'solutionId'],
            exercise
          ),
          currentRevision: {
            id: exercise.currentRevisionId,
          },
          license: {
            id: 1,
          },
        },
      },
    })
  })
})

describe('ExerciseRevision', () => {
  test('by id', async () => {
    await addExerciseRevisionInteraction(exerciseRevision)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${exercise.currentRevisionId}) {
            __typename
            ... on ExerciseRevision {
              id
              trashed
              date
              content
              changes
              author {
                id
              }
              exercise {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          ...R.omit(['authorId', 'repositoryId'], exerciseRevision),
          author: {
            id: 1,
          },
          exercise: {
            id: exercise.id,
          },
        },
      },
    })
  })

  test('by id (w/ author)', async () => {
    await addExerciseRevisionInteraction(exerciseRevision)
    await addUserInteraction(user)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${exercise.currentRevisionId}) {
            __typename
            ... on ExerciseRevision {
              id
              trashed
              date
              content
              changes
              author {
                id
                username
              }
              exercise {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          ...R.omit(['authorId', 'repositoryId'], exerciseRevision),
          author: {
            id: 1,
            username: user.username,
          },
          exercise: {
            id: exercise.id,
          },
        },
      },
    })
  })

  test('by id (w/ exercise)', async () => {
    await addExerciseRevisionInteraction(exerciseRevision)
    await addExerciseInteraction(exercise)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${exercise.currentRevisionId}) {
            __typename
            ... on ExerciseRevision {
              id
              trashed
              date
              content
              changes
              author {
                id
              }
              exercise {
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
          ...R.omit(['authorId', 'repositoryId'], exerciseRevision),
          author: {
            id: 1,
          },
          exercise: {
            id: exercise.id,
            currentRevision: {
              id: exercise.currentRevisionId,
            },
          },
        },
      },
    })
  })
})
