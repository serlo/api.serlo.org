/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { IdentityState, V0alpha2Api } from '@ory/client'
import { Express, Request, Response, RequestHandler } from 'express'
import * as t from 'io-ts'

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
  kratosAdmin: V0alpha2Api
}) {
  app.post(`${basePath}/register`, createKratosRegisterHandler(kratosAdmin))
  return basePath
}

export function createKratosRegisterHandler(
  kratos: V0alpha2Api
): RequestHandler {
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
      const kratosUser = (await kratos.adminGetIdentity(userId)).data

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

      await kratos.adminUpdateIdentity(kratosUser.id, {
        schema_id: 'default',
        metadata_public: {
          legacy_id: legacyUserId,
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        traits: kratosUser.traits,
        state: IdentityState.Active,
      })

      response.statusCode = 200
      response.end(JSON.stringify({ status: 'success' }))
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
      response.status(500).send('Internal Server Error (Illegal state=)')
    )
  }
}
