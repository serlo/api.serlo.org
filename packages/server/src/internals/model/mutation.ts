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

import { InvalidValueError } from './query'
import { AsyncOrSync } from '~/utils'

/**
 * Type of a mutation function in a data source. Given arguments of type
 * `Payload` it executes the mutation and returns a Promise of type `Result`.
 * This function is created via the factory function {@link createMutation}.
 * Via the property `_mutationSpec` the specification object which was given
 * to `createMutation()` can be accessed (see {@link MutationSpec}.
 */
type Mutation<Payload, Result> = ((payload: Payload) => Promise<Result>) & {
  _mutationSpec: MutationSpec<Payload, Result>
}

/**
 * Object type which specifies a mutation. It is the argument type of
 * {@link createMutation} with which a mutation in a data source can be created.
 *
 * @property decoder - io-ts decoder to control the returned value of the
 * mutation during runtime. An error is thrown when the returned value does not
 * match the decoder.
 * @property mutate - Function which executes the actual mutation.
 * @property updateCache - Optional function which updates the API cache when
 * the mutation could be executed and the returned type matches the decoder.
 */
interface MutationSpec<Payload, Result> {
  decoder: t.Type<Result>
  mutate: (payload: Payload) => Promise<unknown>
  updateCache?: (payload: Payload, newValue: Result) => AsyncOrSync<void>
}

/**
 * Helper function to create a mutation in a datasource. Given a specification
 * of type {@link MutationSpec} it creates a mutation function of type
 * {@link Mutation}.
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
