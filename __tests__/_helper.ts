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
import { RESTDataSource } from 'apollo-datasource-rest'
import { InMemoryLRUCache } from 'apollo-server-caching'
import { either } from 'fp-ts'
import fetch, { RequestInfo, Response, Request } from 'node-fetch'

import { ErrorEvent } from '../src/error-event'

export function expectToBeLeftEventWith<A>(
  value: either.Either<ErrorEvent, A>,
  expectedEvent: ErrorEvent
) {
  expect(either.isLeft(value)).toBe(true)

  if (either.isLeft(value))
    expect(value.left).toEqual(expect.objectContaining(expectedEvent))
}

type ResponseSpec = string | Response
type FetchSpec = Record<string, ResponseSpec>

export function createFetchMock(
  specs: FetchSpec = {}
): typeof fetch & FetchMock {
  const mock = new Proxy(new FetchMock(specs), {
    apply: (target, _, args: [RequestInfo]) => target.fetch(args[0]),
  })

  return mock as typeof fetch & FetchMock
}

export class FetchMock extends Function {
  private madeRequests: RequestInfo[] = []

  constructor(private specs: FetchSpec) {
    super()
  }

  getRequestTo(url: string): RequestInfo {
    const requests = this.getAllRequestsTo(url)

    if (requests.length === 0) {
      throw new Error(`URL ${url} was never fetched`)
    } else if (requests.length > 1) {
      throw new Error(`URL ${url} was fetched more than one time`)
    } else {
      return requests[0]
    }
  }

  getAllRequestsTo(url: string): RequestInfo[] {
    return this.madeRequests.filter((r) => FetchMock.getUrl(r) === url)
  }

  fetch(req: RequestInfo) {
    const url = FetchMock.getUrl(req)
    const responseSpec = this.specs[url]

    if (responseSpec === undefined) {
      const errorMessage = `Response for ${url} is not defined`

      return Promise.reject(new Error(errorMessage))
    } else {
      this.madeRequests.push(req)

      return Promise.resolve(FetchMock.convertToResponse(responseSpec))
    }
  }

  mockRequest({ to, response = '' }: { to: string; response?: ResponseSpec }) {
    this.specs[to] = response
  }

  static getUrl(req: RequestInfo): string {
    if (typeof req === 'string') {
      return req
    } else if (req instanceof Request) {
      return req.url
    } else {
      return req.href
    }
  }

  static convertToResponse(spec: ResponseSpec): Response {
    return typeof spec === 'string' ? new Response(spec) : spec
  }
}

export function createJsonResponse(data: unknown): Response {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export function initializeDataSource(dataSource: RESTDataSource) {
  dataSource.initialize({ context: {}, cache: new InMemoryLRUCache() })
}
