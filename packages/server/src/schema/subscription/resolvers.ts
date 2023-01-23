/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2023 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2023 Serlo Education e.V.
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
import { castToUuid, UuidDecoder } from '~/model/decoder'
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
      const { id, subscribe, sendEmail } = payload.input
      const ids = id.map(castToUuid)

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
      return { success: true, query: {} }
    },
  },
}
