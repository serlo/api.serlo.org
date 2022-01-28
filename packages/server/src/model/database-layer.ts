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
import fetch from 'node-fetch'
import { UserInputError } from 'apollo-server-express'
import { option as O, function as F } from 'fp-ts'
import * as t from 'io-ts'
import { InstanceDecoder } from './decoder'

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
} as const

export async function makeRequest<M extends Message>({
  message,
  payload,
}: {
  message: M
  payload: Payload<M>
}) {
  const response = await fetch(URL, {
    method: 'POST',
    body: JSON.stringify({ type: message, payload }),
    headers: { 'Content-Type': 'application/json' },
  })

  switch (response.status) {
    case 200:
      return await response.json()
    case 404:
      if (spec[message].canBeNull) {
        // TODO: Here we can check whether the body is "null" and report it toNullable
        // Sentry
        return null
      }
    case 400:
      const responseText = await response.text()
      const reason = F.pipe(
        O.tryCatch(() => JSON.parse(responseText) as unknown),
        O.chain(O.fromPredicate(t.type({ reason: t.string }).is)),
        O.map((json) => json.reason),
        O.getOrElse(() => 'Bad Request')
      )

      throw new UserInputError(reason)
    default:
      throw new Error(`${response.status}: ${JSON.stringify(message)}`)
  }
}

export type Spec = typeof spec
export type Message = keyof Spec
export type Payload<M extends Message> = t.TypeOf<Spec[M]['payload']>
export type Response<M extends Message> = t.TypeOf<Spec[M]['response']>
