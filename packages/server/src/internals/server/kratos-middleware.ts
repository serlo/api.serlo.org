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
import { Configuration, IdentityState, V0alpha2Api } from '@ory/kratos-client'
import cors from 'cors'
import { Express, RequestHandler } from 'express'

import { DatabaseLayer } from '~/model'

const basePath = '/kratos'

export function applyKratosMiddleware({ app }: { app: Express }) {
  // allow cors will be unnecessary if we do it server-side in frontend
  app.use(cors())

  if (!process.env.SERVER_KRATOS_HOST)
    throw new Error('Kratos Host is not defined')

  const kratos = new V0alpha2Api(
    new Configuration({
      basePath: process.env.SERVER_KRATOS_HOST,
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
    const { userId } = req.body as { userId: string }
    try {
      const kratosUser = (await kratos.adminGetIdentity(userId)).data
      const { username, email } = kratosUser.traits as {
        username: string
        email: string
      }
      const payload = {
        username,
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
      await kratos.adminDeleteIdentity(userId)

      if (legacyUserId) {
        await DatabaseLayer.makeRequest('UserDeleteBotsMutation', {
          botIds: [legacyUserId],
        })
      }

      res.statusCode = 400
      res.end(JSON.stringify(error))
    }
  }
}
