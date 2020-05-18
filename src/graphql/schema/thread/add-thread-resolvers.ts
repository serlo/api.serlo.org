import { gql } from 'apollo-server'

import { Schema } from '../utils'
import { Uuid } from '../uuid'
import { Thread } from './schema'

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
      const threadIds = await dataSources.comments.getThreads(object.id)
      return Promise.all(
        threadIds.map((id) => {
          return dataSources.comments.getThread(id).then((payload) => {
            return new Thread(payload)
          })
        })
      )
    }
  )
}
export interface ThreadResolversPayload<E extends Uuid> {
  schema: Schema
  type: string
}
