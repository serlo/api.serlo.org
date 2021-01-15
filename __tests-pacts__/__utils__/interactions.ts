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

import { NavigationPayload, UuidPayload } from '~/schema/uuid'

export function addNavigationInteraction(payload: NavigationPayload) {
  return addJsonInteraction({
    name: `fetch data of navigation`,
    given: '',
    path: '/api/navigation',
    body: {
      data: Matchers.eachLike({
        label: Matchers.string(payload.data[0].label),
        id: Matchers.integer(payload.data[0].id),
        children: Matchers.eachLike({
          label: Matchers.string(payload.data[0].children?.[0].label),
          id: Matchers.integer(payload.data[0].children?.[0].id),
        }),
      }),
    },
  })
}

export function addUuidInteraction<T extends UuidPayload>(
  data: Record<keyof T, unknown> & { __typename: string; id: number }
) {
  return addJsonInteraction({
    name: `fetch data of uuid ${data.id}`,
    given: `uuid ${data.id} is of type ${data.__typename}`,
    path: `/uuid/${data.id}`,
    body: data,
  })
}

export function addJsonInteraction({
  name,
  given,
  path,
  body,
}: {
  name: string
  given: string
  path: string
  body: unknown
}) {
  return global.pact.addInteraction({
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
