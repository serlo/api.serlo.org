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
import { IdentityState, IdentityApi } from '@ory/client'
import express, { Express, Request, Response, RequestHandler } from 'express'
import * as t from 'io-ts'
import { JwtPayload, decode } from 'jsonwebtoken'

import { createRequest } from '~/internals/data-source-helper'
import { captureErrorEvent } from '~/internals/error-event'
import { DatabaseLayer } from '~/model'

const basePath = '/kratos'

const createLegacyUser = createRequest({
  decoder: DatabaseLayer.getDecoderFor('UserCreateMutation'),
  async getCurrentValue(payload: DatabaseLayer.Payload<'UserCreateMutation'>) {
    return DatabaseLayer.makeRequest('UserCreateMutation', payload)
  },
})

export function applyKratosMiddleware({
  app,
  kratosAdmin,
}: {
  app: Express
  kratosAdmin: IdentityApi
}) {
  app.post(`${basePath}/register`, createKratosRegisterHandler(kratosAdmin))

  app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

  app.post(
    `${basePath}/single-logout`,
    createKratosRevokeSessionsHandler(kratosAdmin)
  )
  return basePath
}

function createKratosRegisterHandler(kratos: IdentityApi): RequestHandler {
  async function handleRequest(request: Request, response: Response) {
    if (request.headers['x-kratos-key'] !== process.env.SERVER_KRATOS_SECRET) {
      captureErrorEvent({
        error: new Error('Unauthorized attempt to create user'),
        errorContext: { request },
      })
      response.statusCode = 401
      response.end('Kratos secret mismatch')
      return
    }

    if (!t.type({ userId: t.string }).is(request.body)) {
      response.statusCode = 400
      response.end('Valid identity id has to be provided')
      return
    }

    const { userId } = request.body

    try {
      const kratosUser = (await kratos.getIdentity({ id: userId })).data

      const { username, email } = kratosUser.traits as {
        username: string
        email: string
      }
      const { userId: legacyUserId } = await createLegacyUser({
        username,
        // we just need to store something, since the password in legacy DB is not going to be used anymore
        // storing the kratos id is just a good way of easily seeing this value in case we need it
        password: kratosUser.id,
        email,
      })

      await kratos.updateIdentity({
        id: kratosUser.id,
        updateIdentityBody: {
          schema_id: 'default',
          metadata_public: {
            legacy_id: legacyUserId,
          },
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          traits: kratosUser.traits,
          state: IdentityState.Active,
        },
      })

      response.json({ status: 'success' }).end()
    } catch (error: unknown) {
      captureErrorEvent({
        error: new Error('Could not synchronize user registration'),
        errorContext: { userId, error },
      })

      response.statusCode = 500
      return response.end('Internal error in after hook')
    }
  }

  // See https://stackoverflow.com/a/71912991
  return (request, response) => {
    handleRequest(request, response).catch(() =>
      response.status(500).send('Internal Server Error (Illegal state)')
    )
  }
}

function createKratosRevokeSessionsHandler(
  kratos: IdentityApi
): RequestHandler {
  async function handleRequest(request: Request, response: Response) {
    // TODO: add referrer check after testing or implement validation of jwt token
    if (!t.type({ logout_token: t.string }).is(request.body)) {
      response.statusCode = 400
      response.end('no logout_token provided')
      return
    }

    try {
      // warning: this does not validate the token
      const { sub } = decode(request.body.logout_token) as JwtPayload

      if (!sub) {
        response.statusCode = 400
        response.end('invalid token or sub info missing')
        return
      }

      // eslint-disable-next-line no-console
      console.log(sub)
      // let's hope this actually also searches the identifier we need. if it does: create ory docs issue
      const list = await kratos.listIdentities({
        credentialsIdentifier: `nbp:${sub}`,
      })

      // eslint-disable-next-line no-console
      console.log(list.data)
      const user = list.data[0]

      if (!user || !t.type({ id: t.string }).is(user)) {
        response.statusCode = 400
        response.end('user not found or not valid')
        return
      }

      await kratos.deleteIdentitySessions({
        id: user.id,
      })
      response.json({ status: 'success' }).end()
    } catch (error: unknown) {
      // TODO: remove console.error after POC
      // eslint-disable-next-line no-console
      console.error(error)
      captureErrorEvent({
        error: new Error('Could not revoke sessions of user'),
        errorContext: { error },
      })

      response.statusCode = 500
      return response.end('Internal error while attempting single logout')
    }
  }
  // See https://stackoverflow.com/a/71912991
  return (request, response) => {
    handleRequest(request, response).catch(() =>
      response.status(500).send('Internal Server Error (Illegal state)')
    )
  }
}
