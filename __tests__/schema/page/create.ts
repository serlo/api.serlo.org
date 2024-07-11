import gql from 'graphql-tag'

import { Client } from '../../__utils__'
import { Instance } from '~/types'

const input = {
  content: 'content',
  discussionsEnabled: false,
  instance: Instance.De,
  licenseId: 1,
  title: 'title',
  forumId: 123,
}

const mutation = new Client().prepareQuery({
  query: gql`
    mutation set($input: CreatePageInput!) {
      page {
        create(input: $input) {
          success
        }
      }
    }
  `,
  variables: { input },
})

test('returns success and record  when mutation is successfully executed', async () => {
  const newMutation = await mutation.forUser('de_static_pages_builder')
  await newMutation.shouldReturnData({ page: { create: { success: true } } })
})
