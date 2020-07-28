import { CreateEntityRevisionNotificationEvent } from '../../../../types'
import { Resolver } from '../../types'
import {
  EntityPreResolver,
  EntityRevisionPreResolver,
} from '../../uuid/abstract-entity'
import { UserPreResolver } from '../../uuid/user'
import { NotificationEventType } from '../types'

export interface CreateEntityRevisionNotificationEventPreResolver
  extends Omit<
    CreateEntityRevisionNotificationEvent,
    keyof CreateEntityRevisionNotificationEventResolvers['CreateEntityRevisionNotificationEvent']
  > {
  __typename: NotificationEventType.CreateEntityRevision
  authorId: number
  entityId: number
  entityRevisionId: number
}

export type CreateEntityRevisionNotificationEventPayload = CreateEntityRevisionNotificationEventPreResolver

export interface CreateEntityRevisionNotificationEventResolvers {
  CreateEntityRevisionNotificationEvent: {
    author: Resolver<
      CreateEntityRevisionNotificationEventPreResolver,
      never,
      Partial<UserPreResolver>
    >
    entity: Resolver<
      CreateEntityRevisionNotificationEventPreResolver,
      never,
      EntityPreResolver
    >
    entityRevision: Resolver<
      CreateEntityRevisionNotificationEventPreResolver,
      never,
      EntityRevisionPreResolver
    >
  }
}
