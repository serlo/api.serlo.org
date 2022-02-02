/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { UserInputError } from 'apollo-server-express'
import { option as O, function as F } from 'fp-ts'
import * as t from 'io-ts'
import fetch from 'node-fetch'

import { InstanceDecoder, UuidDecoder } from './decoder'

const URL = `http://${process.env.SERLO_ORG_DATABASE_LAYER_HOST}`

export const spec = {
  LicenseQuery: {
    payload: t.type({ id: t.number }),
    response: t.type({
      id: t.number,
      instance: InstanceDecoder,
      default: t.boolean,
      title: t.string,
      url: t.string,
      content: t.string,
      agreement: t.string,
      iconHref: t.string,
    }),
    canBeNull: true,
  },
  UserSetDescriptionMutation: {
    payload: t.type({ userId: t.number, description: t.string }),
    response: t.type({ success: t.boolean }),
    canBeNull: false,
  },
  UserSetEmailMutation: {
    payload: t.type({ userId: t.number, email: t.string }),
    response: t.type({ success: t.boolean, username: t.string }),
    canBeNull: false,
  },
  UuidSetStateMutation: {
    payload: t.type({
      ids: t.array(t.number),
      userId: t.number,
      trashed: t.boolean,
    }),
    response: t.void,
    canBeNull: false,
  },
  UuidQuery: {
    payload: t.type({ id: t.number }),
    response: UuidDecoder,
    canBeNull: true,
  },
} as const

export async function makeRequest<M extends MessageType>(
  type: M,
  payload: Payload<M>
) {
  const body = JSON.stringify({ type, payload })
  const response = await fetch(URL, {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json' },
  })

  if (response.status === 200) {
    if (spec[type].response._tag === 'VoidType') return

    return (await response.json()) as unknown
  } else if (response.status === 404 && spec[type].canBeNull) {
    // TODO: Here we can check whether the body is "null" and report it toNullable
    // Sentry
    return null
  } else if (response.status === 400) {
    const responseText = await response.text()
    const reason = F.pipe(
      O.tryCatch(() => JSON.parse(responseText) as unknown),
      O.chain(O.fromPredicate(t.type({ reason: t.string }).is)),
      O.map((json) => json.reason),
      O.getOrElse(() => 'Bad Request')
    )

    throw new UserInputError(reason)
  } else {
    throw new Error(`${response.status}: ${body}`)
  }
}

export function getDecoderFor<M extends NullableMessageType>(
  message: M
): t.UnionC<[ResponseDecoder<M>, t.NullC]>
export function getDecoderFor<M extends NotNullableMessageType>(
  message: M
): ResponseDecoder<M>
export function getDecoderFor<M extends MessageType>(message: M): t.Mixed {
  const messageSpec = spec[message]

  return messageSpec.canBeNull
    ? t.union([messageSpec.response, t.null])
    : messageSpec.response
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
export type ResponseDecoder<M extends MessageType> = Spec[M]['response']
