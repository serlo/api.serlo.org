import {
  SetThreadStateNotificationEvent,
  UnsupportedThread,
} from '../../../../types'
import { Resolver } from '../../types'
import { UserPreResolver } from '../../uuid/user'
import { NotificationEventType } from '../types'

export interface SetThreadStateNotificationEventPreResolver
  extends Omit<
    SetThreadStateNotificationEvent,
    keyof SetThreadStateNotificationEventResolvers['SetThreadStateNotificationEvent']
  > {
  __typename: NotificationEventType.SetThreadState
  actorId: number
  threadId: number
}

export type SetThreadStateNotificationEventPayload = SetThreadStateNotificationEventPreResolver

export interface SetThreadStateNotificationEventResolvers {
  SetThreadStateNotificationEvent: {
    actor: Resolver<
      SetThreadStateNotificationEventPreResolver,
      never,
      Partial<UserPreResolver>
    >
    thread: Resolver<
      SetThreadStateNotificationEventPreResolver,
      never,
      UnsupportedThread
    >
  }
}
