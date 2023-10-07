import { Session } from '@ory/client'
import * as t from 'io-ts'

import { ForbiddenError } from '~/errors'
import { captureErrorEvent } from '~/internals/error-event'
import {
  Mutations,
  createNamespace,
  assertUserIsAuthenticated,
} from '~/internals/graphql'

const TraitsDecoder = t.type({ username: t.string, email: t.string })

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
          'OAuth: You can only accept login for yourself',
        )
      }

      const { hydra } = dataSources.model.authServices

      return await hydra
        .getOAuth2LoginRequest({ loginChallenge: challenge })
        .then(async () => {
          return await hydra
            .acceptOAuth2LoginRequest({
              loginChallenge: challenge,
              acceptOAuth2LoginRequest: {
                subject: String(legacyId),
                context: session as Session,
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
                'Something went wrong while accepting the login request',
              )
            })
        })
        .catch((error: Error) => {
          captureErrorEvent({
            error,
            errorContext: { challenge },
          })
          throw new Error(
            'Something went wrong while getting the login request',
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
          'OAuth: You can only accept consent for yourself',
        )
      }

      const traits = session.identity?.traits as unknown

      if (!TraitsDecoder.is(traits)) {
        throw new ForbiddenError('session has illegal state')
      }

      const { username, email } = traits
      const { hydra } = dataSources.model.authServices

      return hydra
        .getOAuth2ConsentRequest({ consentChallenge: challenge })
        .then(async ({ data: body }) => {
          const scopes = body.requested_scope

          return await hydra
            .acceptOAuth2ConsentRequest({
              consentChallenge: challenge,
              acceptOAuth2ConsentRequest: {
                grant_scope: body.requested_scope,

                grant_access_token_audience:
                  body.requested_access_token_audience,

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
                'Something went wrong while accepting the consent request',
              )
            })
        })
        .catch((error: Error) => {
          captureErrorEvent({
            error,
            errorContext: { challenge },
          })
          throw new Error(
            'Something went wrong while getting the consent request',
          )
        })
    },
    async acceptLogout(_parent, { challenge }, { dataSources }) {
      const { hydra } = dataSources.model.authServices
      return await hydra
        .getOAuth2LogoutRequest({ logoutChallenge: challenge })
        .then(async () => {
          return await hydra
            .acceptOAuth2LogoutRequest({ logoutChallenge: challenge })
            .then(({ data: body }) => {
              return { success: true, redirectUri: body.redirect_to }
            })
            .catch((error: Error) => {
              captureErrorEvent({
                error,
                errorContext: { challenge },
              })
              throw new Error(
                'Something went wrong while accepting the logout request',
              )
            })
        })
        .catch((error: Error) => {
          captureErrorEvent({
            error,
            errorContext: { challenge },
          })
          throw new Error(
            'Something went wrong while getting the logout request',
          )
        })
    },
  },
}
