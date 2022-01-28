/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import R from 'ramda'
import { Matchers } from '@pact-foundation/pact'

import {
  ResponseType,
  Message,
  Payload,
  serloRequest,
  DatabaseLayerSpec,
} from '~/model'
import { license } from '../../__fixtures__'

/* eslint-disable import/no-unassigned-import */
describe('AliasMessage', () => {
  require('./alias')
})
describe('EventMessage', () => {
  require('./event')
})
describe('NavigationMessage', () => {
  require('./navigation')
})
describe('NotificationMessage', () => {
  require('./notification')
})
describe('SubjectMessage', () => {
  require('./subject')
})
describe('SubscriptionMessage', () => {
  require('./subscription')
})
describe('ThreadMessage', () => {
  require('./thread')
})
describe('UserMessage', () => {
  require('./user')
})
describe('UuidMessage', () => {
  require('./uuid')
})

const pactSpec: PactSpec = {
  LicenseQuery: {
    example: { payload: { id: 1 }, response: license },
    examplePayloadForNull: { id: 100 },
  },
}

describe.each(R.toPairs(pactSpec))('%s', (message, messageSpec) => {
  test('200 response', async () => {
    const { payload, response } = messageSpec.example

    await addSerloMessageInteraction({
      message,
      payload,
      responseStatus: 200,
      response,
    })
  })

  if (messageSpec.examplePayloadForNull != null) {
    test('404 response', async () => {
      await addSerloMessageInteraction({
        message,
        payload: messageSpec.examplePayloadForNull,
        responseStatus: 404,
        response: null,
      })
    })
  }
})

type PactSpec = {
  [K in Message]: {
    example: {
      payload: Payload<K>
      response: ResponseType<K>
    }
  } & (DatabaseLayerSpec[K]['canBeNull'] extends true
    ? { examplePayloadForNull: Payload<K> }
    : unknown)
}

async function addSerloMessageInteraction<M extends Message>({
  message,
  payload,
  responseStatus,
  response,
}: {
  message: M
  payload: Payload<M>
} & (
  | { responseStatus: 200; response: ResponseType<M> }
  | { responseStatus: 404; response: null }
)) {
  await global.pact.addInteraction({
    uponReceiving: `Message ${message} with payload ${JSON.stringify(
      payload
    )} (case ${responseStatus}-response)`,
    state: undefined,
    withRequest: {
      method: 'POST',
      path: '/',
      body: { type: message, payload },
      headers: { 'Content-Type': 'application/json' },
    },
    willRespondWith: {
      status: responseStatus,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body:
        responseStatus === 200 ? Matchers.like(response) : JSON.stringify(null),
    },
  })

  expect(await serloRequest({ message, payload })).toEqual(response)
}
