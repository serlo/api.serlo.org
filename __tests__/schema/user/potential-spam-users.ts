import gql from 'graphql-tag'

import { user, user2 } from '../../../__fixtures__'
import { getTypenameAndId, given, Client } from '../../__utils__'

const query = new Client()
  .prepareQuery({
    query: gql`
      query ($first: Int, $after: String) {
        user {
          potentialSpamUsers(first: $first, after: $after) {
            nodes {
              id
              __typename
            }
          }
        }
      }
    `,
  })
  .withVariables({ first: 100, after: null as string | null })

describe('endpoint user.potentialSpamUsers', () => {
  test('without parameter `after`', async () => {
    const nodes = [getTypenameAndId(user), getTypenameAndId(user2)]
    await query.shouldReturnData({ user: { potentialSpamUsers: { nodes } } })
  })

  test('with paramater `after`', async () => {
    await query
      .withVariables({
        first: 100,
        after: Buffer.from(user.id.toString()).toString('base64'),
      })
      .shouldReturnData({
        user: { potentialSpamUsers: { nodes: [getTypenameAndId(user2)] } },
      })
  })

  test('fails when `first` is bigger then 500', async () => {
    await query
      .withVariables({ first: 501, after: null })
      .shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when `after` is not a valid id', async () => {
    await query
      .withVariables({ first: 100, after: 'foo' })
      .shouldFailWithError('BAD_USER_INPUT')
  })
})
