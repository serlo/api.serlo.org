import { V0alpha2Api } from '@ory/client'
import express, { Express } from 'express'
import type { Server } from 'http'
import fetch from 'node-fetch'

import { given } from '../__utils__'
import { applyKratosMiddleware } from '~/internals/server/kratos-middleware'

const port = 8100
let app: Express
let server: Server

beforeAll((done) => {
  app = express()
  app.use(express.json())

  applyKratosMiddleware({
    app,
    kratosAdmin: {
      adminGetIdentity: async (userId: string) => {
        return Promise.resolve({
          data: {
            id: userId,
            traits: {
              username: 'user',
              email: 'user@serlo.dev',
            },
          },
        })
      },
      adminUpdateIdentity: async () => {
        return Promise.resolve()
      },
    } as unknown as V0alpha2Api,
  })

  server = app.listen(port, done)
})

afterAll((done) => {
  server.close(done)
})

describe('Kratos middleware - register endpoint', () => {
  test('fails when secret is not send', async () => {
    const response = await fetchKratos({ withKratosKey: false })

    expect(response.status).toBe(401)
    expect(await response.text()).toBe('Kratos secret mismatch')
  })

  test('fails when userId is not provided', async () => {
    const response = await fetchKratos({ withKratosKey: true, body: {} })

    expect(response.status).toBe(400)
    expect(await response.text()).toBe('Valid identity id has to be provided')
  })

  test('fails when an invalid userId is provided', async () => {
    // kratos identity is a uuidv4, not a number like in legacy
    const response = await fetchKratos({
      withKratosKey: true,
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

    const response = await fetchKratos({
      withKratosKey: true,
      body: { userId: 'e4c6a348-ab17-4b82-95e9-c5354a7f58eb' },
    })

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe(
      'application/json; charset=utf-8'
    )
    expect(await response.json()).toEqual({ status: 'success' })
  })
})

function fetchKratos(args: { withKratosKey: boolean; body?: unknown }) {
  const { withKratosKey, body } = args

  return fetch(`http://localhost:${port}/kratos/register`, {
    method: 'POST',
    headers: {
      'x-msw-bypass': 'true',
      'content-type': 'application/json',
      ...(withKratosKey
        ? { 'x-kratos-key': process.env.SERVER_KRATOS_SECRET }
        : {}),
    },
    ...(body != null ? { body: JSON.stringify(body) } : {}),
  })
}
