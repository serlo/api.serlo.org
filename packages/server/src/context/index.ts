import { type Storage } from '@google-cloud/storage'

// import { type Service } from '../internals/authentication'
// import { type ModelDataSource } from '../internals/data-source'
// import { type SwrQueue } from '../internals/swr-queue'
import { type Cache } from './cache'
import { type Database } from '~/database'

export interface Context {
  // dataSources: {
  //  model: ModelDataSource
  //}
  // service: Service
  userId: number | null
  googleStorage: Storage
  database: Database
  // swrQueue: SwrQueue
  dataSources: any
  cache: Cache
  swrQueue: any
  service: any
}
