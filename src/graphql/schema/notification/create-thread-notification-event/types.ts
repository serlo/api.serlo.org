import {
  CreateThreadNotificationEvent,
  UnsupportedThread,
} from '../../../../types'
import { Resolver } from '../../types'
import { UuidPreResolver } from '../../uuid/abstract-uuid'
import { UserPreResolver } from '../../uuid/user'
import { NotificationEventType } from '../types'

export interface CreateThreadNotificationEventPreResolver
  extends Omit<
    CreateThreadNotificationEvent,
    keyof CreateThreadNotificationEventResolvers['CreateThreadNotificationEvent']
  > {
  __typename: NotificationEventType.CreateThread
  authorId: number
  objectId: number
  threadId: number
}

export type CreateThreadNotificationEventPayload = CreateThreadNotificationEventPreResolver

export interface CreateThreadNotificationEventResolvers {
  CreateThreadNotificationEvent: {
    author: Resolver<
      CreateThreadNotificationEventPreResolver,
      never,
      Partial<UserPreResolver>
    >
    object: Resolver<
      CreateThreadNotificationEventPreResolver,
      never,
      UuidPreResolver
    >
    thread: Resolver<
      CreateThreadNotificationEventPreResolver,
      never,
      UnsupportedThread
    >
  }
}
