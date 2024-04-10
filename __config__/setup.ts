import { flush as flushSentry } from '@sentry/node'
import crypto from 'crypto'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { createPool } from 'mysql2/promise'

import {
  defaultSpreadsheetApi,
  givenSpreadheetApi,
  MockKratos,
} from '../__tests__/__utils__'
import { createCache, createNamespacedCache } from '~/internals/cache'
import { initializeSentry, Sentry } from '~/internals/sentry'
import { Time, timeToMilliseconds } from '~/internals/swr-queue'
import { Timer } from '~/internals/timer'

export class MockTimer implements Timer {
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

  public setCurrentTime(time: number) {
    this.currentTime = time
  }
}

export function createBeforeAll() {
  initializeSentry({
    dsn: 'https://public@127.0.0.1/0',
    environment: 'testing',
    context: 'testing',
  })

  const timer = new MockTimer()
  const server = setupServer()
  const kratos = new MockKratos()

  global.database = createPool(process.env.MYSQL_URI)
  global.server = server
  global.timer = timer
  global.kratos = kratos

  global.server.listen({
    async onUnhandledRequest(req) {
      // eslint-disable-next-line no-console
      console.error(
        'Found an unhandled %s request to %s with body %s',
        req.method,
        req.url,
        await req.text(),
      )
      return 'error'
    },
  })
}

export async function createBeforeEach() {
  const baseCache = createCache({ timer: global.timer })
  global.cache = createNamespacedCache(baseCache, generateRandomString(10))

  await global.cache.ready()

  givenSpreadheetApi(defaultSpreadsheetApi())

  global.server.use(
    http.post('https://127.0.0.1/api/0/envelope/', async ({ request }) => {
      const text = await request.text()
      global.sentryEvents.push(
        ...text.split('\n').map((x) => JSON.parse(x) as Sentry.Event),
      )
      return new HttpResponse()
    }),
  )

  global.timer.flush()
  global.sentryEvents = []
  global.kratos.identities = []

  process.env.ENVIRONMENT = 'local'
}

export async function createAfterEach() {
  if (global.transaction != null) {
    await global.transaction.rollback()
    global.transaction.release()
  }

  await flushSentry()
  global.server.resetHandlers()
  await global.cache.quit()
  // redis.quit() creates a thread to close the connection.
  // We wait until all threads have been run once to ensure the connection closes.
  await new Promise((resolve) => setImmediate(resolve))
}

export function createAfterAll() {
  global.server.close()
}

function generateRandomString(length: number) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
}
