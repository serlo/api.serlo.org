import { option } from 'fp-ts'
import gql from 'graphql-tag'

import { user } from '../../__fixtures__'
import { Client } from '../__utils__'
import { Service } from '~/internals/authentication'

beforeEach(() => {
  process.env.ENVIRONMENT = 'staging'
})

describe('remove', () => {
  const key = 'de.serlo.org/api/uuid/1'
  const mutation = new Client({ service: Service.Serlo })
    .prepareQuery({
      query: gql`
        mutation ($input: CacheRemoveInput!) {
          _cache {
            remove(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withInput({ keys: [key] })

  beforeEach(async () => {
    await global.cache.set({ key, source: '', value: user })
  })

  test('removes a cache value (authenticated as Kulla)', async () => {
    await mutation
      .withContext({ service: Service.SerloCloudflareWorker, userId: 26217 })
      .shouldReturnData({ _cache: { remove: { success: true } } })

    const cachedValue = await global.cache.get({ key })
    expect(option.isNone(cachedValue)).toBe(true)
  })

  test('is forbidden when user is not logged in', async () => {
    await mutation
      .withContext({ service: Service.SerloCloudflareWorker, userId: null })
      .shouldFailWithError('FORBIDDEN')
  })

  test('is forbidden when user is not developer', async () => {
    await mutation
      .withContext({ service: Service.SerloCloudflareWorker, userId: user.id })
      .shouldFailWithError('FORBIDDEN')
  })
})
