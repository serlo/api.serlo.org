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
import { Configuration, IdentityState, V0alpha2Api } from '@ory/client'
import { Express, RequestHandler } from 'express'

import { DatabaseLayer } from '~/model'

const basePath = '/kratos'

export function applyKratosMiddleware({ app }: { app: Express }) {
  const kratos = new V0alpha2Api(
    new Configuration({
      basePath: process.env.SERVER_KRATOS_ADMIN_HOST,
    })
  )
  app.post(`${basePath}/register`, createKratosRegisterHandler(kratos))
  return basePath
}

function createKratosRegisterHandler(kratos: V0alpha2Api): RequestHandler {
  let legacyUserId: number

  return async (req, res) => {
    let referrer = req.headers.referrer || req.headers.referer
    // remove instance if it has, so that v.g. de.serlo.org becomes serlo.org
    referrer =
      referrer === 'serlo.org'
        ? 'serlo.org'
        : referrer?.slice(referrer.indexOf('.') + 1)

    if (process.env.ENVIRONMENT === 'production' && referrer !== 'serlo.org') {
      res.statusCode = 403
      res.end('Bots will not pass')
    }

    if (req.headers['x-kratos-key'] !== process.env.SERVER_KRATOS_SECRET) {
      res.statusCode = 401
      res.end('Kratos secret mismatch')
    }

    const { userId } = req.body as { userId: string }
    try {
      const kratosUser = (await kratos.adminGetIdentity(userId)).data
      const { username, email } = kratosUser.traits as {
        username: string
        email: string
      }
      const payload = {
        username,
        // we just need to store something, since the password in legacy DB is not going to be used anymore
        // storing the kratos id is just a good way of easily seeing this value in case we need it
        password: kratosUser.id,
        email,
      }
      legacyUserId = (
        (await DatabaseLayer.makeRequest('UserCreateMutation', payload)) as {
          userId: number
        }
      ).userId

      await kratos.adminUpdateIdentity(kratosUser.id, {
        schema_id: 'default',
        metadata_public: {
          legacy_id: legacyUserId,
        },
        traits: {
          username,
          email,
        },
        state: IdentityState.Active,
      })
      res.statusCode = 200
      res.end(
        JSON.stringify({
          status: 'success',
        })
      )
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error(error)

      res.statusCode = 400
    }
  }
}
