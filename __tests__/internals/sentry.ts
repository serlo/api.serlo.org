import gql from 'graphql-tag'

import { article, articleRevision, user } from '../../__fixtures__'
import { assertErrorEvent, Client, getTypenameAndId, given } from '../__utils__'
import { Model } from '~/internals/graphql'

const invalidValue = { __typename: 'Article', invalid: 'this in invalid' }

test('invalid values from data sources are reported', async () => {
  given('UuidQuery')
    .withPayload({ id: 42 })
    .returns(invalidValue as unknown as Model<'Article'>)

  await new Client()
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            __typename
          }
        }
      `,
    })
    .withVariables({ id: 42 })
    .shouldFailWithError('INTERNAL_SERVER_ERROR')

  await assertErrorEvent({
    message: 'Invalid value received from data source.',
    fingerprint: ['invalid-value', 'data-source', JSON.stringify(invalidValue)],
    errorContext: {
      invalidCurrentValue: invalidValue,
      key: 'de.serlo.org/api/uuid/42',
    },
  })
})

describe('reports invalid cache values', () => {
  test('when cache value has invalid properties', async () => {
    given('UuidQuery').for(user)

    const key = `de.serlo.org/api/uuid/${user.id}`
    global.timer.setCurrentTime(1000)
    await global.cache.set({ key, value: invalidValue, source: 'unit-test' })

    await new Client()
      .prepareQuery({
        query: gql`
          query ($id: Int!) {
            uuid(id: $id) {
              __typename
              id
            }
          }
        `,
      })
      .withVariables({ id: user.id })
      .shouldReturnData({ uuid: getTypenameAndId(user) })

    await assertErrorEvent({
      message:
        'Invalid cached value received that could be repaired automatically by data source.',
      errorContext: {
        invalidCacheValue: invalidValue,
        currentValue: user,
        timeInvalidCacheSaved: new Date(1000).toISOString(),
        key,
        source: 'unit-test',
      },
      fingerprint: ['invalid-value', 'cache', key],
    })
  })

  test('when cache value is null but shall not be null', async () => {
    given('UuidQuery').for(article, articleRevision)

    const key = `de.serlo.org/api/uuid/${article.currentRevisionId ?? ''}`
    await global.cache.set({ key, value: null, source: 'unit-test' })

    await new Client()
      .prepareQuery({
        query: gql`
          query ($id: Int!) {
            uuid(id: $id) {
              ... on Article {
                currentRevision {
                  __typename
                  id
                }
              }
            }
          }
        `,
      })
      .withVariables({ id: article.id })
      .shouldReturnData({
        uuid: { currentRevision: getTypenameAndId(articleRevision) },
      })

    await assertErrorEvent({
      message:
        'Invalid cached value received that could be repaired automatically by data source.',
      errorContext: { invalidCacheValue: null },
    })
  })
})
