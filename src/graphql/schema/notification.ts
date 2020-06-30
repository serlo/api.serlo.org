import { Schema } from './utils'
import { gql } from 'apollo-server'

export const notificationSchema = new Schema()

/**
 * type Notification
 */
export class Notification {
  // TODO: add relevant fields

  public constructor(payload: NotificationPayload) {
    // TODO: set fields
  }

  // TODO: probably needs a resolver for event that maps eventId to the actual event
  // public async event(...) see e.g. taxonomy-term.ts # parent
}

export interface NotificationPayload {
  // TODO: add fields, defined by the return stuff you expect from the legacy API
}

// notificationSchema.addTypeDef(gql`
//     type Notification {
//       # TODO: actual type for the GraphQL schema
//     }
// `)

/**
 * type Event
 */
export class Event {
  // TODO: similarly to Notification, needs resolvers for actor and object
}

export interface EventPayload {
  // TODO: add fields
}

// notificationSchema.addTypeDef(gql`
//     type Event {
//       # TODO: actual type for the GraphQL schema
//     }
// `)

/**
 * query notifications
 */
// notificationSchema.addQuery<unknown, {}, Notification[]>(
//   'notifications',
//   async (_parent, _args, { dataSources, user }) => {
//     // TODO: return a list of notifications
//     // approach:
//     // 0. check if user logged in
//     // 1. fetch notification payloads via data source
//     // 2. map over the payloads and create notifications
//     // 3. return that...
//   }
// )

// notificationSchema.addTypeDef(gql`
//     extend type Query {
//       notifications(): [Notification!]! {
//     }
// `)

/**
 * mutation setNotificationState
 */
// notificationSchema.addMutation<
//   unknown,
//   {
//     /* TODO: */
//   },
//   null
// >('setNotificationState', async (_parent, _args, { dataSources, user }) => {
//   // TODO:
//   // 0. check if user logged in
//   // 1. call the corresponding function on data source
// })

// notificationSchema.addTypeDef(gql`
//     extend type Mutation {
//       setNotificationState(
//         # TODO:
//       ): Boolean
//     }
// `)

// TODO: Later: _setNotifications
// TODO: Later: _setEvent
