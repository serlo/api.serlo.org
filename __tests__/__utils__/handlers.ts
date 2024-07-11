import { HttpResponse, http } from 'msw'
import * as R from 'ramda'

export function createChatUsersInfoHandler({
  username,
  success,
}: {
  username: string
  success: boolean
}) {
  return createCommunityChatHandler({
    endpoint: 'users.info',
    parameters: { username },
    body: { success },
  })
}

function createCommunityChatHandler({
  endpoint,
  parameters,
  body,
}: {
  endpoint: string
  parameters: Record<string, string>
  body: Record<string, unknown>
}) {
  const url = `${process.env.ROCKET_CHAT_URL}api/v1/${endpoint}`
  const handler = http.get(url, ({ request }) => {
    if (
      request.headers.get('X-User-Id') !==
        process.env.ROCKET_CHAT_API_USER_ID ||
      request.headers.get('X-Auth-Token') !==
        process.env.ROCKET_CHAT_API_AUTH_TOKEN
    )
      return new HttpResponse(null, {
        status: 403,
      })

    return HttpResponse.json(body)
  })

  handler.predicate = ({ request }) => {
    return R.toPairs(parameters).every(([name, value]) => {
      const url = new URL(request.url)
      return url.searchParams.get(name) === value
    })
  }

  return handler
}
