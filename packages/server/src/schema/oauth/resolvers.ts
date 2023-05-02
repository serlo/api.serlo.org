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

import { Session } from '@ory/client'
import { ForbiddenError } from 'apollo-server'

import { captureErrorEvent } from '~/internals/error-event'
import {
  Mutations,
  createNamespace,
  assertUserIsAuthenticated,
} from '~/internals/graphql'

export const resolvers: Mutations<'oauth'> = {
  Mutation: {
    oauth: createNamespace(),
  },
  OauthMutation: {
    async acceptLogin(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const { challenge, session } = input

      const legacyId = (
        session as { identity: { metadata_public: { legacy_id: number } } }
      ).identity.metadata_public.legacy_id

      if (legacyId !== userId) {
        throw new ForbiddenError(
          'OAuth: You can only accept login for yourself'
        )
      }

      const { hydra } = dataSources.model.authServices

      return await hydra
        .getOAuth2LoginRequest(challenge)
        .then(async () => {
          return await hydra
            .acceptOAuth2LoginRequest(challenge, {
              subject: String(legacyId),
              context: session as Session,
            })
            .then(({ data: body }) => {
              return { success: true, redirectUri: body.redirect_to }
            })
            .catch((error: Error) => {
              captureErrorEvent({
                error,
                errorContext: { challenge },
              })
              throw new Error(
                'Something went wrong while accepting the login request'
              )
            })
        })
        .catch((error: Error) => {
          captureErrorEvent({
            error,
            errorContext: { challenge },
          })
          throw new Error(
            'Something went wrong while getting the login request'
          )
        })
    },
    acceptConsent(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const { challenge, session } = input as {
        challenge: string
        session: Session
      }

      const legacyId = (
        session as { identity: { metadata_public: { legacy_id: number } } }
      ).identity.metadata_public.legacy_id

      if (legacyId !== userId) {
        throw new ForbiddenError(
          'OAuth: You can only accept consent for yourself'
        )
      }

      const { username, email } = session.identity.traits as {
        username: string
        email: string
      }
      const { hydra } = dataSources.model.authServices

      return hydra
        .getOAuth2ConsentRequest(challenge)
        .then(async ({ data: body }) => {
          const scopes = body.requested_scope

          return await hydra
            .acceptOAuth2ConsentRequest(challenge, {
              grant_scope: body.requested_scope,

              grant_access_token_audience: body.requested_access_token_audience,

              session: {
                id_token: {
                  id: legacyId,
                  username,
                  ...(scopes?.includes('email')
                    ? {
                        email,
                        email_verified: true,
                      }
                    : {}),
                },
              },
            })
            .then(({ data: body }) => {
              return { success: true, redirectUri: body.redirect_to }
            })
            .catch((error: Error) => {
              captureErrorEvent({
                error,
                errorContext: { challenge },
              })
              throw new Error(
                'Something went wrong while accepting the consent request'
              )
            })
        })
        .catch((error: Error) => {
          captureErrorEvent({
            error,
            errorContext: { challenge },
          })
          throw new Error(
            'Something went wrong while getting the consent request'
          )
        })
    },
    async acceptLogout(_parent, { challenge }, { dataSources }) {
      const { hydra } = dataSources.model.authServices
      return await hydra
        .getOAuth2LogoutRequest(challenge)
        .then(async () => {
          return await hydra
            .acceptOAuth2LogoutRequest(challenge)
            .then(({ data: body }) => {
              return { success: true, redirectUri: body.redirect_to }
            })
            .catch((error: Error) => {
              captureErrorEvent({
                error,
                errorContext: { challenge },
              })
              throw new Error(
                'Something went wrong while accepting the logout request'
              )
            })
        })
        .catch((error: Error) => {
          captureErrorEvent({
            error,
            errorContext: { challenge },
          })
          throw new Error(
            'Something went wrong while getting the logout request'
          )
        })
    },
  },
}
