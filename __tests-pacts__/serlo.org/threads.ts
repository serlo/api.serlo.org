import { Matchers } from '@pact-foundation/pact'
import fetch from 'node-fetch'

import { article } from '../../__fixtures__/uuid'
import { ThreadsPayload } from '../../src/graphql/schema/threads'
import { addJsonInteraction } from '../__utils__'

test('Threads', async () => {
  // This is a noop test that just adds the interaction to the contract
  const threads: ThreadsPayload = {
    threadIds: [10, 20, 30],
  }
  await addJsonInteraction({
    name: `fetch data of thread ${threads.threadIds[0]}`,
    given: `threads ${threads.threadIds[0]} is of type thread`,
    path: `/api/uuid/${threads.threadIds[0]}`,
    body: {
      threadIds: Matchers.eachLike(Matchers.integer(1)),
    },
  })
  await fetch(
    `http://de.${process.env.SERLO_ORG_HOST}/api/threads/${article.id}`
  )
})
