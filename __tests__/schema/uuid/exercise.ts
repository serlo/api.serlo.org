import { gql } from 'apollo-server'
import R from 'ramda'

import { exercise, exerciseRevision } from '../../../__fixtures__'
import { given, Client } from '../../__utils__'

test('Exercise', async () => {
  given('UuidQuery').for(exercise)

  await new Client()
    .prepareQuery({
      query: gql`
        query exercise($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on Exercise {
              id
              trashed
              instance
              date
            }
          }
        }
      `,
    })
    .withVariables({ id: exercise.id })
    .shouldReturnData({
      uuid: R.pick(
        ['__typename', 'id', 'trashed', 'instance', 'date'],
        exercise
      ),
    })
})

test('ExerciseRevision', async () => {
  given('UuidQuery').for(exerciseRevision)

  await new Client()
    .prepareQuery({
      query: gql`
        query exerciseRevision($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on ExerciseRevision {
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
    .withVariables({ id: exerciseRevision.id })
    .shouldReturnData({
      uuid: R.pick(
        ['__typename', 'id', 'trashed', 'date', 'content', 'changes'],
        exerciseRevision
      ),
    })
})
