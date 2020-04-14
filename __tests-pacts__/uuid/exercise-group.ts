import { gql } from 'apollo-server'
import * as R from 'ramda'

import { license } from '../../__fixtures__/license'
import {
  exerciseGroup,
  exerciseGroupAlias,
  exerciseGroupRevision,
  groupedExercise,
  groupedExerciseRevision,
  taxonomyTermSubject,
  user,
} from '../../__fixtures__/uuid'
import { assertSuccessfulGraphQLQuery } from '../__utils__/assertions'
import {
  addAliasInteraction,
  addExerciseGroupInteraction,
  addExerciseGroupRevisionInteraction,
  addGroupedExerciseInteraction,
  addGroupedExerciseRevisionInteraction,
  addLicenseInteraction,
  addTaxonomyTermInteraction,
  addUserInteraction,
} from '../__utils__/interactions'

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
          __typename: 'ExerciseGroup',
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
          __typename: 'ExerciseGroup',
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
          __typename: 'ExerciseGroup',
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
          __typename: 'ExerciseGroup',
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
          __typename: 'ExerciseGroup',
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
          __typename: 'ExerciseGroup',
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
          __typename: 'ExerciseGroupRevision',
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
          __typename: 'ExerciseGroupRevision',
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
          __typename: 'ExerciseGroupRevision',
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
