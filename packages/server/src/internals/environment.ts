import { AuthServices } from './authentication'
import { Cache } from './cache'
import { SwrQueue } from './swr-queue'

export interface Environment {
  cache: Cache
  swrQueue: SwrQueue
  authServices: AuthServices
}
