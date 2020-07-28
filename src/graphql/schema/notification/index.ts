import { Schema } from '../utils'
import { createThreadNotificationEventSchema } from './create-thread-notification-event'
import { resolvers } from './resolvers'
import typeDefs from './types.graphql'

export * from './create-thread-notification-event'
export * from './types'

const baseSchema = new Schema(resolvers, [typeDefs])

export const notificationSchema = Schema.merge(
  baseSchema,
  createThreadNotificationEventSchema
)
