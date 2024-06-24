import { option as O } from 'fp-ts'
import * as t from 'io-ts'
import { URL } from 'url'

import { Context } from '~/context'
import {
  createMutation,
  createLegacyQuery,
} from '~/internals/data-source-helper'

export function createChatModel({
  context,
}: {
  context: Pick<Context, 'swrQueue' | 'cache'>
}) {
  const getUsersInfo = createLegacyQuery(
    {
      type: 'community.serlo.org/get-users-info',
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
    context,
  )

  const deleteUser = createMutation({
    type: 'community.serlo.org/delete-user',
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

  return await response.json()
}

function getChatUrl(endpoint: string) {
  return `${process.env.ROCKET_CHAT_URL}api/v1/${endpoint}`
}
