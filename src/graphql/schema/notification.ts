import { gql, AuthenticationError, ForbiddenError } from 'apollo-server'
import { GraphQLResolveInfo } from 'graphql'

import { Instance } from './instance'
import { Context } from './types'
import { Schema, requestsOnlyFields } from './utils'
import { AbstractUuidPayload, resolveAbstractUuid } from './uuid'
import { Uuid } from './uuid/abstract-uuid'
import { resolveUser, UserPayload } from './uuid/user'

export const notificationSchema = new Schema()

/**
 * type Notification
 */
export class Notification {
  public id: number
  public unread: boolean
  public eventId: number

  public constructor(payload: NotificationPayload) {
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
}

export interface NotificationsPayload {
  notifications: NotificationPayload[]
  userId: number
}

export interface NotificationPayload {
  id: number
  unread: boolean
  eventId: number
}

notificationSchema.addTypeDef(gql`
  type Notification {
    id: Int!
    unread: Boolean
    event: NotificationEvent!
  }
`)

/**
 * type NotificationEvent
 */
export class NotificationEvent {
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
    const data = await dataSources.serlo.getUuid<UserPayload>(partialActor)
    return resolveUser(data)
  }

  public async object(_args: undefined, { dataSources }: Context) {
    if (!this.objectId) return null
    const data = await dataSources.serlo.getUuid({ id: this.objectId })
    // TODO: this type is still a little bit weird since the discriminator is not part of our Payload types
    return resolveAbstractUuid(data as AbstractUuidPayload) as Uuid
  }
}

export interface NotificationEventPayload {
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
notificationSchema.addQuery<
  unknown,
  never,
  { totalCount: number; nodes: Notification[] }
>('notifications', async (_parent, _args, { dataSources, user }) => {
  if (user == null) {
    throw new AuthenticationError('You are not logged in')
  }
  const notifications = await dataSources.serlo.getNotifications({
    id: user,
  })
  return {
    totalCount: notifications.length,
    nodes: notifications.map((payload: NotificationPayload) => {
      return new Notification(payload)
    }),
  }
})

notificationSchema.addTypeDef(gql`
  type NotificationsResult {
    totalCount: Int!
    nodes: [Notification!]!
  }
  extend type Query {
    notifications: NotificationsResult!
  }
`)

/**
 * mutation setNotificationState
 */
notificationSchema.addMutation<unknown, { id: number; unread: boolean }, null>(
  'setNotificationState',
  async (_parent, payload, { dataSources, user }) => {
    if (user == null) {
      throw new AuthenticationError('You are not logged in')
    }
    // TODO: throw error if response fails
    await dataSources.serlo.setNotificationState({
      id: payload.id,
      userId: user,
      unread: payload.unread,
    })
  }
)

notificationSchema.addTypeDef(gql`
  extend type Mutation {
    setNotificationState(id: Int!, unread: Boolean): Boolean
  }
`)

/**
 * mutation _setNotifications
 */
notificationSchema.addMutation<unknown, NotificationsPayload, null>(
  '_setNotifications',
  async (_parent, payload, { dataSources, service }) => {
    if (service !== 'serlo.org') {
      throw new ForbiddenError(
        'You do not have the permissions to set notifications'
      )
    }
    await dataSources.serlo.setNotifications(payload)
  }
)
notificationSchema.addTypeDef(gql`
  input NotificationInput {
    id: Int!
    unread: Boolean
    eventId: Int!
  }
  extend type Mutation {
    _setNotifications(
      userId: Int!
      notifications: [NotificationInput!]!
    ): Boolean
  }
`)

/**
 * mutation _setNotificationEvent
 */
notificationSchema.addMutation<unknown, NotificationEvent, null>(
  '_setNotificationEvent',
  async (_parent, notificationEvent, { dataSources, service }) => {
    if (service !== 'serlo.org') {
      throw new ForbiddenError(
        'You do not have the permissions to set notifications'
      )
    }
    await dataSources.serlo.setNotificationEvent(notificationEvent)
  }
)
notificationSchema.addTypeDef(gql`
  extend type Mutation {
    _setNotificationEvent(
      id: Int!
      type: String!
      instance: Instance!
      date: String!
      actorId: Int!
      objectId: Int!
      payload: String!
    ): Boolean
  }
`)
