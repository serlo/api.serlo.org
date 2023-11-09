import { option as O, function as F } from 'fp-ts'
import * as t from 'io-ts'

import { UserInputError } from '~/errors'

export const PayloadDecoder = t.strict({
  prompt: t.string,
})

type AnyJsonResponse = Record<string, unknown>

export async function makeRequest({
  prompt,
}: t.TypeOf<typeof PayloadDecoder>): Promise<Record<string, unknown>> {
  const url = new URL(
    `http://${process.env.CONTENT_GENERATION_SERVICE_HOST}/execute`,
  )

  url.searchParams.append('prompt', prompt)

  const response = await fetch(url.href)

  if (response.status === 200) {
    const responseJson = (await response.json()) as unknown as AnyJsonResponse
    return responseJson
  } else if (response.status === 400) {
    const responseJson = (await response.json()) as unknown as AnyJsonResponse
    const reason = F.pipe(
      O.tryCatch(() => responseJson as unknown),
      O.chain(O.fromPredicate(t.type({ reason: t.string }).is)),
      O.map((json) => json.reason),
      O.getOrElse(() => 'Bad Request'),
    )

    throw new UserInputError(reason)
  } else {
    throw new Error(`${response.status}`)
  }
}
