import { gql } from 'apollo-server'
import * as R from 'ramda'

import { license } from '../../__fixtures__/license'
import {
  exercise,
  exerciseAlias,
  exerciseRevision,
  solution,
  solutionRevision,
  taxonomyTermSubject,
  user,
} from '../../__fixtures__/uuid'
import { assertSuccessfulGraphQLQuery } from '../__utils__/assertions'
import {
  addAliasInteraction,
  addExerciseInteraction,
  addExerciseRevisionInteraction,
  addLicenseInteraction,
  addSolutionInteraction,
  addSolutionRevisionInteraction,
  addTaxonomyTermInteraction,
  addUserInteraction,
} from '../__utils__/interactions'

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
          __typename: 'Exercise',
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
          __typename: 'Exercise',
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
          __typename: 'Exercise',
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
          __typename: 'Exercise',
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
          __typename: 'Exercise',
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
          __typename: 'Exercise',
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
          __typename: 'ExerciseRevision',
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
          __typename: 'ExerciseRevision',
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
          __typename: 'ExerciseRevision',
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
