import { IdentityStateEnum } from '@ory/client'
import * as Sentry from '@sentry/node'
import express, { Express, Request, Response, RequestHandler } from 'express'
import * as t from 'io-ts'
import { JwtPayload, decode } from 'jsonwebtoken'
import { validate as uuidValidate } from 'uuid'

import { Identity, Kratos } from '~/context/auth-services'
import { captureErrorEvent } from '~/error-event'
import { createRequest } from '~/internals/data-source-helper'
import { DatabaseLayer } from '~/model'

const basePath = '/kratos'

const createLegacyUser = createRequest({
  type: 'UserCreateMutation',
  decoder: DatabaseLayer.getDecoderFor('UserCreateMutation'),
  async getCurrentValue(payload: DatabaseLayer.Payload<'UserCreateMutation'>) {
    return DatabaseLayer.makeRequest('UserCreateMutation', payload)
  },
})

export function applyKratosMiddleware({
  app,
  kratos,
}: {
  app: Express
  kratos: Kratos
}) {
  app.post(`${basePath}/register`, createKratosRegisterHandler(kratos))
  app.post(`${basePath}/updateLastLogin`, updateLastLoginHandler(kratos))
  app.use(express.urlencoded({ extended: true }))

  if (
    process.env.ENVIRONMENT === 'local' ||
    process.env.ENVIRONMENT === 'staging'
  ) {
    app.post(
      `${basePath}/single-logout`,
      createKratosRevokeSessionsHandler(kratos, 'nbp'),
    )
    app.post(
      `${basePath}/single-logout-vidis`,
      createKratosRevokeSessionsHandler(kratos, 'vidis'),
    )
  }
  return basePath
}

function createKratosRegisterHandler(kratos: Kratos): RequestHandler {
  async function handleRequest(request: Request, response: Response) {
    // TODO: delete after debugging
    Sentry.captureMessage(`/kratos/register reached`, {
      contexts: {
        request: {
          time: new Date().toISOString(),
          body: request.body,
        },
      },
    })
    if (request.headers['x-kratos-key'] !== process.env.SERVER_KRATOS_SECRET) {
      captureErrorEvent({
        error: new Error('Unauthorized attempt to create user'),
        errorContext: { request },
      })
      response.statusCode = 401
      response.end('Kratos secret mismatch')
      return
    }

    try {
      const unsyncedAccounts = await kratos.db.executeSingleQuery<Identity>({
        query:
          "SELECT * FROM identities WHERE (metadata_public->'legacy_id') IS NULL",
      })

      if (!unsyncedAccounts) {
        response.json({ status: 'no account to sync' }).end()

        // TODO: delete after debugging
        Sentry.captureMessage(`/kratos/register processed`, {
          contexts: {
            request: {
              time: new Date().toISOString(),
              body: request.body,
            },
          },
        })
        return
      }

      for (const account of unsyncedAccounts) {
        const { userId: legacyUserId } = await createLegacyUser({
          username: account.traits.username,
          // we just need to store something, since the password in legacy DB is not going to be used anymore
          // storing the kratos id is just a good way of easily seeing this value in case we need it
          password: account.id,
          email: account.traits.email,
        })

        await kratos.admin.updateIdentity({
          id: account.id,
          updateIdentityBody: {
            ...account,
            schema_id: 'default',
            metadata_public: {
              legacy_id: legacyUserId,
            },
            state: IdentityStateEnum.Active,
          },
        })
      }

      response.json({ status: 'success' }).end()

      // TODO: delete after debugging
      Sentry.captureMessage(`/kratos/register processed`, {
        contexts: {
          request: {
            time: new Date().toISOString(),
            body: request.body,
          },
        },
      })
    } catch (error: unknown) {
      captureErrorEvent({
        error: new Error('Could not synchronize user registration'),
        errorContext: { error },
      })

      response.statusCode = 500
      return response.end('Internal error in after hook')
    }
  }

  // See https://stackoverflow.com/a/71912991
  return (request, response) => {
    handleRequest(request, response).catch(() =>
      response.status(500).send('Internal Server Error (Illegal state)'),
    )
  }
}

function createKratosRevokeSessionsHandler(
  kratos: Kratos,
  provider: 'nbp' | 'vidis',
): RequestHandler {
  function sendErrorResponse(response: Response, message: string) {
    // see https://openid.net/specs/openid-connect-backchannel-1_0.html#BCResponse
    response.set('Cache-Control', 'no-store').status(400).send(message)
  }

  async function handleRequest(request: Request, response: Response) {
    if (!t.type({ logout_token: t.string }).is(request.body)) {
      sendErrorResponse(response, 'no logout_token provided')
      return
    }

    try {
      // TODO: implement validation of jwt token
      const { sub } = decode(request.body.logout_token) as JwtPayload

      if (!sub || !uuidValidate(sub)) {
        sendErrorResponse(response, 'invalid token or sub info missing')
        return
      }

      const id = await kratos.db.getIdByCredentialIdentifier(
        `${provider}:${sub}`,
      )

      if (!id) {
        sendErrorResponse(response, 'user not found or not valid')
        return
      }

      await kratos.admin.deleteIdentitySessions({ id })
      response
        .set('Cache-Control', 'no-store')
        .json({ status: 'success' })
        .send()
      return
    } catch (error: unknown) {
      captureErrorEvent({
        error: new Error('Could not revoke sessions of user'),
        errorContext: { error },
      })

      sendErrorResponse(
        response,
        'Internal error while attempting single logout',
      )
      return
    }
  }
  return (request, response) => {
    handleRequest(request, response).catch(() =>
      sendErrorResponse(response, 'Internal Server Error (Illegal state)'),
    )
  }
}

function updateLastLoginHandler(kratos: Kratos): RequestHandler {
  async function handleRequest(request: Request, response: Response) {
    if (!t.type({ userId: t.string }).is(request.body)) {
      response.statusCode = 400
      response.end('Valid identity id has to be provided')
      return
    }

    const { userId } = request.body

    try {
      const kratosUser = (await kratos.admin.getIdentity({ id: userId })).data

      await kratos.admin.updateIdentity({
        id: kratosUser.id,
        updateIdentityBody: {
          schema_id: 'default',
          metadata_public: {
            ...kratosUser.metadata_public,
            lastLogin: new Date(),
          },
          metadata_admin: kratosUser.metadata_admin,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          traits: kratosUser.traits,
          state: IdentityStateEnum.Active,
        },
      })

      response.json({ status: 'success' }).end()
    } catch (error: unknown) {
      captureErrorEvent({
        error: new Error('Could not synchronize lastLogin date'),
        errorContext: { userId, error },
      })

      response.statusCode = 500
      return response.end('Internal error in after hook')
    }
  }

  // See https://stackoverflow.com/a/71912991
  return (request, response) => {
    handleRequest(request, response).catch(() =>
      response.status(500).send('Internal Server Error (Illegal state=)'),
    )
  }
}
