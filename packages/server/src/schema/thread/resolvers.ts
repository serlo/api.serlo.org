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
import * as auth from '@serlo/authorization'
import { ApolloError } from 'apollo-server'

import { decodeThreadId, decodeThreadIds, encodeThreadId } from './utils'
import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
  InterfaceResolvers,
  Mutations,
  TypeResolvers,
  Model,
  Context,
} from '~/internals/graphql'
import { DiscriminatorType, UserDecoder } from '~/model/decoder'
import { fetchScopeOfUuid } from '~/schema/authorization/utils'
import { resolveConnection } from '~/schema/connection/utils'
import { createUuidResolvers } from '~/schema/uuid/abstract-uuid/utils'
import { Comment, Thread } from '~/types'

export const resolvers: InterfaceResolvers<'ThreadAware'> &
  Mutations<'thread'> &
  TypeResolvers<Thread> &
  TypeResolvers<Comment> = {
  ThreadAware: {
    __resolveType(parent) {
      return parent.__typename
    },
  },
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
    trashed(thread) {
      return thread.commentPayloads[0].trashed
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
      return resolveConnection({
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
        decoder: UserDecoder,
      })
      if (author === null) {
        throw new ApolloError('There is no author with this id')
      }
      return author
    },
    async legacyObject(comment, _args, { dataSources }) {
      return resolveObject(comment, dataSources)
    },
  },
  Mutation: {
    thread: createNamespace(),
  },
  ThreadMutation: {
    async createThread(_parent, payload, { dataSources, userId }) {
      const { objectId } = payload.input
      const scope = await fetchScopeOfUuid({ id: objectId, dataSources })

      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        userId,
        guard: auth.Thread.createThread(scope),
        message: 'You are not allowed to create a thread on this object.',
        dataSources,
      })

      const commentPayload = await dataSources.model.serlo.createThread({
        ...payload.input,
        userId,
      })
      const success = commentPayload !== null
      return {
        record:
          commentPayload !== null
            ? { __typename: 'Thread', commentPayloads: [commentPayload] }
            : null,
        success,
        query: {},
      }
    },
    async createComment(_parent, { input }, { dataSources, userId }) {
      const threadId = decodeThreadId(input.threadId)
      const scope = await fetchScopeOfUuid({ id: threadId, dataSources })

      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        userId,
        guard: auth.Thread.createComment(scope),
        message: 'You are not allowed to comment on this thread.',
        dataSources,
      })

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
      const { id, archived } = payload.input
      const ids = decodeThreadIds(id)

      const scopes = await Promise.all(
        ids.map((id) => fetchScopeOfUuid({ id, dataSources }))
      )

      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        userId,
        guards: scopes.map((scope) => auth.Thread.setThreadArchived(scope)),
        message: 'You are not allowed to archive the provided thread(s).',
        dataSources,
      })

      await dataSources.model.serlo.archiveThread({
        ids,
        archived,
        userId,
      })
      return { success: true, query: {} }
    },
    async setThreadState(_parent, payload, { dataSources, userId }) {
      const { id, trashed } = payload.input
      const ids = decodeThreadIds(id)

      const scopes = await Promise.all(
        ids.map((id) => fetchScopeOfUuid({ id, dataSources }))
      )

      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        userId,
        guards: scopes.map((scope) => auth.Thread.setThreadState(scope)),
        message:
          'You are not allowed to set the state of the provided thread(s).',
        dataSources,
      })

      await dataSources.model.serlo.setUuidState({
        ids,
        userId,
        trashed,
      })
      return {
        success: true,
        query: {},
      }
    },
    async setCommentState(_parent, payload, { dataSources, userId }) {
      const { id, trashed } = payload.input
      const ids = id

      const scopes = await Promise.all(
        ids.map((id) => fetchScopeOfUuid({ id, dataSources }))
      )

      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        userId,
        guards: scopes.map((scope) => auth.Thread.setCommentState(scope)),
        message:
          'You are not allowed to set the state of the provided comments(s).',
        dataSources,
      })

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
}

async function resolveObject(
  comment: Model<'Comment'>,
  dataSources: Context['dataSources']
): Promise<Model<'AbstractUuid'>> {
  const obj = await dataSources.model.serlo.getUuid({
    id: comment.parentId,
  })
  if (obj === null) {
    throw new ApolloError('Comment points to non-existent uuid')
  }
  if (obj.__typename === DiscriminatorType.Comment) {
    return resolveObject(obj, dataSources)
  }
  return obj
}
