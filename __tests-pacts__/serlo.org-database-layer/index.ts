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
import { Matchers } from '@pact-foundation/pact'

import { serloRequest } from '~/model'
import { license } from '../../__fixtures__'

/* eslint-disable import/no-unassigned-import */
describe('AliasMessage', () => {
  require('./alias')
})
describe('EventMessage', () => {
  require('./event')
})
describe('LicenseMessage', () => {
  require('./license')
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

test('create pact for database-layer', async () => {
  for (const [message, messageSpec] of Object.entries(pactSpec)) {
    const { payload, response } = messageSpec.example
    const body = { type: message, payload }

    await global.pact.addInteraction({
      uponReceiving: `Message ${JSON.stringify(body)}`,
      state: undefined,
      withRequest: {
        method: 'POST',
        path: '/',
        body,
        headers: { 'Content-Type': 'application/json' },
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: Matchers.like(response),
      },
    })

    //@ts-ignore
    expect(await serloRequest({ message, payload })).toEqual(response)
  }
})

const pactSpec = {
  LicenseQuery: {
    example: { payload: { id: 1 }, response: license },
  },
} as const
