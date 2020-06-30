import { Instance } from '../src/graphql/schema/instance'
import {
  NotificationEventPayload,
  NotificationPayload,
  NotificationsPayload,
} from '../src/graphql/schema/notification'

export const event: NotificationEventPayload = {
  id: 1,
  type: 'string',
  instance: Instance.De,
  date: '2014-03-01T20:45:56Z',
  actorId: 1,
  objectId: 1855,
  payload: 'string',
}

export const notification: NotificationPayload = {
  id: 1,
  unread: true,
  eventId: event.id,
}

export const notifications: NotificationsPayload = {
  notifications: [notification],
  userId: 2,
}
