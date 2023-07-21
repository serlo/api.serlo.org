import { GraphQLError } from 'graphql'
import { decode, JsonWebTokenError, verify } from 'jsonwebtoken'

import { Service } from './service'
import { Context } from '~/internals/graphql'

export async function handleAuthentication(
  authorizationHeader: string,
  userAuthenticator: () => Promise<number | null>,
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
    return new GraphQLError('Invalid authorization header', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    })
  }
}

function validateServiceToken(token: string): Service {
  const serviceTokenParts = token.split('=')
  if (serviceTokenParts.length !== 2 || serviceTokenParts[0] !== 'Service') {
    throw new GraphQLError(
      'Invalid authorization header: invalid service token part',
      {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      },
    )
  }
  const serviceToken = serviceTokenParts[1]
  const { service, error } = validateJwt(serviceToken)

  if (error || service === null) {
    throw new GraphQLError(
      `Invalid service token${error ? `: ${error.message}` : ''}`,
      {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      },
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
        case Service.NotificationEmailService:
          return process.env.SERVER_SERLO_NOTIFICATION_EMAIL_SERVICE_SECRET
      }
    }
  }
}
