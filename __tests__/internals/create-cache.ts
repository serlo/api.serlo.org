import { spawnSync } from 'child_process'
import gql from 'graphql-tag'

import { Client } from '../__utils__'
import { createCache } from '~/cache'

describe('Cache', () => {
  afterEach(() => {
    // We need to recreate the cache since the connection was closed
    // and it leads to an error in the global after hook when quit()
    global.cache = createCache({ timer: global.timer })
  })

  const query = new Client().prepareQuery({
    query: gql`
      query {
        uuid(id: 1) {
          __typename
        }
      }
    `,
  })

  test('does not crash even though redis is down', async () => {
    await query.shouldReturnData({ uuid: { __typename: 'User' } })
    expect(global.sentryEvents.length).toBe(0)

    spawnSync('docker', ['compose', 'down', 'redis'])

    await query.shouldReturnData({ uuid: { __typename: 'User' } })
    expect(global.sentryEvents.length).not.toBe(0)

    spawnSync('docker', ['compose', 'up', 'redis', '-d'])

    await query.shouldReturnData({ uuid: { __typename: 'User' } })
  }, 10_000)
})
