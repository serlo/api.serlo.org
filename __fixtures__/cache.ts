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
import { gql } from 'apollo-server'

export function createSetCacheMutation(variables: {
  key: string
  value: unknown
}) {
  return {
    mutation: gql`
      mutation setCache($key: String!, $value: JSON!) {
        _setCache(key: $key, value: $value)
      }
    `,
    variables: {
      key: variables.key,
      value: variables.value,
    },
  }
}

export function createRemoveCacheMutation(variables: { key: string }) {
  return {
    mutation: gql`
      mutation removeCache($key: String!) {
        _removeCache(key: $key)
      }
    `,
    variables,
  }
}

export function createCacheKeysQuery() {
  return {
    query: gql`
      query {
        _cacheKeys {
          totalCount
          nodes
        }
      }
    `,
  }
}

export function createUpdateCacheMutation(keys: string[]) {
  return {
    mutation: gql`
      mutation _updateCache($keys: [String!]!) {
        _updateCache(keys: $keys)
      }
    `,
    variables: { keys },
  }
}
