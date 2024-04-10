import { type Storage } from '@google-cloud/storage'
import { type Connection } from 'mysql2/promise'

import { Service } from '../authentication'
import { ModelDataSource } from '../data-source'

export interface Context {
  dataSources: {
    model: ModelDataSource
  }
  service: Service
  userId: number | null
  googleStorage: Storage
  database: Connection
}
