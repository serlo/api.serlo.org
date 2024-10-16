import { flush as flushSentry, type Event } from '@sentry/node'
import * as Sentry from '@sentry/node'
import crypto from 'crypto'
import { setupServer } from 'msw/node'
import { createPool, type Pool } from 'mysql2/promise'

import {
  defaultSpreadsheetApi,
  givenSpreadheetApi,
  MockKratos,
} from './__tests__/__utils__'
import { createCache, createNamespacedCache } from '~/cache'
import { type Cache } from '~/context/cache'
import { Database } from '~/database'
import { initializeSentry } from '~/internals/sentry'
import { timeToMilliseconds, Time, Timer } from '~/timer'

beforeAll(() => {
  initializeSentry({
    dsn: 'https://public@127.0.0.1/0',
    environment: 'testing',
    context: 'testing',
    testTransport: () => {
      return {
        send: async (envelope: unknown) => {
          const [, items] = envelope as unknown[][]

          ;(items as Sentry.Event[][]).forEach(([_, data]) => {
            global.sentryEvents.push(data)
          })

          return Promise.resolve({})
        },
        flush: async () => Promise.resolve(true),
      }
    },
  })

  const timer = new MockTimer()
  const server = setupServer()
  const kratos = new MockKratos()

  global.pool = createPool(process.env.MYSQL_URI)
  global.server = server
  global.timer = timer
  global.kratos = kratos

  global.server.listen({ onUnhandledRequest: 'bypass' })

  process.env.OPENAI_API_KEY = 'fake-test-key-we-are-mocking-responses'
})

beforeEach(async () => {
  global.databaseForTests = new Database(global.pool)
  await global.databaseForTests.beginTransaction()

  const baseCache = createCache({ timer: global.timer })
  global.cache = createNamespacedCache(baseCache, generateRandomString(10))

  await global.cache.ready()

  givenSpreadheetApi(defaultSpreadsheetApi())

  global.timer.flush()
  global.sentryEvents = []
  global.kratos.identities = []

  process.env.ENVIRONMENT = 'local'
})

afterEach(async () => {
  await global.databaseForTests.rollbackAllTransactions()

  await flushSentry()
  global.server.resetHandlers()
  await global.cache.quit()
  // redis.quit() creates a thread to close the connection.
  // We wait until all threads have been run once to ensure the connection closes.
  await new Promise((resolve) => setImmediate(resolve))
})

afterAll(async () => {
  global.server.close()
  await global.databaseForTests.close()
})

class MockTimer implements Timer {
  private currentTime = 0

  public now() {
    return this.currentTime
  }

  public flush() {
    this.currentTime = Date.now()
  }

  // We make this synchronous function asynchronous just to make clear that this would be asynchronous in production.
  // eslint-disable-next-line @typescript-eslint/require-await
  public async waitFor(time: Time) {
    this.currentTime += timeToMilliseconds(time)
  }

  public setCurrentDate(date: Date) {
    this.currentTime = date.getTime()
  }
}

function generateRandomString(length: number) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
}

declare global {
  /* eslint-disable no-var */
  var cache: Cache
  var server: ReturnType<typeof import('msw/node').setupServer>
  var timer: MockTimer
  var sentryEvents: Event[]
  var kratos: MockKratos
  var pool: Pool
  var databaseForTests: Database
}
