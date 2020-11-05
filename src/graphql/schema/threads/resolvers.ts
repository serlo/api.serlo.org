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
import { ForbiddenError } from 'apollo-server'
import * as R from 'ramda'

import { resolveConnection } from '../connection'
import { UuidPayload } from '../uuid'
import { CommentPayload } from '../uuid/comment'
import { ThreadResolvers } from './types'

export const resolvers: ThreadResolvers = {
  Thread: {
    createdAt(thread, _args) {
      return thread.commentPayloads.map((comment) => comment.date).reduce(R.min)
    },
    updatedAt(thread, _args) {
      return thread.commentPayloads.map((comment) => comment.date).reduce(R.max)
    },
    title(thread, _args) {
      return thread.commentPayloads[0].title
    },
    archived(thread, _args) {
      return thread.commentPayloads[0].archived
    },
    trashed(thread, _args) {
      return thread.commentPayloads[0].trashed
    },
    async object(thread, _args, { dataSources }) {
      const object = await dataSources.serlo.getUuid<UuidPayload>({
        id: thread.commentPayloads[0].parentId,
      })
      if (object === null) {
        throw new ForbiddenError('Thread points to non-existent uuid')
      }
      return object
    },
    comments(thread, cursorPayload) {
      return resolveConnection<CommentPayload>({
        nodes: thread.commentPayloads,
        payload: cursorPayload,
        createCursor(node) {
          return node.id.toString()
        },
      })
    },
  },
}
