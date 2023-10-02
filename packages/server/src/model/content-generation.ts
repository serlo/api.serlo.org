import { option as O, function as F } from 'fp-ts'
import * as t from 'io-ts'

import { UserInputError } from '~/errors'

export const UserInputDecoder = t.strict({
  prompt: t.string,
})

export async function makeRequest(payload: Payload) {
  // @ts-expect-error TS complains because payload has non-string property values, but it actually works.
  const params = new URLSearchParams(payload).toString()
  const url = `http://${process.env.CONTENT_GENERATION_SERVICE_HOST}/exercises?${params}`
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (response.status === 200) {
    // Despite application/json headers, the Python fastAPI service seems to be
    // returning a string with the JSON inside it. Were not going to parse it
    // here and will defer that to the Client.
    const generationResultString = await response.text()
    return generationResultString
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

export interface Payload {
  prompt: string
}
