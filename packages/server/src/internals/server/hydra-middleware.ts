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
import { V0alpha2Api } from '@ory/client'
import { AdminApi, Configuration as HydraConfig } from '@ory/hydra-client'
import { Express, RequestHandler } from 'express'

import { publicKratos } from '~/internals/kratos'

const basePath = '/hydra'

export function applyHydraMiddleware({ app }: { app: Express }) {
  const hydra = new AdminApi(
    new HydraConfig({
      basePath: process.env.SERVER_HYDRA_HOST,
      baseOptions: {
        headers: { 'X-Forwarded-Proto': 'https' },
      },
    })
  )

  app.get(`${basePath}/login`, createHydraLoginHandler({ publicKratos, hydra }))
  app.get(
    `${basePath}/consent`,
    createHydraConsentHandler({ publicKratos, hydra })
  )
  app.get(`${basePath}/logout`, createHydraLogoutHandler(hydra))
  return basePath
}

function createHydraLoginHandler({
  publicKratos,
  hydra,
}: {
  publicKratos: V0alpha2Api
  hydra: AdminApi
}): RequestHandler {
  return async (req, res) => {
    const session = await publicKratos
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
              remember: true,
              remember_for: 0,
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

function createHydraConsentHandler({
  publicKratos,
  hydra,
}: {
  publicKratos: V0alpha2Api
  hydra: AdminApi
}): RequestHandler {
  return async (req, res) => {
    const query = req.query

    const challenge = String(query.consent_challenge)
    if (!challenge) {
      res.status(400)
      res.send('Expected a consent challenge to be set but received none.')
      return
    }
    const session = await publicKratos
      .toSession(undefined, String(req.headers.cookie))
      .then(({ data }) => data)
      .catch((error) => {
        res.status(500)
        res.send(error)
      })
    if (session) {
      // when the time comes, change to session.identity.id
      const userId = (session.identity.metadata_public as { legacy_id: number })
        .legacy_id
      const { username, email } = session.identity.traits as {
        username: string
        email: string
      }

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
                  email,
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

function createHydraLogoutHandler(hydra: AdminApi): RequestHandler {
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
