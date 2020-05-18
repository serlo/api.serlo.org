export const foo = 'bar'

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace NodeJS {
    interface Global {
      pact: import('@pact-foundation/pact').Pact
      commentsPact: import('@pact-foundation/pact').Pact
      uuidPact: import('@pact-foundation/pact').Pact
      client: import('./__tests__/__utils__/test-client').Client
    }
  }
}
