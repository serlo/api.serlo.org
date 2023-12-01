import { Pact } from '@pact-foundation/pact'
import { bypass, http, passthrough } from 'msw'
import path from 'path'

import {
  createAfterAll,
  createAfterEach,
  createBeforeAll,
  createBeforeEach,
} from './setup'
import { createAuthServices } from '~/internals/authentication'
import { emptySwrQueue } from '~/internals/swr-queue'
import { createSerloModel } from '~/model'

const pactDir = path.join(__dirname, '..', 'pacts')

const port = 9009

jest.setTimeout(60 * 1000)

global.pact = new Pact({
  consumer: 'api.serlo.org',
  provider: 'serlo.org-database-layer',
  port,
  dir: pactDir,
})

beforeAll(async () => {
  createBeforeAll({})
  await global.pact.setup()
})

beforeEach(async () => {
  await createBeforeEach()
  global.server.use(
    http.post(
      new RegExp(process.env.SERLO_ORG_DATABASE_LAYER_HOST.replace('.', '\\.')),
      async ({ request }) => {
        const url = new URL(request.url)
        return fetch(bypass(`http://127.0.0.1:${port}${url.pathname}`, request))
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
    await createAfterEach()
  }
})

afterAll(async () => {
  try {
    await global.pact.finalize()
  } finally {
    createAfterAll()
  }
})

declare global {
  /* eslint-disable no-var */
  var pact: import('@pact-foundation/pact').Pact
  var client: import('@apollo/server').ApolloServer
  var serloModel: ReturnType<typeof createSerloModel>
}
