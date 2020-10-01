import { AliasResolvers } from './types'

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
export function decodePath(path: string) {
  try {
    return decodeURIComponent(path)
  } catch (error) {
    if (error instanceof URIError) {
      // path is probably already decoded
      return path
    } else {
      throw error
    }
  }
}

export function encodePath(path: string) {
  return encodeURIComponent(path).replace(/%2F/g, '/')
}

export function createAliasResolvers<
  T extends { alias: string | null }
>(): AliasResolvers<T> {
  return {
    alias(entity) {
      return Promise.resolve(entity.alias ? encodePath(entity.alias) : null)
    },
  }
}
