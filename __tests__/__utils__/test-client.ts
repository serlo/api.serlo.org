import type { OAuth2Api } from '@ory/client'

import { Environment } from '~/internals/environment'
import { emptySwrQueue } from '~/internals/swr-queue'

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
