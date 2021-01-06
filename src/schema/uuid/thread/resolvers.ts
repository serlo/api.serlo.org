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
import * as R from 'ramda'

import { resolveConnection } from '../../connection'
import { createUuidResolvers, UuidPayload } from '../abstract-uuid'
import { UserPayload } from '../user'
import { CommentPayload, ThreadDataType, ThreadResolvers } from './types'
import { assertUserIsAuthenticated } from '~/schema/utils'

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
      const object = (await dataSources.model.serlo.getUuid({
        id: thread.commentPayloads[0].parentId,
      })) as UuidPayload | null
      if (object === null) {
        throw new ApolloError('Thread points to non-existent uuid')
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
  Comment: {
    ...createUuidResolvers(),
    createdAt(comment) {
      return comment.date
    },
    async author(comment, _args, { dataSources }) {
      const author = (await dataSources.model.serlo.getUuid({
        id: comment.authorId,
      })) as UserPayload | null
      if (author === null) {
        throw new ApolloError('There is no author with this id')
      }
      return author
    },
  },
  Mutation: {
    async createThread(_parent, payload, { dataSources, userId: user }) {
      assertUserIsAuthenticated(user)
      const commentPayload = await dataSources.model.serlo.createThread({
        ...payload,
        userId: user,
      })
      return commentPayload === null
        ? null
        : {
            __typename: ThreadDataType,
            commentPayloads: [commentPayload],
          }
    },
  },
}
