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
import { ApolloError, ForbiddenError } from 'apollo-server'

import { CommentPayload, ThreadDataType, ThreadResolvers } from './types'
import { decodeThreadId, decodeThreadIds, encodeThreadId } from './utils'
import { resolveConnection } from '~/schema/connection/utils'
import {
  assertUserIsAuthenticated,
  createMutationNamespace,
} from '~/schema/utils'
import { createUuidResolvers } from '~/schema/uuid/abstract-uuid/utils'
import { UserPayloadDecoder } from '~/schema/uuid/user/decoder'

export const resolvers: ThreadResolvers = {
  Thread: {
    id(thread) {
      return encodeThreadId(thread.commentPayloads[0].id)
    },
    createdAt(thread) {
      return thread.commentPayloads[0].date
    },
    title(thread) {
      return thread.commentPayloads[0].title
    },
    archived(thread) {
      return thread.commentPayloads[0].archived
    },
    async object(thread, _args, { dataSources }) {
      const object = await dataSources.model.serlo.getUuid({
        id: thread.commentPayloads[0].parentId,
      })
      if (object === null) {
        throw new ApolloError('Thread points to non-existent uuid')
      }
      return object
    },
    comments(thread, cursorPayload) {
      return resolveConnection<CommentPayload>({
        nodes: thread.commentPayloads.sort((a, b) => a.id - b.id),
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
      const author = await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: comment.authorId,
        decoder: UserPayloadDecoder,
      })
      if (author === null) {
        throw new ApolloError('There is no author with this id')
      }
      return author
    },
  },
  Mutation: {
    thread: createMutationNamespace(),
  },
  ThreadMutation: {
    async createThread(_parent, payload, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const commentPayload = await dataSources.model.serlo.createThread({
        ...payload.input,
        userId,
      })
      const success = commentPayload !== null
      return {
        record:
          commentPayload !== null
            ? { __typename: ThreadDataType, commentPayloads: [commentPayload] }
            : null,
        success,
        query: {},
      }
    },
    async createComment(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const threadId = decodeThreadId(input.threadId)
      const commentPayload = await dataSources.model.serlo.createComment({
        ...input,
        threadId,
        userId,
      })

      return {
        record: commentPayload,
        success: commentPayload !== null,
        query: {},
      }
    },
    async setThreadArchived(_parent, payload, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)
      // TODO: Mock permissions for now
      if ([1, 10, 15473, 18981].indexOf(userId) < 0) {
        throw new ForbiddenError('You are not allowed to set the thread state.')
      }
      const { id, archived } = payload.input

      await dataSources.model.serlo.archiveThread({
        ids: decodeThreadIds(id),
        archived,
        userId,
      })
      return { success: true, query: {} }
    },
    async setThreadState(_parent, payload, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)
      // TODO: Mock permissions for now
      if ([1, 10, 15473, 18981].indexOf(userId) < 0) {
        throw new ForbiddenError('You are not allowed to set the thread state.')
      }
      const { id, trashed } = payload.input

      await dataSources.model.serlo.setUuidState({
        ids: decodeThreadIds(id),
        userId,
        trashed,
      })
      return {
        success: true,
        query: {},
      }
    },
    async setCommentState(_parent, payload, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)
      // TODO: Mock permissions for now
      if ([1, 10, 15473, 18981].indexOf(userId) < 0) {
        throw new ForbiddenError('You are not allowed to set the thread state.')
      }
      const { id, trashed } = payload.input
      const ids = Array.isArray(id) ? id : [id]

      await dataSources.model.serlo.setUuidState({
        ids: ids,
        trashed,
        userId,
      })
      return {
        success: true,
        query: {},
      }
    },
  },
  ThreadAware: {
    __resolveType(object) {
      return object.__typename
    },
  },
}
