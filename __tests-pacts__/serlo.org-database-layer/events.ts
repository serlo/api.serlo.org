/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { Matchers } from '@pact-foundation/pact'

import { checkoutRevisionNotificationEvent } from '../../__fixtures__'
import { addMessageInteraction } from '../__utils__'

describe('EventsQuery', () => {
  test('with only parameter "first"', async () => {
    await addEventsContract({ first: 500 })
  })

  test('with parameter "after"', async () => {
    await addEventsContract({ first: 500, after: 100 })
  })

  test('with parameter "objectId"', async () => {
    await addEventsContract({ first: 500, objectId: 1565 })
  })

  test('with parameter "actorId"', async () => {
    await addEventsContract({ first: 500, actorId: 1 })
  })

  test('with parameter "instance"', async () => {
    await addEventsContract({ first: 500, instance: 'de' })
  })
})

async function addEventsContract(payload: Record<string, unknown>) {
  const message = { type: 'EventsQuery', payload }

  await addMessageInteraction({
    given: `there exist events`,
    message,
    responseBody: {
      events: Matchers.eachLike({
        // Only add properties which are common between all events
        __typename: checkoutRevisionNotificationEvent.__typename,
        id: checkoutRevisionNotificationEvent.id,
        instance: checkoutRevisionNotificationEvent.instance,
        date: Matchers.iso8601DateTime(checkoutRevisionNotificationEvent.date),
        actorId: checkoutRevisionNotificationEvent.actorId,
        objectId: checkoutRevisionNotificationEvent.objectId,
      }),
    },
  })

  await fetch(`http://${process.env.SERLO_ORG_DATABASE_LAYER_HOST}`, {
    method: 'POST',
    body: JSON.stringify(message),
    headers: { 'Content-Type': 'application/json' },
  })
}
