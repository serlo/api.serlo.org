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
import { createUuidResolvers, UuidPayload } from '../abstract-uuid'
import { UserPayload } from '../user'
import { CommentPayload, ThreadDataType, ThreadResolvers } from './types'
import { decodeThreadId, encodeThreadId } from './utils'
import {
  assertUserIsAuthenticated,
  createMutationNamespace,
} from '~/schema/utils'

//TODO: add filter for trashed threads and comments
export const resolvers: ThreadResolvers = {
  Thread: {
    id(thread, _args) {
      return encodeThreadId(thread.commentPayloads[0].id)
    },
    createdAt(thread, _args) {
      return thread.commentPayloads[0].date
    },
    title(thread, _args) {
      return thread.commentPayloads[0].title
    },
    archived(thread, _args) {
      return thread.commentPayloads[0].archived
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
    //TODO: add Caros code
    async createComment(_parent, payload, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)
      const commentPayload = await dataSources.model.serlo.createThread({
        objectId: 0,
        ...payload.input,
        userId,
      })
      console.log(commentPayload)
      return {
        record: null,
        success: true,
        query: {},
      }
    },
    //TODO: make issue to define endpoint needs
    async setThreadArchived(_parent, payload, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)
      const { id, archived } = payload.input
      const res = await dataSources.model.serlo.archiveThread({
        id: id,
        userId,
        archived,
      })
      return {
        success: res !== null,
        query: {},
      }
    },
    async setThreadState(_parent, payload, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)
      const { id, trashed } = payload.input
      const firstCommentId = decodeThreadId(id)
      const res = await dataSources.model.serlo.setUuidState({
        id: [firstCommentId],
        userId,
        trashed,
      })
      return {
        success: res[0] !== null,
        query: {},
      }
    },
    async setCommentState(_parent, payload, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)
      const { id, trashed } = payload.input
      const res = await dataSources.model.serlo.setUuidState({
        id: [id],
        userId,
        trashed,
      })
      return {
        success: res[0] !== null,
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
