import { Pact } from '@pact-foundation/pact'
import { http, HttpResponse } from 'msw'
import path from 'path'

import {
  createAfterAll,
  createAfterEach,
  createBeforeAll,
  createBeforeEach,
  setup,
} from './setup'
import { createAuthServices } from '~/internals/authentication'
import { emptySwrQueue } from '~/internals/swr-queue'
import { createSerloModel } from '~/model'

const pactDir = path.join(__dirname, '..', 'pacts')

const port = 9009

setup()

jest.setTimeout(60 * 1000)

global.pact = new Pact({
  consumer: 'api.serlo.org',
  provider: 'serlo.org-database-layer',
  port,
  dir: pactDir,
})

beforeAll(async () => {
  await createBeforeAll({ onUnhandledRequest: 'bypass' })
  await global.pact.setup()
})

beforeEach(async () => {
  await createBeforeEach()
  global.server.use(
    http.get(
      new RegExp(process.env.SERLO_ORG_DATABASE_LAYER_HOST.replace('.', '\\.')),
      async ({ request }) => {
        const url = new URL(request.url)
        const pactRes = await fetch(`http://127.0.0.1:${port}${url.pathname}`)
        const body = (await pactRes.json()) as unknown
        return new HttpResponse(JSON.stringify(body), {
          status: pactRes.status,
        })
      },
    ),
    http.post(
      new RegExp(process.env.SERLO_ORG_DATABASE_LAYER_HOST.replace('.', '\\.')),
      async ({ request }) => {
        const url = new URL(request.url)
        const body = await request.json()
        const pactRes = await fetch(`http://127.0.0.1:${port}${url.pathname}`, {
          method: 'POST',
          body:
            typeof body === 'object' ? JSON.stringify(body) : (body as string),
          headers: {
            'Content-Type': request.headers.get('Content-Type')!,
          },
        })
        const pactBody = (await pactRes.json()) as unknown
        return pactRes.headers.get('Content-Type')
          ? new HttpResponse(JSON.stringify(pactBody), {
              status: pactRes.status,
            })
          : new HttpResponse(null, { status: pactRes.status })
      },
    ),
  )
  global.serloModel = createSerloModel({
    environment: {
      cache: global.cache,
      swrQueue: emptySwrQueue,
      authServices: createAuthServices(),
    },
  })
})

afterEach(async () => {
  try {
    await global.pact.verify()
  } finally {
    createAfterEach()
  }
})

afterAll(async () => {
  try {
    await global.pact.finalize()
  } finally {
    await createAfterAll()
  }
})

declare global {
  /* eslint-disable no-var */
  var pact: import('@pact-foundation/pact').Pact
  var client: import('@apollo/server').ApolloServer
  var serloModel: ReturnType<typeof createSerloModel>
}
