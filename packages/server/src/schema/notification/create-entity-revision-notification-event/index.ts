import { resolvers } from './resolvers'
import typeDefs from './types.graphql'
import { Schema } from '~/internals/graphql'

export const createEntityRevisionNotificationEventSchema: Schema = {
  resolvers,
  typeDefs: [typeDefs],
}
