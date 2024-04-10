import { type Storage } from '@google-cloud/storage'

import { Service } from '../authentication'
import { ModelDataSource } from '../data-source'
import { type Database } from '~/database'

export interface Context {
  dataSources: {
    model: ModelDataSource
  }
  service: Service
  userId: number | null
  googleStorage: Storage
  database: Database
}
