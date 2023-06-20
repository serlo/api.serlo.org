import { gql } from 'apollo-server'

import { Client } from '../__utils__'

test('endpoint "version" returns version of API', async () => {
  const versionQuery = new Client().prepareQuery({
    query: gql`
      query {
        version
      }
    `,
  })

  await versionQuery.shouldReturnData({
    version: expect.not.stringContaining('0.0.0') as unknown,
  })

  await versionQuery.shouldReturnData({
    version: expect.stringMatching(/^\d+\.\d+\.\d+/) as unknown,
  })
})
