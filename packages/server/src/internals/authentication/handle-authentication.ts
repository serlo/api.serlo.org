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
import { AuthenticationError } from 'apollo-server-express'
import { decode, JsonWebTokenError, verify } from 'jsonwebtoken'

import { Service } from './service'
import { Context } from '~/internals/graphql'

export async function handleAuthentication(
  authorizationHeader: string,
  userAuthenticator: () => Promise<number | null>
): Promise<Pick<Context, 'service' | 'userId'>> {
  const parts = authorizationHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Serlo') {
    throw invalid()
  }

  const tokenParts = parts[1].split(';')
  if (tokenParts.length < 2) {
    const service = validateServiceToken(tokenParts[0])
    const userId = await userAuthenticator()
    return { service, userId }
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

  function validateJwt(token: string): {
    service: Service | null
    error?: JsonWebTokenError
  } {
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
      return unauthenticated(e instanceof JsonWebTokenError ? e : undefined)
    }

    function unauthenticated(error?: JsonWebTokenError) {
      return { service: null, error }
    }

    function getSecret(service: Service) {
      switch (service) {
        case Service.Serlo:
          return process.env.SERLO_ORG_SECRET
        case Service.SerloCloudflareWorker:
          return process.env.SERVER_SERLO_CLOUDFLARE_WORKER_SECRET
        case Service.SerloCacheWorker:
          return process.env.SERVER_SERLO_CACHE_WORKER_SECRET
      }
    }
  }
}
