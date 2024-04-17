import { type Storage } from '@google-cloud/storage'

// import { type ModelDataSource } from '../internals/data-source'
import { type Cache } from './cache'
import { type Database } from '~/database'
import { Service } from './service'
import { SwrQueue } from './swr-queue'

export interface Context {
  // dataSources: {
  //  model: ModelDataSource
  //}
  userId: number | null
  googleStorage: Storage
  database: Database
  // swrQueue: SwrQueue
  dataSources: any
  cache: Cache
  swrQueue: SwrQueue
  service: Service
}
