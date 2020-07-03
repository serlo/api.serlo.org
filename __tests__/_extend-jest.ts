import { FetchMock } from './_helper'

export function extendExpect() {
  expect.extend({ toHaveRequestsTo, toHaveExactlyOneRequestTo })
}

function toHaveRequestsTo(
  this: jest.MatcherUtils,
  mockedFetch: FetchMock,
  url: string
): jest.CustomMatcherResult {
  const numberOfCalls = mockedFetch.getAllRequestsTo(url).length

  return {
    pass: numberOfCalls > 0,
    message: () => `URL ${url} was called ${numberOfCalls} times`,
  }
}

function toHaveExactlyOneRequestTo(
  this: jest.MatcherUtils,
  mockedFetch: FetchMock,
  url: string
): jest.CustomMatcherResult {
  const numberOfCalls = mockedFetch.getAllRequestsTo(url).length

  return {
    pass: numberOfCalls === 1,
    message: () => `URL ${url} was called ${numberOfCalls} times`,
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toHaveRequestsTo(url: string): R
      toHaveExactlyOneRequestTo(url: string): R
    }
  }
}
