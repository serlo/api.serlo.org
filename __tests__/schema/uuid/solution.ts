import { gql } from 'apollo-server'
import R from 'ramda'

import { solution, solutionRevision, exercise } from '../../../__fixtures__'
import { getTypenameAndId, given, Client } from '../../__utils__'

describe('Solution', () => {
  beforeEach(() => {
    given('UuidQuery').for(solution)
  })

  test('by id', async () => {
    await new Client()
      .prepareQuery({
        query: gql`
          query solution($id: Int!) {
            uuid(id: $id) {
              __typename
              ... on Solution {
                id
                trashed
                instance
                date
              }
            }
          }
        `,
      })
      .withVariables(solution)
      .shouldReturnData({
        uuid: R.pick(
          ['__typename', 'id', 'trashed', 'instance', 'date'],
          solution,
        ),
      })
  })

  test('by id (w/ exercise)', async () => {
    given('UuidQuery').for(exercise)

    await new Client()
      .prepareQuery({
        query: gql`
          query solution($id: Int!) {
            uuid(id: $id) {
              ... on Solution {
                exercise {
                  __typename
                  id
                }
              }
            }
          }
        `,
      })
      .withVariables(solution)
      .shouldReturnData({
        uuid: {
          exercise: getTypenameAndId(exercise),
        },
      })
  })
})

test('SolutionRevision', async () => {
  given('UuidQuery').for(solutionRevision)

  await new Client()
    .prepareQuery({
      query: gql`
        query solutionRevision($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on SolutionRevision {
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
    .withVariables(solutionRevision)
    .shouldReturnData({
      uuid: R.pick(
        ['__typename', 'id', 'trashed', 'date', 'content', 'changes'],
        solutionRevision,
      ),
    })
})
