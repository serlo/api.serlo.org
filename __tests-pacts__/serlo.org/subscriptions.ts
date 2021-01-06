/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { Matchers } from '@pact-foundation/pact'
import fetch from 'node-fetch'

import { user } from '../../__fixtures__/uuid'
import { addJsonInteraction } from '../__utils__'

test('Subscriptions', async () => {
  await addJsonInteraction({
    name: `fetch data of all subscriptions for user with id ${user.id}`,
    given: `there exists a subscription for user with id ${user.id}`,
    path: `/api/subscriptions/${user.id}`,
    body: {
      userId: user.id,
      subscriptions: Matchers.eachLike({ id: Matchers.integer(1) }),
    },
  })
  await fetch(
    `http://de.${process.env.SERVER_SERLO_ORG_HOST}/api/subscriptions/${user.id}`
  )
})
