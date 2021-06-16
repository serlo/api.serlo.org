/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import * as auth from '@serlo/authorization'

import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
  Mutations,
  Queries,
  TypeResolvers,
} from '~/internals/graphql'
import { fetchScopeOfUuid } from '~/schema/authorization/utils'
import { resolveConnection } from '~/schema/connection/utils'
import { Subscriptions, SubscriptionQuery } from '~/types'

export const resolvers: TypeResolvers<SubscriptionQuery> &
  TypeResolvers<Subscriptions> &
  Queries<'subscriptions' | 'subscription'> &
  Mutations<'subscription'> = {
  Subscriptions: {
    async object(parent, _args, { dataSources }) {
      const object = await dataSources.model.serlo.getUuid({
        id: parent.objectId,
      })
      if (object === null) throw new Error('Object cannot be null')
      return object
    },
  },

  Query: {
    async subscriptions(_parent, cursorPayload, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)
      const subscriptions = await dataSources.model.serlo.getSubscriptions({
        userId,
      })

      return resolveConnection({
        nodes: subscriptions.subscriptions,
        payload: cursorPayload,
        createCursor(node) {
          return node.objectId.toString()
        },
      })
    },
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
      return subscriptions.subscriptions.some(
        (subscription) => subscription.objectId === id
      )
    },
  },
  SubscriptionMutation: {
    async set(_parent, payload, { dataSources, userId }) {
      const { id, subscribe, sendEmail } = payload.input
      const ids = id

      const scopes = await Promise.all(
        ids.map((id) => fetchScopeOfUuid({ id, dataSources }))
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
      return {
        success: true,
        query: {},
      }
    },
  },
}
