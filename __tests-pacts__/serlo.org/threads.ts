import { Matchers } from '@pact-foundation/pact'
import fetch from 'node-fetch'

import { ThreadsPayload } from '../../src/graphql/schema/threads'
import { addJsonInteraction } from '../__utils__'

test('Threads', async () => {
  // This is a noop test that just adds the interaction to the contract
  const threads: ThreadsPayload = {
    threadIds: [10, 20, 30],
    objectId: 134,
  }
  await addJsonInteraction({
    name: `fetch data of thread ${threads.objectId}`,
    given: `threads ${threads.objectId} is of type thread`,
    path: `/api/uuid/${threads.objectId}`,
    body: {
      threadIds: Matchers.eachLike(Matchers.integer(1)),
      objectId: threads.objectId,
    },
  })
  await fetch(`http://de.${process.env.SERLO_ORG_HOST}/api/threads/:id`)
})
