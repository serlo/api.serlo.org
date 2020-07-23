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
  exerciseGroup,
  exerciseGroupAlias,
  exerciseGroupRevision,
  groupedExercise,
  groupedExerciseRevision,
  license,
  taxonomyTermSubject,
  user,
} from '../../../__fixtures__'
import { assertSuccessfulGraphQLQuery } from '../../__utils__/assertions'
import {
  addAliasInteraction,
  addExerciseGroupInteraction,
  addExerciseGroupRevisionInteraction,
  addGroupedExerciseInteraction,
  addGroupedExerciseRevisionInteraction,
  addLicenseInteraction,
  addTaxonomyTermInteraction,
  addUserInteraction,
} from '../../__utils__/interactions'

describe('ExerciseGroup', () => {
  test('by alias', async () => {
    await addExerciseGroupInteraction(exerciseGroup)
    await addAliasInteraction(exerciseGroupAlias)
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "${exerciseGroupAlias.path}"
              }
            ) {
              __typename
              ... on ExerciseGroup {
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
            [
              'currentRevisionId',
              'licenseId',
              'taxonomyTermIds',
              'exerciseIds',
            ],
            exerciseGroup
          ),
          currentRevision: {
            id: exerciseGroup.currentRevisionId,
          },
          license: {
            id: 1,
          },
        },
      },
    })
  })

  test('by alias (w/ license)', async () => {
    await addExerciseGroupInteraction(exerciseGroup)
    await addAliasInteraction(exerciseGroupAlias)
    await addLicenseInteraction(license)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(
            alias: {
              instance: de
              path: "${exerciseGroupAlias.path}"
            }
          ) {
            __typename
            ... on ExerciseGroup {
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
            [
              'currentRevisionId',
              'licenseId',
              'taxonomyTermIds',
              'exerciseIds',
            ],
            exerciseGroup
          ),
          currentRevision: {
            id: exerciseGroup.currentRevisionId,
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
    await addExerciseGroupInteraction(exerciseGroup)
    await addAliasInteraction(exerciseGroupAlias)
    await addExerciseGroupRevisionInteraction(exerciseGroupRevision)
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "${exerciseGroupAlias.path}"
              }
            ) {
              __typename
              ... on ExerciseGroup {
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
            [
              'currentRevisionId',
              'licenseId',
              'taxonomyTermIds',
              'exerciseIds',
            ],
            exerciseGroup
          ),
          currentRevision: {
            id: exerciseGroup.currentRevisionId,
            content: 'content',
            changes: 'changes',
          },
        },
      },
    })
  })

  test('by alias (w/ taxonomyTerms)', async () => {
    await addExerciseGroupInteraction(exerciseGroup)
    await addAliasInteraction(exerciseGroupAlias)
    await addTaxonomyTermInteraction(taxonomyTermSubject)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(
            alias: {
              instance: de
              path: "${exerciseGroupAlias.path}"
            }
          ) {
            __typename
            ... on ExerciseGroup {
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
            [
              'currentRevisionId',
              'licenseId',
              'taxonomyTermIds',
              'exerciseIds',
            ],
            exerciseGroup
          ),
          taxonomyTerms: [{ id: 5 }],
        },
      },
    })
  })

  test('by alias (w/ exercises)', async () => {
    await addExerciseGroupInteraction(exerciseGroup)
    await addAliasInteraction(exerciseGroupAlias)
    await addGroupedExerciseRevisionInteraction(groupedExerciseRevision)
    await addGroupedExerciseInteraction(groupedExercise)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(
            alias: {
              instance: de
              path: "${exerciseGroupAlias.path}"
            }
          ) {
            __typename
            ... on ExerciseGroup {
              id
              trashed
              instance
              alias
              date
              exercises {
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
            [
              'currentRevisionId',
              'licenseId',
              'taxonomyTermIds',
              'exerciseIds',
            ],
            exerciseGroup
          ),
          exercises: [
            {
              id: groupedExercise.id,
              currentRevision: {
                id: groupedExerciseRevision.id,
                content: groupedExerciseRevision.content,
                changes: groupedExerciseRevision.changes,
              },
            },
          ],
        },
      },
    })
  })

  test('by id', async () => {
    await addExerciseGroupInteraction(exerciseGroup)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${exerciseGroup.id}) {
            __typename
            ... on ExerciseGroup {
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
            [
              'currentRevisionId',
              'licenseId',
              'taxonomyTermIds',
              'exerciseIds',
            ],
            exerciseGroup
          ),
          currentRevision: {
            id: exerciseGroup.currentRevisionId,
          },
          license: {
            id: 1,
          },
        },
      },
    })
  })
})

describe('ExerciseGroupRevision', () => {
  test('by id', async () => {
    await addExerciseGroupRevisionInteraction(exerciseGroupRevision)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${exerciseGroup.currentRevisionId}) {
            __typename
            ... on ExerciseGroupRevision {
              id
              trashed
              date
              content
              changes
              author {
                id
              }
              exerciseGroup {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          ...R.omit(['authorId', 'repositoryId'], exerciseGroupRevision),
          author: {
            id: 1,
          },
          exerciseGroup: {
            id: exerciseGroup.id,
          },
        },
      },
    })
  })

  test('by id (w/ author)', async () => {
    await addExerciseGroupRevisionInteraction(exerciseGroupRevision)
    await addUserInteraction(user)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${exerciseGroup.currentRevisionId}) {
            __typename
            ... on ExerciseGroupRevision {
              id
              trashed
              date
              content
              changes
              author {
                id
                username
              }
              exerciseGroup {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          ...R.omit(['authorId', 'repositoryId'], exerciseGroupRevision),
          author: {
            id: 1,
            username: user.username,
          },
          exerciseGroup: {
            id: exerciseGroup.id,
          },
        },
      },
    })
  })

  test('by id (w/ exerciseGroup)', async () => {
    await addExerciseGroupRevisionInteraction(exerciseGroupRevision)
    await addExerciseGroupInteraction(exerciseGroup)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${exerciseGroup.currentRevisionId}) {
            __typename
            ... on ExerciseGroupRevision {
              id
              trashed
              date
              content
              changes
              author {
                id
              }
              exerciseGroup {
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
          ...R.omit(['authorId', 'repositoryId'], exerciseGroupRevision),
          author: {
            id: 1,
          },
          exerciseGroup: {
            id: exerciseGroup.id,
            currentRevision: {
              id: exerciseGroup.currentRevisionId,
            },
          },
        },
      },
    })
  })
})
