import { rest } from 'msw'
import { SetupServer, setupServer } from 'msw/node'

import {
  defaultSpreadsheetApi,
  givenSpreadheetApi,
  MockKratos,
} from '../__tests__/__utils__'
import { createCache } from '~/internals/cache'
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

export function setup() {
  initializeSentry({
    dsn: 'https://public@127.0.0.1/0',
    environment: 'testing',
    context: 'testing',
  })

  const timer = new MockTimer()
  const cache = createCache({ timer })
  const server = setupServer()
  const kratos = new MockKratos()

  global.cache = cache
  global.server = server
  global.timer = timer
  global.kratos = kratos
}

export async function createBeforeAll(
  options: Parameters<SetupServer['listen']>[0],
) {
  await global.cache.ready()

  global.server.listen(options)
}

export async function createBeforeEach() {
  givenSpreadheetApi(defaultSpreadsheetApi())

  global.server.use(
    rest.post<Sentry.Event>(
      'https://127.0.0.1/api/0/envelope',
      async (req, res, ctx) => {
        global.sentryEvents.push(
          ...(await req.text())
            .split('\n')
            .map((x) => JSON.parse(x) as Sentry.Event),
        )
        return res(ctx.status(200))
      },
    ),
  )

  await global.cache.flush()
  global.timer.flush()
  global.sentryEvents = []
  global.kratos.identities = []

  process.env.ENVIRONMENT = 'local'
}

export function createAfterEach() {
  global.server.resetHandlers()
}

export async function createAfterAll() {
  global.server.close()
  await global.cache.quit()
  // redis.quit() creates a thread to close the connection.
  // We wait until all threads have been run once to ensure the connection closes.
  await new Promise((resolve) => setImmediate(resolve))
}
