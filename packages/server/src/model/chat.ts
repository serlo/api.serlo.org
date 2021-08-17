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
import { option as O } from 'fp-ts'
import * as t from 'io-ts'
import fetch from 'node-fetch'
import { URL } from 'url'

import { createQuery } from '~/internals/data-source-helper'
import { Environment } from '~/internals/environment'

export function createChatModel({ environment }: { environment: Environment }) {
  const getUsersInfo = createQuery(
    {
      decoder: t.strict({ success: t.boolean }),
      enableSwr: true,
      staleAfter: { hour: 3 },
      getCurrentValue: async ({ username }: { username: string }) => {
        return await fetchChatApi({
          endpoint: 'users.info',
          parameters: { username },
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
    },
    environment
  )

  return {
    getUsersInfo,
  }
}

async function fetchChatApi({
  endpoint,
  parameters,
}: {
  endpoint: string
  parameters: Record<string, string>
}) {
  const url = new URL(`${process.env.ROCKET_CHAT_URL}/api/v1/${endpoint}`)
  for (const name in parameters) {
    url.searchParams.append(name, parameters[name])
  }

  const response = await fetch(url, {
    headers: {
      'X-Auth-Token': process.env.ROCKET_CHAT_API_AUTH_TOKEN,
      'X-User-Id': process.env.ROCKET_CHAT_API_USER_ID,
    },
  })

  return (await response.json()) as unknown
}
