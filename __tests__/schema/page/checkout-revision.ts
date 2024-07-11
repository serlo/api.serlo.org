import gql from 'graphql-tag'

import { Client } from '../../__utils__'

const mutation = new Client()
  .prepareQuery({
    query: gql`
      mutation ($input: CheckoutRevisionInput!) {
        page {
          checkoutRevision(input: $input) {
            success
          }
        }
      }
    `,
  })
  .withInput({ revisionId: 35476, reason: 'reason' })

test('returns "{ success: true }" when mutation could be successfully executed', async () => {
  const newMutation = await mutation.forUser('de_static_pages_builder')
  await newMutation.shouldReturnData({
    page: { checkoutRevision: { success: true } },
  })
})
