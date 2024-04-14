import * as auth from '@serlo/authorization'

import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
  Mutations,
  Queries,
  TypeResolvers,
} from '~/internals/graphql'
import { UuidDecoder } from '~/model/decoder'
import { fetchScopeOfUuid } from '~/schema/authorization/utils'
import { resolveConnection } from '~/schema/connection/utils'
import { SubscriptionInfo } from '~/types'

export const resolvers: TypeResolvers<SubscriptionInfo> &
  Queries<'subscription'> &
  Mutations<'subscription'> = {
  SubscriptionInfo: {
    async object(parent, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: parent.objectId,
        decoder: UuidDecoder,
      })
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
    async set(_parent, payload, { dataSources, userId }) {
      const { subscribe, sendEmail } = payload.input
      const ids = payload.input.id

      const scopes = await Promise.all(
        ids.map((id) => fetchScopeOfUuid({ id, dataSources })),
      )

      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        userId,
        guards: scopes.map((scope) => auth.Subscription.set(scope)),
        message: 'You are not allowed to subscribe to this object.',
        dataSources,
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
