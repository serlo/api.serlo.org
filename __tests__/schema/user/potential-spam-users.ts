import gql from 'graphql-tag'

import { Client } from '../../__utils__'

const query = new Client()
  .prepareQuery({
    query: gql`
      query ($first: Int, $after: String) {
        user {
          potentialSpamUsers(first: $first, after: $after) {
            nodes {
              id
            }
          }
        }
      }
    `,
  })
  .withVariables({ first: 2, after: null as string | null })

beforeEach(async () => {
  await databaseForTests.mutate(
    "update user set description = 'content' where id in (35390, 35395, 35408)",
  )
})

test('without parameter `after`', async () => {
  await query.shouldReturnData({
    user: { potentialSpamUsers: { nodes: [{ id: 35395 }, { id: 35390 }] } },
  })
})

test('with paramater `after`', async () => {
  await query
    .withVariables({
      first: 2,
      after: Buffer.from('35395').toString('base64'),
    })
    .shouldReturnData({
      user: { potentialSpamUsers: { nodes: [{ id: 35390 }] } },
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
