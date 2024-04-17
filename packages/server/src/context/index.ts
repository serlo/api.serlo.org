import { type Storage } from '@google-cloud/storage'

// import { type ModelDataSource } from '../internals/data-source'
// import { type SwrQueue } from '../internals/swr-queue'
import { type Cache } from './cache'
import { type Database } from '~/database'
import { Service } from './service'

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
  swrQueue: any
  service: Service
}
