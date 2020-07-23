import { setupServer } from 'msw/node'

global.server = setupServer()

beforeAll(() => global.server.listen())

afterEach(() => global.server.resetHandlers())

afterAll(() => global.server.close())

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace NodeJS {
    interface Global {
      server: ReturnType<typeof import('msw/node').setupServer>
    }
  }
}
