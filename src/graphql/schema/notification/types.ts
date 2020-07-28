import {
  AbstractNotificationEvent,
  QueryNotificationEventArgs,
} from '../../../types'
import { QueryResolver, TypeResolver } from '../types'
import { CreateCommentNotificationEventPreResolver } from './create-comment-notification-event'
import { CreateEntityNotificationEventPreResolver } from './create-entity-notification-event'
import { CreateEntityRevisionNotificationEventPreResolver } from './create-entity-revision-notification-event'
import { CreateThreadNotificationEventPreResolver } from './create-thread-notification-event'
import { SetThreadStateNotificationEventPreResolver } from './set-thread-state-notification-event'

export enum NotificationEventType {
  CreateComment = 'CreateCommentNotificationEvent',
  CreateEntity = 'CreateEntityNotificationEvent',
  CreateEntityRevision = 'CreateEntityRevisionNotificationEvent',
  CreateThread = 'CreateThreadNotificationEvent',
  SetThreadState = 'SetThreadStateNotificationEvent',
}

export type NotificationEventPreResolver =
  | CreateCommentNotificationEventPreResolver
  | CreateEntityNotificationEventPreResolver
  | CreateEntityRevisionNotificationEventPreResolver
  | CreateThreadNotificationEventPreResolver
  | SetThreadStateNotificationEventPreResolver
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
