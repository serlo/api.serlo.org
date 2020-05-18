import { Matchers } from '@pact-foundation/pact'

import { UuidPayload, UuidType } from '../../src/graphql/schema/uuid'

export function addUuidInteraction(payload: UuidPayload & { type: UuidType }) {
  return addJsonInteraction({
    name: `fetch uuid ${payload.id}`,
    given: '',
    path: `/uuid/${payload.id}`,
    body: {
      id: payload.id,
      type: Matchers.string(payload.type),
    },
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
  return global.uuidPact.addInteraction({
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
