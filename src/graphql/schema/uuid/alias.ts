/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { ForbiddenError, gql } from 'apollo-server'

import { DateTime } from '../date-time'
import { Instance } from '../instance'
import { Schema } from '../utils'

export const aliasSchema = new Schema()

export function decodePath(path: string) {
  return decodeURIComponent(path)
}

export function encodePath(path: string) {
  return encodeURIComponent(path).replace(/%2F/g, '/')
}

/**
 * input AliasInput
 */
export interface AliasInput {
  instance: Instance
  path: string
}
aliasSchema.addTypeDef(gql`
  """
  Needed input to look up an Uuid by alias.
  """
  input AliasInput {
    """
    The \`Instance\` the alias should be looked up in
    """
    instance: Instance!
    """
    The path that should be looked up
    """
    path: String!
  }
`)

export interface AliasPayload {
  id: number
  instance: Instance
  path: string
  source: string
  timestamp: DateTime
}
