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
import { either as E } from 'fp-ts'
import t from 'io-ts'
import { PathReporter } from 'io-ts/lib/PathReporter'

export function createMutation<P, R = void>(
  spec: MutationSpec<P, R>
): Mutation<P, R> {
  async function mutation(payload: P): Promise<R> {
    const result = await spec.mutate(payload)

    const decoded = spec.decoder.decode(result)

    if (E.isLeft(decoded)) {
      const message = PathReporter.report(decoded).join('\n ')

      throw new Error(`illegal payload received: ${message}`)
    }

    const value = decoded.right

    if (spec.updateCache !== undefined) await spec.updateCache(payload, value)

    return value
  }

  mutation._mutationSpec = spec

  return mutation
}

interface MutationSpec<P, R> {
  decoder: t.Type<R>
  updateCache?: (payload: P, newValue: R) => Promise<void> | void
  mutate: (payload: P) => Promise<unknown>
}

type Mutation<P, R> = ((payload: P) => Promise<R>) & {
  _mutationSpec: MutationSpec<P, R>
}
