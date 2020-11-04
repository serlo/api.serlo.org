import { Matchers } from '@pact-foundation/pact'
import fetch from 'node-fetch'

import { article } from '../../__fixtures__/uuid'
import { addJsonInteraction } from '../__utils__'

test('Threads', async () => {
  // This is a noop test that just adds the interaction to the contract
  await addJsonInteraction({
    name: `fetch first comment ids of all threads for an article}`,
    given: `article ${article.id} has threads`,
    path: `/api/threads/${article.id}`,
    body: {
      threadIds: Matchers.eachLike(Matchers.integer(1)),
    },
  })
  await fetch(
    `http://de.${process.env.SERLO_ORG_HOST}/api/threads/${article.id}`
  )
})
