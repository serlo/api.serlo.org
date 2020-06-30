import { Service, Context } from './types'
import { Schema, requestsOnlyFields } from './utils'
import { gql, AuthenticationError } from 'apollo-server'

import { Instance } from './instance'
import { User } from './uuid/user'
import { GraphQLResolveInfo, print } from 'graphql'
import { resolveAbstractUuid } from './uuid'
import { Uuid } from './uuid/abstract-uuid'

export const notificationSchema = new Schema()

/**
 * type Notification
 */
export class Notification {
  // TODO: add relevant fields
  public id: number
  public unread: boolean
  public eventId: number

  public constructor(payload: NotificationPayload) {
    // TODO: set fields
    this.id = payload.eventId
    this.unread = payload.unread
    this.eventId = payload.eventId
  }

  public async event(
    __args: undefined,
    { dataSources }: Context,
    info: GraphQLResolveInfo
  ) {
    if (!this.eventId) return null
    const partialEvent = { id: this.eventId }
    if (requestsOnlyFields('NotificationEvent', ['id'], info)) {
      return partialEvent
    }
    const data = await dataSources.serlo.getNotificationEvent(partialEvent)
    return new NotificationEvent(data)
  }

  // TODO: probably needs a resolver for event that maps eventId to the actual event
  // public async event(...) see e.g. taxonomy-term.ts # parent
}

export interface NotificationsPayload {
  notifications: NotificationPayload[]
  userId: number
}

export interface NotificationPayload {
  // TODO: add fields, defined by the return stuff you expect from the legacy API
  id: number
  unread: boolean
  eventId: number
}

notificationSchema.addTypeDef(gql`
  type Notification {
    # TODO: actual type for the GraphQL schema
    id: Int!
    unread: Boolean
    event: NotificationEvent!
  }
`)

/**
 * type NotificationEvent
 */
export class NotificationEvent {
  // TODO: similarly to Notification, needs resolvers for actor and object
  public id: number
  public type: string
  public instance: Instance
  public date: string
  public actorId: number
  public objectId: number
  public payload: string

  public constructor(payload: NotificationEventPayload) {
    this.id = payload.id
    this.type = payload.type
    this.instance = payload.instance
    this.date = payload.date
    this.actorId = payload.actorId
    this.objectId = payload.objectId
    this.payload = payload.payload
  }

  public async actor(
    _args: undefined,
    { dataSources }: Context,
    info: GraphQLResolveInfo
  ) {
    if (!this.actorId) return null
    const partialActor = { id: this.actorId }
    if (requestsOnlyFields('User', ['id'], info)) {
      return partialActor
    }
    const data = await dataSources.serlo.getUuid(partialActor)
    // TODO: why does new User(data) not work?
    return resolveAbstractUuid(data) as User
  }

  public async object(
    _args: undefined,
    { dataSources }: Context,
    info: GraphQLResolveInfo
  ) {
    if (!this.objectId) return null
    const partialObject = { id: this.objectId }
    if (requestsOnlyFields('Uuid', ['id'], info)) {
      return partialObject
    }
    const data = await dataSources.serlo.getUuid(partialObject)
    return resolveAbstractUuid(data) as Uuid
  }
}

export interface NotificationEventPayload {
  // TODO: add fields
  id: number
  type: string
  instance: Instance
  date: string
  actorId: number
  objectId: number
  payload: string
}

notificationSchema.addTypeDef(gql`
  type NotificationEvent {
    # TODO: actual type for the GraphQL schema
    id: Int!
    type: String!
    instance: Instance!
    date: DateTime!
    actor: User!
    object: Uuid!
    payload: String
  }
`)

/**
 * query notifications
 */
notificationSchema.addQuery<unknown, {}, Notification[]>(
  'notifications',
  async (_parent, _args, { dataSources, user }) => {
    // TODO: return a list of notifications
    // approach:
    // 0. check if user logged in
    if (user == null) {
      throw new AuthenticationError('You are not logged in')
    }
    // 1. fetch notification payloads via data source
    const payloads = await dataSources.serlo.getNotifications({ id: user })
    // 2. map over the payloads and create notifications
    // 3. return that...
    return payloads.map((payload: NotificationPayload) => {
      return new Notification(payload)
    })
  }
)

notificationSchema.addTypeDef(gql`
  extend type Query {
    notifications: [Notification!]!
  }
`)

/**
 * mutation setNotificationState
 */
notificationSchema.addMutation<unknown, { id: number; state: boolean }, null>(
  'setNotificationState',
  async (_parent, payload, { dataSources, user }) => {
    // TODO:
    // 0. check if user logged in
    if (user == null) {
      throw new AuthenticationError('You are not logged in')
    }
    // 1. call the corresponding function on data source
    await dataSources.serlo.setNotificationState({
      id: payload.id,
      userId: user,
      state: payload.state,
    })
  }
)

notificationSchema.addTypeDef(gql`
  extend type Mutation {
    setNotificationState(id: Int!, state: Boolean): Boolean
  }
`)

// TODO: Later: _setNotifications
// TODO: Later: _setEvent
