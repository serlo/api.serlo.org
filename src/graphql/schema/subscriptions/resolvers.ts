/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { AuthenticationError } from 'apollo-server'

import { resolveConnection } from '../connection'
import { AbstractUuidPayload, UuidPayload } from '../uuid/abstract-uuid'
import { SubscriptionResolvers } from './types'

export const resolvers: SubscriptionResolvers = {
  Query: {
    async subscriptions(parent, cursorPayload, { dataSources, user }) {
      if (user === null) throw new AuthenticationError('You are not logged in')
      const subscriptions = await dataSources.serlo.getSubscription({
        userid: user,
      })
      const result = await Promise.all(
        subscriptions.subscriptions.map((id) => {
          return dataSources.serlo.getUuid<UuidPayload>({ id: id.id })
        })
      )
      console.log(subscriptions)
      return resolveConnection<AbstractUuidPayload>({
        nodes: result.filter(
          (payload) => payload !== null
        ) as AbstractUuidPayload[],
        payload: cursorPayload,
        createCursor(node) {
          return node.id.toString()
        },
      })
    },
  },
}
