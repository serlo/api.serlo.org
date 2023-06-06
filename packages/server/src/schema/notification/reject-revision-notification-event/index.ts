import { resolvers } from './resolvers'
import typeDefs from './types.graphql'
import { Schema } from '~/internals/graphql'

export const rejectRevisionNotificationEventSchema: Schema = {
  resolvers,
  typeDefs: [typeDefs],
}
