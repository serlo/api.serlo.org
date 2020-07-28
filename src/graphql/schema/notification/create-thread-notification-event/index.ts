import { Schema } from '../../utils'
import { resolvers } from './resolvers'
import typeDefs from './types.graphql'

export * from './types'

export const createThreadNotificationEventSchema = new Schema(resolvers, [
  typeDefs,
])
