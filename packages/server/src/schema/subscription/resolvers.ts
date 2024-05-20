import * as auth from '@serlo/authorization'

import { UuidResolver } from '../uuid/abstract-uuid/resolvers'
import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
} from '~/internals/graphql'
import { UuidDecoder } from '~/model/decoder'
import { fetchScopeOfUuid } from '~/schema/authorization/utils'
import { resolveConnection } from '~/schema/connection/utils'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  SubscriptionInfo: {
    async object(parent, _args, context) {
      return UuidResolver.resolveWithDecoder(
        UuidDecoder,
        { id: parent.objectId },
        context,
      )
    },
  },
  Query: {
    subscription: createNamespace(),
  },
  Mutation: {
    subscription: createNamespace(),
  },
  SubscriptionQuery: {
    async currentUserHasSubscribed(_parent, { id }, { database, userId }) {
      assertUserIsAuthenticated(userId)

      const subscription = await database.fetchOptional(
        `select id from subscription where user_id = ? and uuid_id = ?`,
        [userId, id],
      )

      return subscription !== null
    },
    async getSubscriptions(_parent, cursorPayload, { database, userId }) {
      assertUserIsAuthenticated(userId)

      const subscriptions = await database.fetchAll<Subscription>(
        `
        select
          uuid_id as objectId,
          notify_mailman as sendEmail
        from subscription
        where user_id = ?
        order by objectId`,
        [userId],
      )

      return resolveConnection({
        nodes: subscriptions.map(({ objectId, sendEmail }) => ({
          objectId,
          sendEmail: Boolean(sendEmail),
        })),
        payload: cursorPayload,
        createCursor: (node) => node.objectId.toString(),
      })

      interface Subscription {
        objectId: number
        sendEmail: 0 | 1
      }
    },
  },
  SubscriptionMutation: {
    async set(_parent, payload, context) {
      const { database, userId } = context
      const { subscribe, sendEmail } = payload.input
      const ids = payload.input.id

      const scopes = await Promise.all(
        ids.map((id) => fetchScopeOfUuid({ id }, context)),
      )

      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        guards: scopes.map((scope) => auth.Subscription.set(scope)),
        message: 'You are not allowed to subscribe to this object.',
        context,
      })

      const transaction = await database.beginTransaction()

      try {
        if (subscribe) {
          for (const id of ids) {
            const { affectedRows } = await database.mutate(
              'update subscription set notify_mailman = ? where user_id = ? and uuid_id = ?',
              [sendEmail ? 1 : 0, userId, id],
            )

            if (affectedRows === 0) {
              await database.mutate(
                'insert into subscription (uuid_id, user_id, notify_mailman) values (?, ?, ?)',
                [id, userId, sendEmail ? 1 : 0],
              )
            }
          }
        } else {
          for (const id of ids) {
            await database.mutate(
              `delete from subscription where user_id = ? and uuid_id = ?`,
              [userId, id],
            )
          }
        }

        await transaction.commit()

        return { success: true, query: {} }
      } finally {
        await transaction.rollback()
      }
    },
  },
}
