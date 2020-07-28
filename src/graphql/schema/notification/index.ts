import { Schema } from '../utils'
import { createCommentNotificationEventSchema } from './create-comment-notification-event'
import { createEntityNotificationSchema } from './create-entity-notification-event'
import { createThreadNotificationEventSchema } from './create-thread-notification-event'
import { resolvers } from './resolvers'
import { setThreadStateNotificationEventSchema } from './set-thread-state-notification-event'
import typeDefs from './types.graphql'

export * from './create-comment-notification-event'
export * from './create-entity-notification-event'
export * from './create-thread-notification-event'
export * from './set-thread-state-notification-event'
export * from './types'

const baseSchema = new Schema(resolvers, [typeDefs])

export const notificationSchema = Schema.merge(
  baseSchema,
  createCommentNotificationEventSchema,
  createEntityNotificationSchema,
  createThreadNotificationEventSchema,
  setThreadStateNotificationEventSchema
)
