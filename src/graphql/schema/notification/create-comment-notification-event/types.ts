import {
  CreateCommentNotificationEvent,
  UnsupportedComment,
  UnsupportedThread,
} from '../../../../types'
import { Resolver } from '../../types'
import { UserPreResolver } from '../../uuid/user'
import { NotificationEventType } from '../types'

export interface CreateCommentNotificationEventPreResolver
  extends Omit<
    CreateCommentNotificationEvent,
    keyof CreateCommentNotificationEventResolvers['CreateCommentNotificationEvent']
  > {
  __typename: NotificationEventType.CreateComment
  authorId: number
  threadId: number
  commentId: number
}

export type CreateCommentNotificationEventPayload = CreateCommentNotificationEventPreResolver

export interface CreateCommentNotificationEventResolvers {
  CreateCommentNotificationEvent: {
    author: Resolver<
      CreateCommentNotificationEventPreResolver,
      never,
      Partial<UserPreResolver>
    >
    thread: Resolver<
      CreateCommentNotificationEventPreResolver,
      never,
      UnsupportedThread
    >
    comment: Resolver<
      CreateCommentNotificationEventPreResolver,
      never,
      UnsupportedComment
    >
  }
}
