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
    async currentUserHasSubscribed(_parent, { id }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const subscriptions = await dataSources.model.serlo.getSubscriptions({
        userId,
      })

      return subscriptions.subscriptions.some((sub) => sub.objectId === id)
    },
    async getSubscriptions(_parent, cursorPayload, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const { subscriptions } = await dataSources.model.serlo.getSubscriptions({
        userId,
      })

      return resolveConnection({
        nodes: subscriptions,
        payload: cursorPayload,
        createCursor: (node) => node.objectId.toString(),
      })
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
