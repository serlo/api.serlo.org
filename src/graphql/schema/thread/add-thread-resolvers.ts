import { gql } from 'apollo-server'

import { LegacyUuid } from '../legacy-uuid'
import { Schema } from '../utils'
import { Thread } from './schema'

export function addThreadResolvers<E extends LegacyUuid>({
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
export interface ThreadResolversPayload<E extends LegacyUuid> {
  schema: Schema
  type: string
}
