/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { Pact } from '@pact-foundation/pact'
import { rest } from 'msw'
import fetch from 'node-fetch'
import path from 'path'

import { createTestClient } from '../__tests__/__utils__'
import {
  createAfterAll,
  createAfterEach,
  createBeforeAll,
  createBeforeEach,
  setup,
} from './setup'
import { Service } from '~/internals/auth'

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
        const pactRes = await fetch(`http://localhost:${port}${url.pathname}`)
        return res(ctx.status(pactRes.status), ctx.json(await pactRes.json()))
      }
    ),
    rest.post(
      new RegExp(process.env.SERLO_ORG_DATABASE_LAYER_HOST.replace('.', '\\.')),
      async (req, res, ctx) => {
        const url = req.url
        const pactRes = await fetch(`http://localhost:${port}${url.pathname}`, {
          method: 'POST',
          body:
            typeof req.body === 'object' ? JSON.stringify(req.body) : req.body,
          headers: {
            'Content-Type': req.headers.get('Content-Type')!,
          },
        })
        return pactRes.bodyUsed
          ? res(ctx.status(pactRes.status), ctx.json(await pactRes.json()))
          : res(ctx.status(pactRes.status))
      }
    )
  )
  global.client = createTestClient({
    service: Service.SerloCloudflareWorker,
    userId: null,
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

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace NodeJS {
    interface Global {
      pact: import('@pact-foundation/pact').Pact
      client: import('../__tests__/__utils__').Client
    }
  }
}
