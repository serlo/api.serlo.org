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

import { addJsonInteraction } from '../__utils__'
import { NavigationPayload } from '~/schema/uuid'
import { Instance } from '~/types'

test('Navigation', async () => {
  // This is a noop test that just adds the interaction to the contract
  const navigation: NavigationPayload = {
    instance: Instance.De,
    data: [
      {
        label: 'Mathematik',
        children: [{ label: 'Alle Themen' }],
      },
    ],
  }
  await addJsonInteraction({
    name: 'fetch data of navigation',
    given: '',
    path: '/api/navigation',
    body: {
      instance: Matchers.string(navigation.instance),
      data: Matchers.eachLike({
        label: Matchers.string(navigation.data[0].label),
        children: Matchers.eachLike({
          label: Matchers.string(navigation.data[0].children?.[0].label),
        }),
      }),
    },
  })
  await fetch(`http://de.${process.env.SERVER_SERLO_ORG_HOST}/api/navigation`)
})
