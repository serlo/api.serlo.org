/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { Matchers } from '@pact-foundation/pact'
import fetch from 'node-fetch'

import { addJsonInteraction } from '../__utils__'

test('without a query string', async () => {
  await addEventsInteraction({ name: 'fetch all event ids' })
})

test.each(['after', 'before', 'first', 'last', 'userId', 'uuid'])(
  'query parameter = %s',
  async (parameter) => {
    await addEventsInteraction({
      name: `fetch all events with filter "${parameter}"`,
      queryString: `${parameter}=10`,
    })
  }
)

async function addEventsInteraction({
  name,
  queryString = '',
}: {
  name: string
  queryString?: string
}) {
  await addJsonInteraction({
    name,
    given: 'there is one matching event',
    path: '/api/events',
    query: queryString,
    body: {
      eventIds: Matchers.eachLike(1),
      totalCount: Matchers.integer(1),
      pageInfo: {
        hasNextPage: Matchers.boolean(false),
        hasPreviousPage: Matchers.boolean(false),
        startCursor: Matchers.integer(1),
        endCursor: Matchers.integer(1),
      },
    },
  })
  await fetch(
    `http://de.${process.env.SERLO_ORG_HOST}/api/events${
      queryString ? '?' + queryString : ''
    }`
  )
}
