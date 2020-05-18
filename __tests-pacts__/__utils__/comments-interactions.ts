import { Matchers } from '@pact-foundation/pact'

import { ThreadPayload } from '../../src/graphql/schema/thread/thread'

export function addThreadsInteraction(id: number, payload: ThreadPayload[]) {
  return addJsonInteraction({
    name: `fetch threads of uuid ${id}`,
    given: '',
    path: `/threads/${id}`,
    body:
      payload.length > 0 ? Matchers.eachLike(Matchers.like(payload[0])) : [],
  })
}

function addJsonInteraction({
  name,
  given,
  path,
  body,
}: {
  name: string
  given: string
  path: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any
}) {
  return global.commentsPact.addInteraction({
    uponReceiving: name,
    state: given,
    withRequest: {
      method: 'GET',
      path,
    },
    willRespondWith: {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body,
    },
  })
}
