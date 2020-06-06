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

import { license } from '../../../__fixtures__/license'
import {
  exerciseGroup,
  exerciseGroupRevision,
  groupedExercise,
  groupedExerciseAlias,
  groupedExerciseRevision,
  solution,
  solutionRevision,
  user,
} from '../../../__fixtures__/uuid'
import { assertSuccessfulGraphQLQuery } from '../../__utils__/assertions'
import {
  addAliasInteraction,
  addExerciseGroupInteraction,
  addExerciseGroupRevisionInteraction,
  addGroupedExerciseInteraction,
  addGroupedExerciseRevisionInteraction,
  addLicenseInteraction,
  addSolutionInteraction,
  addSolutionRevisionInteraction,
  addUserInteraction,
} from '../../__utils__/interactions'

describe('GroupedExercise', () => {
  test('by alias', async () => {
    await addGroupedExerciseInteraction(groupedExercise)
    await addAliasInteraction(groupedExerciseAlias)
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "${groupedExerciseAlias.path}"
              }
            ) {
              __typename
              ... on GroupedExercise {
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
          __typename: 'GroupedExercise',
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'solutionId', 'parentId'],
            groupedExercise
          ),
          currentRevision: {
            id: groupedExercise.currentRevisionId,
          },
          license: {
            id: 1,
          },
        },
      },
    })
  })

  test('by alias (w/ license)', async () => {
    await addGroupedExerciseInteraction(groupedExercise)
    await addAliasInteraction(groupedExerciseAlias)
    await addLicenseInteraction(license)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(
            alias: {
              instance: de
              path: "${groupedExerciseAlias.path}"
            }
          ) {
            __typename
            ... on GroupedExercise {
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
          __typename: 'GroupedExercise',
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'solutionId', 'parentId'],
            groupedExercise
          ),
          currentRevision: {
            id: groupedExercise.currentRevisionId,
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
    await addGroupedExerciseInteraction(groupedExercise)
    await addAliasInteraction(groupedExerciseAlias)
    await addGroupedExerciseRevisionInteraction(groupedExerciseRevision)
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "${groupedExerciseAlias.path}"
              }
            ) {
              __typename
              ... on GroupedExercise {
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
          __typename: 'GroupedExercise',
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'solutionId', 'parentId'],
            groupedExercise
          ),
          currentRevision: {
            id: groupedExercise.currentRevisionId,
            content: 'content',
            changes: 'changes',
          },
        },
      },
    })
  })

  test('by alias (w/ solution)', async () => {
    await addGroupedExerciseInteraction(groupedExercise)
    await addAliasInteraction(groupedExerciseAlias)
    await addSolutionRevisionInteraction(solutionRevision)
    await addSolutionInteraction(solution)
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "${groupedExerciseAlias.path}"
              }
            ) {
              __typename
              ... on GroupedExercise {
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
          __typename: 'GroupedExercise',
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'solutionId', 'parentId'],
            groupedExercise
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

  test('by alias (w/ exerciseGroup)', async () => {
    await addGroupedExerciseInteraction(groupedExercise)
    await addAliasInteraction(groupedExerciseAlias)
    await addExerciseGroupRevisionInteraction(exerciseGroupRevision)
    await addExerciseGroupInteraction(exerciseGroup)
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "${groupedExerciseAlias.path}"
              }
            ) {
              __typename
              ... on GroupedExercise {
                id
                trashed
                instance
                alias
                date
                exerciseGroup {
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
          __typename: 'GroupedExercise',
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'solutionId', 'parentId'],
            groupedExercise
          ),
          exerciseGroup: {
            id: exerciseGroup.id,
            currentRevision: {
              id: exerciseGroupRevision.id,
              content: 'content',
              changes: 'changes',
            },
          },
        },
      },
    })
  })

  test('by id', async () => {
    await addGroupedExerciseInteraction(groupedExercise)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${groupedExercise.id}) {
            __typename
            ... on GroupedExercise {
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
          __typename: 'GroupedExercise',
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'solutionId', 'parentId'],
            groupedExercise
          ),
          currentRevision: {
            id: groupedExercise.currentRevisionId,
          },
          license: {
            id: 1,
          },
        },
      },
    })
  })
})

describe('GroupedExerciseRevision', () => {
  test('by id', async () => {
    await addGroupedExerciseRevisionInteraction(groupedExerciseRevision)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${groupedExercise.currentRevisionId}) {
            __typename
            ... on GroupedExerciseRevision {
              id
              trashed
              date
              content
              changes
              author {
                id
              }
              groupedExercise {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'GroupedExerciseRevision',
          ...R.omit(['authorId', 'repositoryId'], groupedExerciseRevision),
          author: {
            id: 1,
          },
          groupedExercise: {
            id: groupedExercise.id,
          },
        },
      },
    })
  })

  test('by id (w/ author)', async () => {
    await addGroupedExerciseRevisionInteraction(groupedExerciseRevision)
    await addUserInteraction(user)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${groupedExercise.currentRevisionId}) {
            __typename
            ... on GroupedExerciseRevision {
              id
              trashed
              date
              content
              changes
              author {
                id
                username
              }
              groupedExercise {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'GroupedExerciseRevision',
          ...R.omit(['authorId', 'repositoryId'], groupedExerciseRevision),
          author: {
            id: 1,
            username: user.username,
          },
          groupedExercise: {
            id: groupedExercise.id,
          },
        },
      },
    })
  })

  test('by id (w/ groupedExercise)', async () => {
    await addGroupedExerciseRevisionInteraction(groupedExerciseRevision)
    await addGroupedExerciseInteraction(groupedExercise)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${groupedExercise.currentRevisionId}) {
            __typename
            ... on GroupedExerciseRevision {
              id
              trashed
              date
              content
              changes
              author {
                id
              }
              groupedExercise {
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
          __typename: 'GroupedExerciseRevision',
          ...R.omit(['authorId', 'repositoryId'], groupedExerciseRevision),
          author: {
            id: 1,
          },
          groupedExercise: {
            id: groupedExercise.id,
            currentRevision: {
              id: groupedExercise.currentRevisionId,
            },
          },
        },
      },
    })
  })
})
