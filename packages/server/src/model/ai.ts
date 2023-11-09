import { either } from 'fp-ts'
import * as t from 'io-ts'

import { UserInputError } from '~/errors'

export const PayloadDecoder = t.strict({
  prompt: t.string,
})

const UnknownRecord = t.UnknownRecord

type AnyJsonResponse = t.TypeOf<typeof UnknownRecord>

export const isAnyJsonResponse = (
  response: unknown,
): response is AnyJsonResponse => {
  return UnknownRecord.is(response)
}

export async function makeRequest({
  prompt,
}: t.TypeOf<typeof PayloadDecoder>): Promise<AnyJsonResponse> {
  const url = new URL(
    `http://${process.env.CONTENT_GENERATION_SERVICE_HOST}/execute`,
  )

  url.searchParams.append('prompt', prompt)

  const response = await fetch(url.href)

  if (response.status === 200) {
    const responseJson = (await response.json()) as unknown

    if (!isAnyJsonResponse(responseJson)) {
      throw new Error('Invalid JSON format of content-generation-service')
    }

    return responseJson
  } else if (response.status === 400) {
    const responseJson = (await response.json()) as unknown
    const reasonDecoder = t.type({ reason: t.string })
    const result = reasonDecoder.decode(responseJson)

    if (either.isRight(result)) {
      throw new UserInputError(result.right.reason)
    } else {
      throw new UserInputError('Bad Request')
    }
  } else {
    throw new Error(`${response.status}`)
  }
}
