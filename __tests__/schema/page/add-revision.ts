import gql from 'graphql-tag'

import { page } from '../../../__fixtures__'
import { Client } from '../../__utils__'

const input = {
  content: 'new content',
  title: 'new title',
  pageId: page.id,
}

const mutation = new Client().prepareQuery({
  query: gql`
    mutation set($input: PageAddRevisionInput!) {
      page {
        addRevision(input: $input) {
          success
        }
      }
    }
  `,
  variables: { input },
})

test('returns "{ success: true }" when mutation could be successfully executed', async () => {
  const newMutation = await mutation.forUser('de_static_pages_builder')
  await newMutation.shouldReturnData({
    page: { addRevision: { success: true } },
  })
})
