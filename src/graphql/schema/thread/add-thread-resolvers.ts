import { gql } from 'apollo-server'

import { Schema } from '../utils'
import { Uuid } from '../uuid'
import { Thread, ThreadPayload } from './schema'

export function addThreadResolvers<E extends Uuid>({
  schema,
  type,
}: ThreadResolversPayload<E>) {
  schema.addTypeDef(gql`
        extend type ${type} {
          threads: [Thread!]!
        }
      `)
  schema.addResolver<E, unknown, Thread[]>(
    type,
    'threads',
    async (object, _args, { dataSources }) => {
      const threadsData = await dataSources.comments.getThreads(object.id)
      return threadsData.map((payload: ThreadPayload) => {
        return new Thread(payload)
      })
    }
  )
}
export interface ThreadResolversPayload<E extends Uuid> {
  schema: Schema
  type: string
}
