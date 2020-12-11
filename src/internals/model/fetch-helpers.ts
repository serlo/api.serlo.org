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
