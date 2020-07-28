import { CreateEntityNotificationEvent } from '../../../../types'
import { Resolver } from '../../types'
import { EntityPreResolver } from '../../uuid/abstract-entity'
import { UserPreResolver } from '../../uuid/user'
import { NotificationEventType } from '../types'

export interface CreateEntityNotificationEventPreResolver
  extends Omit<
    CreateEntityNotificationEvent,
    keyof CreateEntityNotificationEventResolvers['CreateEntityNotificationEvent']
  > {
  __typename: NotificationEventType.CreateEntity
  authorId: number
  entityId: number
}

export type CreateEntityNotificationEventPayload = CreateEntityNotificationEventPreResolver

export interface CreateEntityNotificationEventResolvers {
  CreateEntityNotificationEvent: {
    author: Resolver<
      CreateEntityNotificationEventPreResolver,
      never,
      Partial<UserPreResolver>
    >
    entity: Resolver<
      CreateEntityNotificationEventPreResolver,
      never,
      EntityPreResolver
    >
  }
}
