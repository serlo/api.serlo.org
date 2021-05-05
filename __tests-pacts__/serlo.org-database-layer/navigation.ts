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
import fetch from 'node-fetch'

import { addMessageInteraction } from '../__utils__'
import { Payload } from '~/internals/model'
import { Instance } from '~/types'

test('NavigationQuery', async () => {
  const navigation: Payload<'serlo', 'getNavigationPayload'> = {
    instance: Instance.De,
    data: [
      {
        label: 'Mathematik',
        children: [{ label: 'Alle Themen' }],
      },
    ],
  }
  await addMessageInteraction({
    given: '',
    message: {
      type: 'NavigationQuery',
      payload: {
        instance: navigation.instance,
      },
    },
    responseBody: {
      instance: navigation.instance,
      data: Matchers.eachLike({
        label: Matchers.string(navigation.data[0].label),
        children: Matchers.eachLike({
          label: Matchers.string(navigation.data[0].children?.[0].label),
        }),
      }),
    },
  })
  const response = await fetch(
    `http://${process.env.SERLO_ORG_DATABASE_LAYER_HOST}`,
    {
      method: 'POST',
      body: JSON.stringify({
        type: 'NavigationQuery',
        payload: { instance: navigation.instance },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  expect(await response.json()).toEqual(navigation)
})
