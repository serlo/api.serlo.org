import { gql } from 'apollo-server'
import R from 'ramda'

import {
  exerciseGroup,
  exerciseGroupRevision,
  groupedExercise,
} from '../../../__fixtures__'
import { getTypenameAndId, Client, given } from '../../__utils__'

describe('ExerciseGroup', () => {
  beforeEach(() => {
    given('UuidQuery').for(exerciseGroup)
  })

  test('by id', async () => {
    await new Client()
      .prepareQuery({
        query: gql`
          query exerciseGroup($id: Int!) {
            uuid(id: $id) {
              __typename
              ... on ExerciseGroup {
                id
                trashed
                instance
                date
              }
            }
          }
        `,
      })
      .withVariables({ id: exerciseGroup.id })
      .shouldReturnData({
        uuid: R.pick(
          ['__typename', 'id', 'trashed', 'instance', 'date'],
          exerciseGroup,
        ),
      })
  })

  test('by id (w/ exercises)', async () => {
    given('UuidQuery').for(groupedExercise)

    await new Client()
      .prepareQuery({
        query: gql`
          query exerciseGroup($id: Int!) {
            uuid(id: $id) {
              ... on ExerciseGroup {
                exercises {
                  __typename
                  id
                }
              }
            }
          }
        `,
      })
      .withVariables({ id: exerciseGroup.id })
      .shouldReturnData({
        uuid: { exercises: [getTypenameAndId(groupedExercise)] },
      })
  })

  test('ExerciseGroupRevision', async () => {
    given('UuidQuery').for(exerciseGroupRevision)

    await new Client()
      .prepareQuery({
        query: gql`
          query exerciseGroupRevision($id: Int!) {
            uuid(id: $id) {
              __typename
              ... on ExerciseGroupRevision {
                id
                trashed
                date
                cohesive
                content
                changes
              }
            }
          }
        `,
      })
      .withVariables({ id: exerciseGroupRevision.id })
      .shouldReturnData({
        uuid: R.pick(
          [
            '__typename',
            'id',
            'trashed',
            'date',
            'cohesive',
            'content',
            'changes',
          ],
          exerciseGroupRevision,
        ),
      })
  })
})
