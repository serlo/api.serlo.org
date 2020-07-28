import {
  AbstractNotificationEvent,
  QueryNotificationEventArgs,
} from '../../../types'
import { QueryResolver, TypeResolver } from '../types'
import { CreateThreadNotificationEventPreResolver } from './create-thread-notification-event'

export enum NotificationEventType {
  CreateThread = 'CreateThreadNotificationEvent',
}

export type NotificationEventPreResolver = CreateThreadNotificationEventPreResolver
export interface AbstractNotificationEventPreResolver
  extends AbstractNotificationEvent {
  __typename: NotificationEventType
}

export type NotificationEventPayload = NotificationEventPreResolver
export type AbstractNotificationEventPayload = AbstractNotificationEventPreResolver

export interface NotificationResolvers {
  AbstractNotificationEvent: {
    __resolveType: TypeResolver<NotificationEventPreResolver>
  }
  Query: {
    notificationEvent: QueryResolver<
      QueryNotificationEventArgs,
      NotificationEventPreResolver
    >
  }
}
