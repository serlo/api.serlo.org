import { gql } from 'apollo-server'
import R from 'ramda'

import {
  groupedExercise,
  groupedExerciseRevision,
  exerciseGroup,
} from '../../../__fixtures__'
import { getTypenameAndId, given, Client } from '../../__utils__'

describe('GroupedExercise', () => {
  beforeEach(() => {
    given('UuidQuery').for(groupedExercise)
  })

  test('by id', async () => {
    given('UuidQuery').for(groupedExercise)

    await new Client()
      .prepareQuery({
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
      })
      .withVariables(groupedExercise)
      .shouldReturnData({
        uuid: R.pick(
          ['__typename', 'id', 'trashed', 'instance', 'date'],
          groupedExercise
        ),
      })
  })

  test('by id (w/ exerciseGroup)', async () => {
    given('UuidQuery').for(exerciseGroup)

    await new Client()
      .prepareQuery({
        query: gql`
          query groupedExercise($id: Int!) {
            uuid(id: $id) {
              ... on GroupedExercise {
                exerciseGroup {
                  __typename
                  id
                }
              }
            }
          }
        `,
      })
      .withVariables(groupedExercise)
      .shouldReturnData({
        uuid: { exerciseGroup: getTypenameAndId(exerciseGroup) },
      })
  })
})

test('GroupedExerciseRevision', async () => {
  given('UuidQuery').for(groupedExerciseRevision)

  await new Client()
    .prepareQuery({
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
    })
    .withVariables(groupedExerciseRevision)
    .shouldReturnData({
      uuid: R.pick(
        ['__typename', 'id', 'trashed', 'date', 'content', 'changes'],
        groupedExerciseRevision
      ),
    })
})
