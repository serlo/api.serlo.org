import gql from 'graphql-tag'

import { user } from '../../../__fixtures__'
import { Client, threadsQuery } from '../../__utils__'

const input = { id: 'dDMxNzEw', archived: true }
const mutation = new Client({ userId: user.id }).prepareQuery({
  query: gql`
    mutation setThreadArchived($input: ThreadSetThreadArchivedInput!) {
      thread {
        setThreadArchived(input: $input) {
          success
        }
      }
    }
  `,
  variables: { input },
})

test('should change archived status', async () => {
  await threadsQuery.withVariables({ id: 31702 }).shouldReturnData({
    uuid: { threads: { nodes: [{ archived: !input.archived, id: input.id }] } },
  })

  await mutation.shouldReturnData({
    thread: { setThreadArchived: { success: true } },
  })

  await threadsQuery.withVariables({ id: 31702 }).shouldReturnData({
    uuid: { threads: { nodes: [{ archived: input.archived, id: input.id }] } },
  })
})

test('unauthenticated user gets error', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})
