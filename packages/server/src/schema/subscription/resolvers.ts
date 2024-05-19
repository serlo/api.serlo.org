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
        `select uuid_id as objectId, notify_mailman as sendEmail from subscription where user_id = ?`,
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
      const { dataSources, userId } = context
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

      await dataSources.model.serlo.setSubscription({
        ids,
        userId,
        subscribe,
        sendEmail,
      })
      return { success: true, query: {} }
    },
  },
}
