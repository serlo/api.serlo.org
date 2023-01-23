/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2023 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2023 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { option as O } from 'fp-ts'
import * as t from 'io-ts'
import fetch, { RequestInit } from 'node-fetch'
import { URL } from 'url'

import { createMutation, createQuery } from '~/internals/data-source-helper'
import { Environment } from '~/internals/environment'

export function createChatModel({ environment }: { environment: Environment }) {
  const getUsersInfo = createQuery(
    {
      decoder: t.strict({ success: t.boolean }),
      enableSwr: true,
      staleAfter: { minutes: 30 },
      maxAge: { hours: 24 },
      async getCurrentValue(payload: { username: string }) {
        return await getChatApi({
          endpoint: 'users.info',
          searchParams: payload,
        })
      },
      getKey: ({ username }) => {
        return `community.serlo.org/api/users.info/${username}`
      },
      getPayload: (key) => {
        if (!key.startsWith('community.serlo.org/api/users.info/'))
          return O.none
        const username = key.replace('community.serlo.org/api/users.info/', '')
        return O.some({ username })
      },
      examplePayload: { username: 'aeneas' },
    },
    environment
  )

  const deleteUser = createMutation({
    decoder: t.union([
      t.strict({ success: t.literal(true) }),
      t.strict({ success: t.literal(false), errorType: t.string }),
    ]),
    async mutate(payload: { username: string }) {
      return await postChatApi({ endpoint: 'users.delete', payload })
    },
  })

  return {
    getUsersInfo,
    deleteUser,
  }
}

async function getChatApi({
  endpoint,
  searchParams,
}: {
  endpoint: string
  searchParams?: Record<string, string>
}) {
  const url = new URL(getChatUrl(endpoint))

  for (const name in searchParams) {
    url.searchParams.append(name, searchParams[name])
  }

  return await fetchChatApi(url.href)
}

async function postChatApi({
  endpoint,
  payload,
}: {
  endpoint: string
  payload: Record<string, string>
}) {
  return await fetchChatApi(getChatUrl(endpoint), {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

async function fetchChatApi(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      'X-Auth-Token': process.env.ROCKET_CHAT_API_AUTH_TOKEN,
      'X-User-Id': process.env.ROCKET_CHAT_API_USER_ID,
    },
  })

  return (await response.json()) as unknown
}

function getChatUrl(endpoint: string) {
  return `${process.env.ROCKET_CHAT_URL}api/v1/${endpoint}`
}
