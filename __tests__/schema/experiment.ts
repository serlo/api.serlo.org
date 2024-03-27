import gql from 'graphql-tag'

import { Client } from '../__utils__'

describe('experiment', () => {
  const mutation = new Client().prepareQuery({
    query: gql`
      mutation {
        experiment {
          createExerciseSubmission(
            input: {
              path: "path"
              sessionId: "sessionId"
              entityId: 123
              revisionId: 99
              result: "spoiler"
              type: "test"
            }
          ) {
            success
          }
        }
      }
    `,
  })

  const abTestingQuery = new Client().prepareQuery({
    query: gql`
      query {
        experiment {
          abSubmissions(experiment: "test", limit: 10, cursor: "0") {
            id
            experiment
            sessionId
            result
            type
            timestamp
          }
        }
      }
    `,
  })

  test('create an exercise submission input', async () => {
    await mutation.shouldReturnData({
      experiment: { createExerciseSubmission: { success: true } },
    })
  })

  test('fetches ab testing data', async () => {
    await abTestingQuery.shouldReturnData({
      experiment: { abSubmissions: [] },
    })
  })
})
