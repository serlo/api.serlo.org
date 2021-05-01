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
import * as t from 'io-ts'

import { InvalidValueError } from './common'

/**
 * Specification object for a request function.
 */
export interface RequestSpec<Payload, Result> {
  /**
   * io-ts decoder which is used during runtime to check whether the returned
   * value is of the aspected type.
   */
  decoder: t.Type<Result>

  /**
   * Function which does the actual query operation.
   */
  getCurrentValue: (payload: Payload) => Promise<unknown>
}

/**
 * Type of a request operation in a data source.
 */
export type Request<Payload, Result> = ((
  payload: Payload
) => Promise<Result>) & {
  _querySpec: RequestSpec<Payload, Result>
}

/**
 * Creates a request function for a data source. This is a "read" operation
 * which shall never be cached by the API. Thus it only checks whether the
 * returned value has the right type. It throws an error when the check was not
 * sucessfull.
 */
export function createRequest<P, R>(spec: RequestSpec<P, R>): Request<P, R> {
  async function query(payload: P) {
    const value = await spec.getCurrentValue(payload)

    if (spec.decoder.is(value)) {
      return value
    } else {
      throw new InvalidValueError(value)
    }
  }

  query._querySpec = spec

  return query
}
