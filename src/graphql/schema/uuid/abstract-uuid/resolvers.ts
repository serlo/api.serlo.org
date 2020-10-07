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
import { DiscriminatorType, UuidPayload } from '..'
import { SerloDataSource } from '../../../data-sources/serlo'
import { resolveConnection } from '../../connection'
import { ThreadPayload } from '../../threads'
import { CommentPayload } from '../comment/types'
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

      return resolveConnection({
        nodes: await Promise.all(
          threadslist.threadIds.map((id) =>
            toThreadPayload(dataSources.serlo, id)
          )
        ),
        payload: cursorPayload,
        createCursor(node) {
          return node.commentPayloads[0].id.toString()
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

export async function toThreadPayload(
  serlo: SerloDataSource,
  firstCommentId: number
): Promise<ThreadPayload> {
  const firstComment = (await serlo.getUuid<CommentPayload>({
    id: firstCommentId,
  })) as CommentPayload
  const remainingComments = Promise.all(
    firstComment.childrenIds.map((id) => serlo.getUuid<CommentPayload>({ id }))
  )
  return {
    __typename: DiscriminatorType.Thread,
    commentPayloads: [firstComment, remainingComments],
  } as ThreadPayload
}
