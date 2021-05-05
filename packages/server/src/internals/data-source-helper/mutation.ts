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
import t from 'io-ts'

import { InvalidValueError } from './common'
import { AsyncOrSync } from '~/utils'

/**
 * Helper function to create a mutation in a datasource. An example:
 *
 * ```ts
 * import * as t from 'io-ts'
 *
 * const removeObject = createMutation({
 *   // Decoder to check the returned result in runtime.
 *   // Here the mutation returns the type `{ success: boolean }`.
 *   decoder: t.strict({ success: t.boolean }),
 *
 *   // function which executes the necessary requests for the mutation
 *   async mutate({ id } : { id: number }) {
 *     const url = `http://api.example.com/remove/{ id }`
 *     const response = await fetch(url, {
 *       method: "POST"
 *     })
 *     return await response.json() as unknown
 *   },
 *
 *   // function which updates the cache
 *   async updateCache({ id }) {
 *     await cache.remove(id)
 *   }
 * })
 * ```
 *
 * The created mutation can be executed by calling the returned function (e.g.
 *  `await removeObject({ id: 1 })`). Via the property `__mutationSpec` the
 *  passed specification to `createMutation()` can be accessed. So for example
 *  with `removeObject.__mutationSpec.decoder` you can access the decoder of the
 *  mutation.
 */
export function createMutation<P, R>(spec: MutationSpec<P, R>): Mutation<P, R> {
  async function mutation(payload: P): Promise<R> {
    const result = await spec.mutate(payload)

    if (spec.decoder.is(result)) {
      if (spec.updateCache !== undefined)
        await spec.updateCache(payload, result)

      return result
    } else {
      throw new InvalidValueError(result)
    }
  }

  mutation._mutationSpec = spec

  return mutation
}

/**
 * Argument type for the function {@link createMutation} with which a mutation
 * in a data source can be created.
 */
export interface MutationSpec<Payload, Result> {
  /**
   * io-ts decoder to control the returned value of the
   * mutation during runtime. An error is thrown when the returned value does not
   * match the decoder.
   */
  decoder: t.Type<Result>

  /**
   * Function which executes the actual mutation.
   */
  mutate: (payload: Payload) => Promise<unknown>

  /**
   * Optional function which updates the API cache when the mutation could be
   * executed and the result of the mutation matches the decoder.
   */
  updateCache?: (payload: Payload, newValue: Result) => AsyncOrSync<void>
}

/**
 * Type of a mutation function in a data source.
 */
type Mutation<Payload, Result> = ((payload: Payload) => Promise<Result>) & {
  _mutationSpec: MutationSpec<Payload, Result>
}
