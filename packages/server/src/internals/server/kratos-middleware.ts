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
import { Configuration, V0alpha2Api } from '@ory/kratos-client'
import { Express, RequestHandler } from 'express'

import { DatabaseLayer } from '~/model'

const basePath = '/kratos'

export function applyKratosMiddleware({ app }: { app: Express }) {
  app.post(`${basePath}/register`, createKratosRegisterEndpoint())
  return basePath
}

const kratos = new V0alpha2Api(
  new Configuration({
    basePath: `http://127.0.0.1:4434`,
  })
)

function createKratosRegisterEndpoint(): RequestHandler {
  return async (req, res) => {
    const { username, password, email } = req.body as {
      username: string
      password: string
      email: string
    }

    const newUser = {
      traits: {
        username,
        email,
      },
      credentials: {
        password: {
          config: {
            password,
          },
        },
      },
    }
    const user = (await kratos.adminCreateIdentity(newUser)) as {
      data: { id: string }
    }

    const userId = (
      await DatabaseLayer.makeRequest('UserCreateMutation', {
        username,
        password: user.data.id,
        email,
      })
    ).userId

    await kratos.adminUpdateIdentity(user.data.id, {
      metadata_public: {
        legacy_id: userId,
      },
    })
    res.statusCode = 200
    res.end(
      JSON.stringify({
        status: 'success',
      })
    )
  }
}
