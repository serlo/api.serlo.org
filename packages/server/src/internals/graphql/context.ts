import { type Storage } from '@google-cloud/storage'

import { type Service } from '../authentication'
import { type Cache } from '../cache'
import { type ModelDataSource } from '../data-source'
import { type SwrQueue } from '../swr-queue'
import { type Database } from '~/database'

export interface Context {
  dataSources: {
    model: ModelDataSource
  }
  service: Service
  userId: number | null
  googleStorage: Storage
  database: Database
  cache: Cache
  swrQueue: SwrQueue
}
