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
  exerciseRevision,
  license,
  solution,
  solutionAlias,
  solutionRevision,
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
  addUserInteraction,
} from '../../__utils__/interactions'

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

  test('by alias (w/ license)', async () => {
    await addSolutionInteraction(solution)
    await addAliasInteraction(solutionAlias)
    await addLicenseInteraction(license)
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
                title
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
            id: license.id,
            title: license.title,
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
    await addExerciseRevisionInteraction(exerciseRevision)
    await addExerciseInteraction(exercise)
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

  test('by id (w/ author)', async () => {
    await addSolutionRevisionInteraction(solutionRevision)
    await addUserInteraction(user)
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
                username
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
            id: user.id,
            username: user.username,
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
