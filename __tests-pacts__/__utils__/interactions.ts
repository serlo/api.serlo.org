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
import { UuidPayload } from '~/schema/uuid'

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
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body,
    },
  })
}

export function addMutationInteraction({
  name,
  given,
  path,
  requestBody,
  responseBody,
}: {
  name: string
  given: string
  path: string
  requestBody: Record<string, unknown>
  responseBody?: Record<string, unknown>
}) {
  return global.pact.addInteraction({
    uponReceiving: name,
    state: given,
    withRequest: {
      method: 'POST',
      path,
      body: requestBody,
      headers: { 'Content-Type': 'application/json' },
    },
    willRespondWith: {
      status: 200,
      ...(responseBody === undefined
        ? {}
        : {
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: responseBody,
          }),
    },
  })
}

export function addMessageInteraction({
  given,
  message,
  responseBody,
}: {
  given: string
  message: {
    type: string
    payload?: Record<string, unknown>
  }
  responseBody?: Record<string, unknown>
}) {
  return global.pact.addInteraction({
    uponReceiving: `Message ${JSON.stringify(message)}`,
    state: given,
    withRequest: {
      method: 'POST',
      path: '/',
      body: message,
      headers: { 'Content-Type': 'application/json' },
    },
    willRespondWith: {
      status: 200,
      ...(responseBody === undefined
        ? {}
        : {
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: responseBody,
          }),
    },
  })
}
