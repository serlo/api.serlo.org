import { AuthServices } from './authentication'
import { SwrQueue } from '~/context/swr-queue'
import { Cache } from '~/context/cache'

export interface Environment {
  cache: Cache
  swrQueue: SwrQueue
  authServices: AuthServices
}
