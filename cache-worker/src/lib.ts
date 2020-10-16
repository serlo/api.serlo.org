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

export async function wait(seconds = 1) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, seconds * 1000)
  })
}

export interface cacheKeysResponse {
  data: {
    _cacheKeys: Connection<string>
  }
}

/*
 * The following types were extracted from their original places
 * and brought to this file in order to make the the cache worker
 * independet from the repo api.serlo.org, since the cache worker
 * may go to another place afterwards.
 * The api.serlo.org were at version 0.9.0 at the time of extraction.
 */

//originally in api.serlo.org/src/graphql/schema/types.ts
export enum Service {
  Serlo = 'serlo.org',
  SerloCloudflareWorker = 'serlo.org-cloudflare-worker',
}

//originally in api.serlo.org/src/graphql/schema/connection/types.ts
interface Connection<T> {
  edges: Cursor<T>[]
  nodes: T[]
  totalCount: number
  pageInfo: PageInfo
}

//originally in api.serlo.org/src/types.ts
export type PageInfo = {
  __typename?: 'PageInfo'
  hasNextPage: Scalars['Boolean']
  hasPreviousPage: Scalars['Boolean']
  startCursor?: Maybe<Scalars['String']>
  endCursor?: Maybe<Scalars['String']>
}

interface Cursor<T> {
  cursor: string
  node: T
}

type Maybe<T> = T | null

type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  DateTime: string
  JSON: unknown
  JSONObject: Record<string, unknown>
}
