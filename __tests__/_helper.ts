import { RequestInfo, Response, Request } from 'node-fetch'
import { RESTDataSource } from 'apollo-datasource-rest'
import { KeyValueCache } from 'apollo-server-caching'

type ResponseSpec = string | Response
type FetchSpec = Record<string, ResponseSpec>

export function createFetchMock(
  specs: FetchSpec = {}
): typeof fetch & FetchMock {
  const mock = new Proxy(new FetchMock(specs), {
    apply: (target, _, args) => target.fetch(args[0]),
  })

  return mock as typeof fetch & FetchMock
}

class FetchMock extends Function {
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

export function createJsonResponse(data: any): Response {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export function initializeDataSource(dataSource: RESTDataSource) {
  dataSource.initialize({ context: {}, cache: new EmptyCache() })
}

class EmptyCache implements KeyValueCache {
  async get(): Promise<string | undefined> {
    return undefined
  }
  async set(): Promise<void> {}
  async delete(): Promise<boolean | void> {
    return true
  }
}
