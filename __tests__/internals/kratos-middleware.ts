/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2023 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2023 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import express, { Express } from 'express'
import type { Server } from 'http'
import fetch from 'node-fetch'

import { given } from '../__utils__'
import { Kratos } from '~/internals/authentication'
import { applyKratosMiddleware } from '~/internals/server/kratos-middleware'

const port = 8100
let app: Express
let server: Server

interface IdentityApiGetIdentityRequest {
  id: string
}

const kratosMock = {
  admin: {
    getIdentity: async (requestParameters: IdentityApiGetIdentityRequest) => {
      return Promise.resolve({
        data: {
          id: requestParameters.id,
          traits: {
            username: 'user',
            email: 'user@serlo.dev',
          },
        },
      })
    },
    updateIdentity: async () => {
      return Promise.resolve()
    },
    deleteIdentitySessions: async () => {
      return Promise.resolve()
    },
  },
  db: {
    getIdByCredentialIdentifier: async () => {
      return Promise.resolve('23af75f5-009a-4a11-a9d0-d79ac8bc8d34')
    },
  },
} as unknown as Kratos

beforeAll((done) => {
  app = express()
  app.use(express.json())

  applyKratosMiddleware({
    app,
    kratos: kratosMock,
  })

  server = app.listen(port, done)
})

afterAll((done) => {
  server.close(done)
})

describe('Kratos middleware - register endpoint', () => {
  test('fails when secret is not sent', async () => {
    const response = await fetchKratosRegister({ withKratosKey: false })

    expect(response.status).toBe(401)
    expect(await response.text()).toBe('Kratos secret mismatch')
  })

  test('fails when userId is not provided', async () => {
    const response = await fetchKratosRegister({
      body: {},
    })

    expect(response.status).toBe(400)
    expect(await response.text()).toBe('Valid identity id has to be provided')
  })

  test('fails when an invalid userId is provided', async () => {
    // kratos identity is a uuidv4, not a number like in legacy
    const response = await fetchKratosRegister({
      body: { userId: 1 },
    })

    expect(response.status).toBe(400)
    expect(await response.text()).toBe('Valid identity id has to be provided')
  })

  test('with valid userId', async () => {
    given('UserCreateMutation').returns({
      userId: 1,
      success: true,
    })

    const response = await fetchKratosRegister({
      body: { userId: 'e4c6a348-ab17-4b82-95e9-c5354a7f58eb' },
    })

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe(
      'application/json; charset=utf-8'
    )
    expect(await response.json()).toEqual({ status: 'success' })
  })
})

describe('Kratos middleware - single-logout endpoint', () => {
  test('fails when payload has not logout_token in body', async () => {
    kratosMock.db.getIdByCredentialIdentifier = async () => {
      return Promise.resolve(null)
    }
    const response = await fetchKratosSingleLogout({
      body: {},
    })
    expect(response.status).toBe(400)
  })
})

function fetchKratos(args: {
  endpoint: string
  withKratosKey: boolean
  contentType: 'json' | 'x-www-form-urlencoded'
  body?: unknown
}) {
  const { endpoint, withKratosKey, contentType, body } = args

  return fetch(`http://localhost:${port}/kratos/${endpoint}`, {
    method: 'POST',
    headers: {
      'x-msw-bypass': 'true',
      'content-type': `application/${contentType}`,
      ...(withKratosKey
        ? { 'x-kratos-key': process.env.SERVER_KRATOS_SECRET }
        : {}),
    },
    ...(body != null ? { body: JSON.stringify(body) } : {}),
  })
}

function fetchKratosRegister({
  withKratosKey = true,
  body,
}: {
  withKratosKey?: boolean
  body?: unknown
}) {
  return fetchKratos({
    endpoint: 'register',
    contentType: 'json',
    ...{ withKratosKey, body },
  })
}

function fetchKratosSingleLogout({ body }: { body?: unknown }) {
  return fetchKratos({
    endpoint: 'single-logout',
    contentType: 'x-www-form-urlencoded',
    withKratosKey: false,
    body,
  })
}
