/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import fetch, { RequestInit as DefaultRequestInit } from 'node-fetch'
import { URL } from 'url'

// We use some helpers on top of fetch that are compatible with Apollo's data sources
export type Body = Record<string, unknown>

export interface RequestInit {
  method?: DefaultRequestInit['method']
  headers?: Record<string, string>
}

export interface FetchHelpers {
  get: <TResult>(
    path: string,
    params?: Record<string, string>,
    init?: RequestInit
  ) => Promise<TResult>
  post: <TResult>(
    path: string,
    body?: Body,
    init?: RequestInit
  ) => Promise<TResult>
  patch: <TResult>(
    path: string,
    body?: Body,
    init?: RequestInit
  ) => Promise<TResult>
  put: <TResult>(
    path: string,
    body?: Body,
    init?: RequestInit
  ) => Promise<TResult>
  delete: <TResult>(
    path: string,
    params?: Record<string, string>,
    init?: RequestInit
  ) => Promise<TResult>
}

export function createFetchHelpersFromNodeFetch(): FetchHelpers {
  async function apolloLikeFetch<TResult>({
    path,
    params,
    ...init
  }: RequestInit & {
    body?: Body
    path: string
    params?: Record<string, string>
  }): Promise<TResult> {
    const url = new URL(path)
    if (params !== undefined) {
      for (const [name, value] of Object.entries(params)) {
        url.searchParams.append(name, value)
      }
    }
    const response = await fetch(url.toString(), {
      ...init,
      body: init.body ? JSON.stringify(init.body) : undefined,
    })
    return (await response.json()) as TResult
  }

  return {
    get<TResult>(
      path: string,
      params?: Record<string, string>,
      init?: RequestInit
    ): Promise<TResult> {
      return apolloLikeFetch({ method: 'GET', path, params, ...init })
    },
    post<TResult>(
      path: string,
      body?: Body,
      init?: RequestInit
    ): Promise<TResult> {
      return apolloLikeFetch({ method: 'POST', path, body, ...init })
    },
    patch<TResult>(
      path: string,
      body?: Body,
      init?: RequestInit
    ): Promise<TResult> {
      return apolloLikeFetch({ method: 'PATCH', path, body, ...init })
    },
    put<TResult>(
      path: string,
      body?: Body,
      init?: RequestInit
    ): Promise<TResult> {
      return apolloLikeFetch({ method: 'PUT', path, body, ...init })
    },
    delete<TResult>(
      path: string,
      params?: Record<string, string>,
      init?: RequestInit
    ): Promise<TResult> {
      return apolloLikeFetch({ method: 'DELETE', path, params, ...init })
    },
  }
}
