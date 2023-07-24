import { Pact } from '@pact-foundation/pact'
import { rest } from 'msw'
import path from 'path'

import {
  createAfterAll,
  createAfterEach,
  createBeforeAll,
  createBeforeEach,
  setup,
} from './setup'
import { createTestClient } from '../__tests__/__utils__'
import { Service, createAuthServices } from '~/internals/authentication'
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
    rest.get(
      new RegExp(process.env.SERLO_ORG_DATABASE_LAYER_HOST.replace('.', '\\.')),
      async (req, res, ctx) => {
        const url = req.url
        const pactRes = await fetch(`http://127.0.0.1:${port}${url.pathname}`)
        return res(ctx.status(pactRes.status), ctx.json(await pactRes.json()))
      },
    ),
    rest.post(
      new RegExp(process.env.SERLO_ORG_DATABASE_LAYER_HOST.replace('.', '\\.')),
      async (req, res, ctx) => {
        const url = req.url
        const pactRes = await fetch(`http://127.0.0.1:${port}${url.pathname}`, {
          method: 'POST',
          body:
            typeof req.body === 'object'
              ? JSON.stringify(req.body)
              : (req.body as string),
          headers: {
            'Content-Type': req.headers.get('Content-Type')!,
          },
        })
        return pactRes.headers.get('Content-Type')
          ? res(ctx.status(pactRes.status), ctx.json(await pactRes.json()))
          : res(ctx.status(pactRes.status))
      },
    ),
  )
  global.client = createTestClient({
    service: Service.SerloCloudflareWorker,
    userId: null,
  })
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
