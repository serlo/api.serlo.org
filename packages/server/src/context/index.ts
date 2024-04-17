import { type Storage } from '@google-cloud/storage'

// import { type Service } from '../internals/authentication'
// import { type ModelDataSource } from '../internals/data-source'
// import { type SwrQueue } from '../internals/swr-queue'
import { type Database } from '~/database'
import { type Cache } from './cache'

export interface Context {
  // dataSources: {
  //  model: ModelDataSource
  //}
  // service: Service
  userId: number | null
  googleStorage: Storage
  database: Database
  // cache: Cache
  // swrQueue: SwrQueue
  dataSources: any
  cache: any
  swrQueue: any
  service: any
}


