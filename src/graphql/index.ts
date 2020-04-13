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

import { SerloDataSource } from './data-sources/serlo'
import { Environment } from './environment'
import { schema } from './schema'
import { Service } from './schema/types'

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
      }
    },
    context({ req }) {
      const authorizationHeader = req.headers.authorization
      if (!authorizationHeader) {
        throw new AuthenticationError('Invalid authorization header')
      }
      return handleAuthentication(authorizationHeader)
    },
  }
}

export function handleAuthentication(
  authorizationHeader: string
): { service: Service } {
  const parts = authorizationHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Serlo') {
    throw invalid()
  }
  const serviceTokenParts = parts[1].split('=')
  if (serviceTokenParts.length !== 2 || serviceTokenParts[0] !== 'Service') {
    throw invalid()
  }
  const serviceToken = serviceTokenParts[1]
  const { service, error } = validateToken(serviceToken)

  if (error || service === null) {
    throw new AuthenticationError(
      `Invalid token${error ? `: ${error.message}` : ''}`
    )
  }
  return { service }

  function invalid() {
    return new AuthenticationError('Invalid authorization header')
  }
}

export function validateToken(
  token: string
): { service: Service | null; error?: JsonWebTokenError } {
  try {
    const decoded = decode(token)
    if (!decoded || typeof decoded !== 'object') return unauthenticated()

    const secret = getSecret(decoded.iss)
    verify(token, secret, {
      audience: 'api.serlo.org',
    })

    return {
      service: decoded.iss,
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
        return process.env.PLAYGROUND_SECRET!
      case Service.Serlo:
        return process.env.SERLO_ORG_SECRET!
      case Service.SerloCloudflareWorker:
        return process.env.SERLO_CLOUDFLARE_WORKER_SECRET!
    }
  }
}
