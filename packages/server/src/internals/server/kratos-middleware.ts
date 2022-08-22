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
import { AdminApi, Configuration as HydraConfig } from '@ory/hydra-client'
import { Express, RequestHandler } from 'express'

import { DatabaseLayer } from '~/model'

const basePath = '/kratos'

export function applyKratosMiddleware({ app }: { app: Express }) {
  if (!process.env.SERVER_KRATOS_HOST)
    // eslint-disable-next-line no-console
    console.error('Kratos Host is not defined')

  const kratos = new V0alpha2Api(
    new Configuration({
      basePath: process.env.SERVER_KRATOS_HOST,
    })
  )
  const hydra = new AdminApi(
    new HydraConfig({
      basePath: process.env.SERVER_HYDRA_HOST,
      ...(process.env.MOCK_TLS_TERMINATION
        ? {
            baseOptions: {
              headers: process.env.MOCK_TLS_TERMINATION
                ? 'X-Forwarded-Proto'
                : 'https',
            },
          }
        : {}),
    })
  )
  app.post(`${basePath}/register`, createKratosRegisterHandler(kratos))
  app.get(`${basePath}/hydra-login`, createHydraLoginHandler(kratos, hydra))
  app.get(`${basePath}/hydra-consent`, createHydraConsentHandler(kratos, hydra))
  app.get(`${basePath}/hydra-logout`, createHydraLogoutHandler(kratos, hydra))
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

function createHydraLoginHandler(
  kratos: V0alpha2Api,
  hydra: AdminApi
): RequestHandler {
  return async (req, res) => {
    const session = await kratos
      .toSession(undefined, String(req.header('cookie')))
      .then(({ data }) => data)
      .catch((error) => {
        res.status(500)
        res.send(error)
      })
    const query = req.query
    const challenge = String(query.login_challenge)
    if (!challenge) {
      res.status(400)
      res.send('Expected a login challenge to be set but received none.')
      return
    }

    if (session) {
      const userId = (session.identity.metadata_public as { legacy_id: number })
        .legacy_id
      hydra
        .getLoginRequest(challenge)
        .then(async () => {
          return await hydra
            .acceptLoginRequest(challenge, {
              subject: String(userId),
              context: session || undefined,
            })
            .then(({ data: body }) => {
              res.redirect(body.redirect_to)
            })
            .catch((error) => {
              res.status(500)
              res.send(error)
            })
        })
        .catch((error) => {
          res.status(500)
          res.send(error)
        })
    }
  }
}

function createHydraConsentHandler(
  kratos: V0alpha2Api,
  hydra: AdminApi
): RequestHandler {
  return async (req, res) => {
    const query = req.query

    const challenge = String(query.consent_challenge)
    if (!challenge) {
      res.status(400)
      res.send('Expected a consent challenge to be set but received none.')
      return
    }
    const session = await kratos
      .toSession(undefined, String(req.headers.cookie))
      .then(({ data }) => data)
      .catch((error) => {
        res.status(500)
        res.send(error)
      })
    if (session) {
      const userId = (session.identity.metadata_public as { legacy_id: number })
        .legacy_id
      const username = (session.identity.traits as { username: string })
        .username

      hydra
        .getConsentRequest(challenge)
        .then(async ({ data: body }) => {
          return await hydra
            .acceptConsentRequest(challenge, {
              grant_scope: body.requested_scope,

              grant_access_token_audience: body.requested_access_token_audience,

              session: {
                id_token: {
                  id: userId,
                  username,
                  // email? See https://github.com/serlo/serlo.org/blob/main/packages/public/server/src/module/Authentication/src/Controller/HydraConsentController.php#L74
                },
              },
            })
            .then(({ data: body }) => {
              res.redirect(body.redirect_to)
            })
            .catch((error) => {
              res.status(500)
              res.send(error)
            })
        })
        .catch((error) => {
          res.status(500)
          res.send(error)
        })
    }
  }
}

function createHydraLogoutHandler(
  kratos: V0alpha2Api,
  hydra: AdminApi
): RequestHandler {
  return (req, res) => {
    const query = req.query
    const challenge = String(query.logout_challenge)
    if (!challenge) {
      res.status(400)
      res.send('Expected a logout challenge to be set but received none.')
      return
    }
    hydra
      .getLogoutRequest(challenge)
      .then(async () => {
        return await hydra
          .acceptLogoutRequest(challenge)
          .then(({ data: body }) => {
            res.redirect(body.redirect_to)
          })
          .catch((error) => {
            res.status(500)
            res.send(error)
          })
      })
      .catch((error) => {
        res.status(500)
        res.send(error)
      })
  }
}
