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
import { UserInputError } from 'apollo-server'

import {
  CommentPayload,
  ThreadAwareResolvers,
  ThreadData,
  ThreadDataType,
} from './types'
import { Context } from '~/internals/graphql'
import { resolveConnection } from '~/schema/connection'
import { isDefined } from '~/schema/utils'

export function createThreadResolvers(): ThreadAwareResolvers {
  return {
    async threads(parent, payload, { dataSources }) {
      const { firstCommentIds } = await dataSources.model.serlo.getThreadIds({
        id: parent.id,
      })

      const firstComments = await resolveComments(
        dataSources,
        firstCommentIds.sort().reverse()
      )

      const filteredFirstComments = firstComments.filter((comment) => {
        if (
          payload.archived !== undefined &&
          payload.archived !== comment.archived
        ) {
          return false
        }
        if (
          payload.trashed !== undefined &&
          payload.trashed !== comment.trashed
        ) {
          return false
        }

        return true
      })

      const threads = await Promise.all(
        filteredFirstComments.map(
          async (firstComment): Promise<ThreadData> => {
            const remainingComments = await resolveComments(
              dataSources,
              firstComment.childrenIds
            )
            const filteredComments = remainingComments.filter((comment) => {
              if (
                payload.trashed !== undefined &&
                payload.trashed !== comment.trashed
              )
                return false

              return true
            })
            return {
              __typename: ThreadDataType,
              commentPayloads: [firstComment, ...filteredComments],
            }
          }
        )
      )

      return resolveConnection({
        nodes: threads,
        payload: payload,
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

export function decodeThreadId(threadId: string): number | null {
  const result = parseInt(
    Buffer.from(threadId, 'base64').toString('utf-8').substr(1)
  )
  return Number.isNaN(result) || result <= 0 ? null : result
}

async function resolveComments(
  dataSources: Context['dataSources'],
  ids: number[]
) {
  const comments = (await Promise.all(
    ids.map((id) => dataSources.model.serlo.getUuid({ id }))
  )) as (CommentPayload | null)[]

  return comments.filter(isDefined)
}

export function threadIdInputToNumberArray(id: string | string[]) {
  const ids = Array.isArray(id) ? id : [id]
  return ids.map((id) => {
    const num = decodeThreadId(id)
    if (num === null) {
      throw new UserInputError('you need to provide a valid thread id (string)')
    }
    return num
  })
}
