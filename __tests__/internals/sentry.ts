import gql from 'graphql-tag'

import { assertErrorEvent, Client, given } from '../__utils__'
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
