import { type Storage } from '@google-cloud/storage'

import { AuthServices } from './auth-services'
import { type Cache } from './cache'
import { Service } from './service'
import { SwrQueue } from './swr-queue'
import { type ModelDataSource } from '../internals/data-source'
import { type Database } from '~/database'
import { Timer } from '~/timer'

export interface Context {
  authServices: AuthServices
  dataSources: {
    model: ModelDataSource
  }
  userId: number | null
  googleStorage: Storage
  database: Database
  cache: Cache
  swrQueue: SwrQueue
  service: Service
  timer: Timer
}
