/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import {
  ApolloServerExpressConfig,
  AuthenticationError,
} from 'apollo-server-express'
import { decode, JsonWebTokenError, verify } from 'jsonwebtoken'
import fetch from 'node-fetch'
import { env } from 'process'
import { URLSearchParams } from 'url'

import { GoogleSheetApi } from './data-sources/google-spreadsheet'
import { SerloDataSource } from './data-sources/serlo'
import { Environment } from './environment'
import { schema } from './schema'
import { Context, Service } from './schema/types'

export function getGraphQLOptions(
  environment: Environment
): ApolloServerExpressConfig {
  return {
    typeDefs: schema.typeDefs,
    resolvers: schema.resolvers,
    // Needed for playground
    introspection: true,
    // We add the playground via express middleware in src/index.ts
    playground: false,
    dataSources() {
      return {
        serlo: new SerloDataSource(environment),
        googleSheetApi: new GoogleSheetApi({
          apiKey: env.GOOGLE_API_KEY,
          environment,
        }),
      }
    },
    context({ req }): Promise<Pick<Context, 'service' | 'user'>> {
      const authorizationHeader = req.headers.authorization
      if (!authorizationHeader) {
        throw new AuthenticationError('Invalid authorization header')
      }
      return handleAuthentication(authorizationHeader, async (token) => {
        if (process.env.HYDRA_HOST === undefined) return null
        const params = new URLSearchParams()
        params.append('token', token)
        const resp = await fetch(
          `${process.env.HYDRA_HOST}/oauth2/introspect`,
          {
            method: 'post',
            body: params,
            headers: {
              'X-Forwarded-Proto': 'https',
            },
          }
        )
        const { active, sub } = (await resp.json()) as {
          active: boolean
          sub: string
        }
        return active ? parseInt(sub, 10) : null
      })
    },
  }
}

export async function handleAuthentication(
  authorizationHeader: string,
  userTokenValidator: (token: string) => Promise<number | null>
): Promise<{ service: Service; user: number | null }> {
  const parts = authorizationHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Serlo') {
    throw invalid()
  }

  const tokenParts = parts[1].split(';')
  if (tokenParts.length === 1) {
    const service = validateServiceToken(tokenParts[0])
    return { service, user: null }
  } else if (tokenParts.length === 2) {
    const service = validateServiceToken(tokenParts[0])
    const user = await validateUserToken(tokenParts[1], userTokenValidator)
    return {
      service,
      user,
    }
  } else {
    throw invalid()
  }

  function invalid() {
    return new AuthenticationError('Invalid authorization header')
  }
}

function validateServiceToken(token: string): Service {
  const serviceTokenParts = token.split('=')
  if (serviceTokenParts.length !== 2 || serviceTokenParts[0] !== 'Service') {
    throw new AuthenticationError(
      'Invalid authorization header: invalid service token part'
    )
  }
  const serviceToken = serviceTokenParts[1]
  const { service, error } = validateJwt(serviceToken)

  if (error || service === null) {
    throw new AuthenticationError(
      `Invalid service token${error ? `: ${error.message}` : ''}`
    )
  }
  return service

  function validateJwt(
    token: string
  ): { service: Service | null; error?: JsonWebTokenError } {
    try {
      const decoded = decode(token)
      if (!decoded || typeof decoded !== 'object') return unauthenticated()

      const service = decoded.iss as Service
      const secret = getSecret(service)
      verify(token, secret, {
        audience: 'api.serlo.org',
      })

      return {
        service,
      }
    } catch (e) {
      return unauthenticated(e)
    }

    function unauthenticated(error?: JsonWebTokenError) {
      return { service: null, error }
    }

    function getSecret(service: Service) {
      switch (service) {
        case Service.Playground:
          return process.env.PLAYGROUND_SECRET
        case Service.Serlo:
          return process.env.SERLO_ORG_SECRET
        case Service.SerloCloudflareWorker:
          return process.env.SERLO_CLOUDFLARE_WORKER_SECRET
      }
    }
  }
}

async function validateUserToken(
  token: string,
  validateToken: (token: string) => Promise<number | null>
): Promise<number | null> {
  const userTokenParts = token.split('=')
  if (userTokenParts.length !== 2 || userTokenParts[0] !== 'User') {
    throw new AuthenticationError('Invalid authorization header')
  }
  const userToken = userTokenParts[1]
  return await validateToken(userToken)
}
