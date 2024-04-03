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

  test('create an exercise submission input', async () => {
    await mutation.shouldReturnData({
      experiment: { createExerciseSubmission: { success: true } },
    })
  })
})
