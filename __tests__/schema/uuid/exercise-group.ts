import gql from 'graphql-tag'
import * as R from 'ramda'

import { exerciseGroup, exerciseGroupRevision } from '../../../__fixtures__'
import { Client, given } from '../../__utils__'

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
          ['__typename', 'id', 'trashed', 'date', 'content', 'changes'],
          exerciseGroupRevision,
        ),
      })
  })
})
