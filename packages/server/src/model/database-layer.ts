import { function as F, option as O } from 'fp-ts'
import * as t from 'io-ts'

import { UuidDecoder } from './decoder'
import { UserInputError } from '~/errors'

export const spec = {
  UuidQuery: {
    payload: t.type({ id: t.number }),
    response: UuidDecoder,
    canBeNull: true,
  },
} as const

export async function makeRequest<M extends MessageType>(
  type: M,
  payload: Payload<M>,
) {
  const databaseLayerUrl = `http://${process.env.SERLO_ORG_DATABASE_LAYER_HOST}`
  const body = JSON.stringify({
    type,
    ...(payload === undefined ? {} : { payload }),
  })
  const response = await fetch(databaseLayerUrl, {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json' },
  })

  if (response.status === 200) {
    return (await response.json()) as unknown
  } else if (response.status === 404 && spec[type].canBeNull) {
    // TODO: Here we can check whether the body is "null" and report it to
    // Sentry
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
    throw new Error(`${response.status}: ${body}`)
  }
}

export function getDecoderFor<M extends NullableMessageType>(
  message: M,
): t.UnionC<[ResponseDecoder<M>, t.NullC]>
export function getDecoderFor<M extends NotNullableMessageType>(
  message: M,
): ResponseDecoder<M>
export function getDecoderFor<M extends MessageType>(message: M): t.Mixed {
  const messageSpec = spec[message]

  return messageSpec.canBeNull
    ? t.union([messageSpec.response, t.null])
    : messageSpec.response
}

export function getPayloadDecoderFor<M extends MessageType>(
  message: M,
): PayloadDecoder<M> {
  return spec[message]['payload']
}

export type Spec = typeof spec
export type MessageType = keyof Spec
export type NullableMessageType = {
  [K in MessageType]: Spec[K]['canBeNull'] extends true ? K : never
}[MessageType]
export type NotNullableMessageType = {
  [K in MessageType]: Spec[K]['canBeNull'] extends false ? K : never
}[MessageType]
export type Payload<M extends MessageType> = t.TypeOf<Spec[M]['payload']>
export type Response<M extends MessageType> = t.TypeOf<Spec[M]['response']>
export type PayloadDecoder<M extends MessageType> = Spec[M]['payload']
export type ResponseDecoder<M extends MessageType> = Spec[M]['response']
