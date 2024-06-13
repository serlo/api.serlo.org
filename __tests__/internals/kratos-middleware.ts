import express, { Express } from 'express'
import type { Server } from 'http'
import { bypass } from 'msw'
import { createPool } from 'mysql2/promise'

import { given } from '../__utils__'
import { Identity, Kratos } from '~/context/auth-services'
import { applyKratosMiddleware } from '~/internals/server/kratos-middleware'

const port = 8100
let app: Express
let server: Server
let kratosMock: Kratos

interface IdentityApiGetIdentityRequest {
  id: string
}

describe('Kratos middleware - register endpoint', () => {
  beforeEach((done) => {
    createKratosMiddlewareBeforeEach(done)
  })

  afterEach((done) => {
    server.close(done)
  })

  test('fails when secret is not sent', async () => {
    const response = await fetchKratosRegister({ withKratosKey: false })

    expect(response.status).toBe(401)
    expect(await response.text()).toBe('Kratos secret mismatch')
  })

  test('successful if it finds an account to sync', async () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    kratosMock.db.executeSingleQuery<Identity> = async () => {
      return Promise.resolve([
        {
          id: '23af75f5-009a-4a11-a9d0-d79ac8bc8d34',
          traits: {
            username: 'serlo-user',
            email: 'email@serlo.org',
          },
        },
      ] as Identity[])
    }

    const response = await fetchKratosRegister({})

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe(
      'application/json; charset=utf-8',
    )
    expect(await response.json()).toEqual({ status: 'success' })
  })
})

describe('Kratos middleware - single-logout endpoint', () => {
  beforeEach((done) => {
    createKratosMiddlewareBeforeEach(done)
  })

  afterEach((done) => {
    server.close(done)
  })

  const validLogoutToken =
    'logout_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlNGM2YTM0OC1hYjE3LTRiODItOTVlOS1jNTM1NGE3ZjU4ZWIifQ.H6xBcfKZCc37gpVQNRK_V6o7SAHctW814Mh-UjZ0o0o'

  test('fails when payload has not logout_token in body', async () => {
    const response = await fetchKratosSingleLogout()
    expect(response.status).toBe(400)
    expect(await response.text()).toBe('no logout_token provided')
    expect(response.headers.get('Cache-Control')).toEqual('no-store')
  })

  test('fails when logout_token.claims.sub is not an UUIDv4', async () => {
    const response = await fetchKratosSingleLogout(
      // "sub": "12354567"
      'logout_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM1NDU2NyJ9.B5O3bv8GckS4GnqhicuRVeYf6Q0Yvael_vxuhX9W5_0',
    )
    expect(response.status).toBe(400)
    expect(await response.text()).toBe('invalid token or sub info missing')
    expect(response.headers.get('Cache-Control')).toEqual('no-store')
  })

  test('fails when user cannot be found in DB', async () => {
    kratosMock.db.getIdByCredentialIdentifier = async () => {
      return Promise.resolve(null)
    }
    const response = await fetchKratosSingleLogout(validLogoutToken)
    expect(response.status).toBe(400)
    expect(await response.text()).toBe('user not found or not valid')
    expect(response.headers.get('Cache-Control')).toEqual('no-store')
  })

  test('fails with 400 when Internal Server Error occurs', async () => {
    kratosMock.db.getIdByCredentialIdentifier = () => {
      throw new Error('internal server error')
    }
    const response = await fetchKratosSingleLogout(validLogoutToken)

    expect(response.status).toBe(400)
    expect(await response.text()).toBe(
      'Internal error while attempting single logout',
    )
    expect(response.headers.get('Cache-Control')).toEqual('no-store')
  })

  test('with valid payload and user found in DB', async () => {
    const response = await fetchKratosSingleLogout(validLogoutToken)

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ status: 'success' })
    expect(response.headers.get('Cache-Control')).toEqual('no-store')
  })
})

function fetchKratosRegister({
  withKratosKey = true,
  body,
}: {
  withKratosKey?: boolean
  body?: unknown
}) {
  return fetch(
    bypass(`http://localhost:${port}/kratos/register`, {
      method: 'POST',
      headers: {
        'content-type': `application/json`,
        ...(withKratosKey
          ? { 'x-kratos-key': process.env.SERVER_KRATOS_SECRET }
          : {}),
      },
      ...(body != null ? { body: JSON.stringify(body) } : {}),
    }),
  )
}

function fetchKratosSingleLogout(body?: string | undefined) {
  return fetch(
    bypass(`http://localhost:${port}/kratos/single-logout`, {
      method: 'POST',
      headers: {
        'content-type': `application/x-www-form-urlencoded`,
      },
      ...(body != null ? { body } : {}),
    }),
  )
}

function createKratosMiddlewareBeforeEach(done: jest.DoneCallback) {
  app = express()
  app.use(express.json())

  kratosMock = createKratosMock()

  applyKratosMiddleware({
    app,
    kratos: kratosMock,
    pool: createPool(process.env.MYSQL_URI),
  })

  server = app.listen(port, done)
}

function createKratosMock() {
  return {
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
}
