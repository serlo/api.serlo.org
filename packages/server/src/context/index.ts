import { type Storage } from '@google-cloud/storage'

import { type Cache } from './cache'
import { Service } from './service'
import { SwrQueue } from './swr-queue'
import { type ModelDataSource } from '../internals/data-source'
import { type Database } from '~/database'

export interface Context {
  dataSources: {
    model: ModelDataSource
  }
  userId: number | null
  googleStorage: Storage
  database: Database
  cache: Cache
  swrQueue: SwrQueue
  service: Service
}
