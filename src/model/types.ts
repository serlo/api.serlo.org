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

import { InstanceDecoder } from '~/schema/instance/decoder'

export interface Models {
  Mutation: Record<string, never>
  Query: Record<string, never>
  License: t.TypeOf<typeof LicenseDecoder>
}

export const LicenseDecoder = t.type({
  id: t.number,
  instance: InstanceDecoder,
  default: t.boolean,
  title: t.string,
  url: t.string,
  content: t.string,
  agreement: t.string,
  iconHref: t.string,
})

export type Model<Typename extends keyof Models> = Models[Typename]

export type ComputeModel<T> = Typename<T> extends keyof Models
  ? Model<Typename<T>>
  : T extends (infer U)[]
  ? ComputeModel<U>[]
  : T extends object
  ? { [P in keyof T]: ComputeModel<T[P]> }
  : T

export type Typename<T> = T extends { __typename?: infer U }
  ? U extends string
    ? U
    : never
  : never
