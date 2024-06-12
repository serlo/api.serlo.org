import { IdentityStateEnum } from '@ory/client'
import * as Sentry from '@sentry/node'
import { randomBytes } from 'crypto'
import express, { Express, Request, Response, RequestHandler } from 'express'
import * as t from 'io-ts'
import { JwtPayload, decode } from 'jsonwebtoken'
import { type Pool } from 'mysql2/promise'
import { validate as uuidValidate } from 'uuid'

import { Identity, Kratos } from '~/context/auth-services'
import { Database } from '~/database'
import { captureErrorEvent } from '~/error-event'

const basePath = '/kratos'

export function applyKratosMiddleware({
  app,
  kratos,
  pool,
}: {
  app: Express
  kratos: Kratos
  pool: Pool
}) {
  const database = new Database(pool)
  app.post(
    `${basePath}/register`,
    createKratosRegisterHandler(kratos, database),
  )
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

function createKratosRegisterHandler(
  kratos: Kratos,
  database: Database,
): RequestHandler {
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
        const legacyUserId = await createLegacyUser(
          account.traits.username,
          account.traits.email,
          database,
        )

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

async function createLegacyUser(
  username: string,
  email: string,
  database: Database,
) {
  if (username.length > 32 || username.trim() === '') {
    throw new Error(
      "Username can't be longer than 32 characters and can't be empty.",
    )
  }
  if (email.length > 254) {
    throw new Error("Email can't be longer than 254 characters.")
  }

  const transaction = await database.beginTransaction()

  try {
    const { insertId: userId } = await database.mutate(
      `INSERT INTO uuid (discriminator) VALUES (?)`,
      ['user'],
    )

    await database.mutate(
      `INSERT INTO user (id, email, username, password, date, token) VALUES (?, ?, ?, ?, NOW(), ?)`,
      // we just need to store something in password and token
      [userId, email, username, username, username],
    )

    const defaultRoleId = 2
    await database.mutate(
      `INSERT INTO role_user (user_id, role_id) VALUES (?, ?)`,
      [userId, defaultRoleId],
    )

    await transaction.commit()

    return userId
  } catch (error) {
    await transaction.rollback()
    throw error
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
      response.status(500).send('Internal Server Error (Illegal state)'),
    )
  }
}
