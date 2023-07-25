import { ApolloServer } from '@apollo/server'
import type { OAuth2Api } from '@ory/client'

import { Environment } from '~/internals/environment'
import { Context } from '~/internals/graphql'
import { getGraphQLOptions } from '~/internals/server'
import { emptySwrQueue } from '~/internals/swr-queue'

export function createTestClient() {
  return new ApolloServer<Partial<Pick<Context, 'service' | 'userId'>>>({
    ...getGraphQLOptions(createTestEnvironment()),
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
