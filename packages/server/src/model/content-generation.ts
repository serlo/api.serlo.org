import { option as O, function as F } from 'fp-ts'
import * as t from 'io-ts'

import { UserInputError } from '~/errors'

export const PayloadDecoder = t.strict({
  prompt: t.string,
})

export async function makeRequest({ prompt }: t.TypeOf<typeof PayloadDecoder>) {
  const url = new URL(
    `http://${process.env.CONTENT_GENERATION_SERVICE_HOST}/exercises`,
  )

  url.searchParams.append('prompt', prompt)

  const response = await fetch(url.href, {
    headers: { 'Content-Type': 'text/plain' },
  })

  if (response.status === 200) {
    return await response.text()
  } else if (response.status === 404) {
    return null
  } else if (response.status === 400) {
    const responseText = await response.text()
    const reason = F.pipe(
      O.tryCatch(() => JSON.parse(responseText) as unknown),
      O.chain(O.fromPredicate(t.type({ reason: t.string }).is)),
      O.map((json) => json.reason),
      O.getOrElse(() => 'Bad Request'),
    )

    throw new UserInputError(reason)
  } else {
    throw new Error(`${response.status}`)
  }
}
