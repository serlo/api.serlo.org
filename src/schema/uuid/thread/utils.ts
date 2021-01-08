/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { ApolloError } from 'apollo-server'

import { resolveConnection } from '../../connection'
import { isDefined } from '../../utils'
import { UuidResolvers } from '../abstract-uuid'
import { CommentPayload, ThreadData, ThreadDataType } from './types'

export function createThreadResolvers(): Pick<UuidResolvers, 'threads'> {
  return {
    async threads(parent, cursorPayload, { dataSources }) {
      const { firstCommentIds } = await Promise.resolve(
        dataSources.model.serlo.getThreadIds({ id: parent.id })
      )

      const threads = await Promise.all(
        firstCommentIds.map(
          async (firstCommentId): Promise<ThreadData> => {
            const firstComment = (await dataSources.model.serlo.getUuid({
              id: firstCommentId,
            })) as CommentPayload | null
            if (firstComment === null) {
              throw new ApolloError('There are no comments yet')
            }
            const remainingComments = await Promise.all(
              firstComment.childrenIds.map(async (id) => {
                return (await dataSources.model.serlo.getUuid({
                  id,
                })) as CommentPayload | null
              })
            )
            return {
              __typename: ThreadDataType,
              commentPayloads: [
                firstComment,
                ...remainingComments.filter(isDefined),
              ],
            }
          }
        )
      )

      return resolveConnection({
        nodes: threads.reverse(),
        payload: cursorPayload,
        createCursor(node) {
          return node.commentPayloads[0].id.toString()
        },
      })
    },
  }
}

export function encodeThreadId(firstCommentId: number) {
  return Buffer.from(`t${firstCommentId}`).toString('base64')
}

export function decodeThreadId(threadId: string) {
  return parseInt(Buffer.from(threadId, 'base64').toString('ascii').substr(1))
}
