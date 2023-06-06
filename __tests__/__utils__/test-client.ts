import type { OAuth2Api } from '@ory/hydra-client'
import { ApolloServer } from 'apollo-server'

import { Service } from '~/internals/authentication'
import { Environment } from '~/internals/environment'
import { Context } from '~/internals/graphql'
import { getGraphQLOptions } from '~/internals/server'
import { emptySwrQueue } from '~/internals/swr-queue'

export function createTestClient(
  args?: Partial<Pick<Context, 'service' | 'userId'>>
) {
  return new ApolloServer({
    ...getGraphQLOptions(createTestEnvironment()),
    context(): Pick<Context, 'service' | 'userId'> {
      return {
        service: args?.service ?? Service.SerloCloudflareWorker,
        userId: args?.userId ?? null,
      }
    },
  })
}

export function createTestEnvironment(): Environment {
  return {
    cache: global.cache,
    swrQueue: emptySwrQueue,
    authServices: {
      kratos: global.kratos,
      hydra: {} as unknown as OAuth2Api,
    },
  }
}
