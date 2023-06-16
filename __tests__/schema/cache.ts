import { gql } from 'apollo-server'
import { option } from 'fp-ts'

import { user } from '../../__fixtures__'
import { assertErrorEvent, Client } from '../__utils__'
import { Service } from '~/internals/authentication'

beforeEach(() => {
  process.env.ENVIRONMENT = 'staging'
})

describe('set', () => {
  const key = 'de.serlo.org/api/uuid/1'
  const mutation = new Client({ service: Service.Serlo })
    .prepareQuery({
      query: gql`
        mutation ($input: CacheSetInput!) {
          _cache {
            set(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withInput({ key, value: user })

  test('sets a certain cache value', async () => {
    const now = global.timer.now()

    await mutation.shouldReturnData({ _cache: { set: { success: true } } })

    const cachedValue = await global.cache.get({ key })
    expect(option.isSome(cachedValue) && cachedValue.value).toEqual({
      lastModified: now,
      value: user,
      source: 'Legacy serlo.org listener',
    })
  })

  test('is forbidden when service is not legacy serlo.org', async () => {
    await mutation
      .withContext({ service: Service.SerloCloudflareWorker })
      .shouldFailWithError('FORBIDDEN')
  })

  test('reports an error when value was invalid', async () => {
    const invalidValue = { value: 'Some invalid value' }

    await mutation
      .withInput({ key, value: invalidValue })
      .shouldFailWithError('INTERNAL_SERVER_ERROR')

    await assertErrorEvent({
      message: 'Invalid value received from listener.',
      fingerprint: ['invalid-value', 'listener', key],
      errorContext: { key, invalidValueFromListener: invalidValue },
    })
  })
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

  test('removes a cache value (authenticated via Serlo Service)', async () => {
    await mutation.shouldReturnData({ _cache: { remove: { success: true } } })

    const cachedValue = await global.cache.get({ key })
    expect(option.isNone(cachedValue)).toBe(true)
  })

  test('removes a cache value (authenticated as CarolinJaser)', async () => {
    await mutation
      .withContext({ service: Service.SerloCloudflareWorker, userId: 178145 })
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

describe('update', () => {
  const mutation = new Client({ service: Service.SerloCacheWorker })
    .prepareQuery({
      query: gql`
        mutation ($input: CacheUpdateInput!) {
          _cache {
            update(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withInput({ keys: [`de.serlo.org/api/uuid/${user.id}`] })

  test('updates the key when service is cache-worker', async () => {
    await mutation.shouldReturnData({ _cache: { update: { success: true } } })

    // TODO: Test that key is passed on the SWR-Queue
  })

  test('is forbidden when service is not legacy serlo.org', async () => {
    await mutation
      .withContext({ service: Service.SerloCloudflareWorker })
      .shouldFailWithError('FORBIDDEN')
  })
})
