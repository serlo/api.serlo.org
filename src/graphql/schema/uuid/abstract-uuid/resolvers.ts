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
import { UuidPayload } from '..'
import { resolveConnection } from '../../connection'
import { ThreadPayload } from '../../threads'
import { UuidResolvers } from './types'

export const resolvers: UuidResolvers = {
  AbstractUuid: {
    __resolveType(uuid) {
      return uuid.__typename
    },
    async threads(parent, cursorPayload, { dataSources }) {
      const threadslist = await Promise.resolve(
        dataSources.serlo.getThreadIds({ id: parent.id })
      )
      const thread = await Promise.all(
        threadslist.threadIds.map((id) => {
          return dataSources.serlo.getUuid<ThreadPayload>({ id })
        })
      )
      return resolveConnection<ThreadPayload>({
        nodes: thread.filter((payload) => payload !== null) as ThreadPayload[],
        payload: cursorPayload,
        createCursor(node) {
          return node.id.toString()
        },
      })
    },
  },
  Query: {
    async uuid(_parent, payload, { dataSources }) {
      const id = payload.alias
        ? (await dataSources.serlo.getAlias(payload.alias)).id
        : (payload.id as number)

      return dataSources.serlo.getUuid<UuidPayload>({ id })
    },
  },
}
