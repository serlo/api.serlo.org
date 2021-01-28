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
import {
  MutationNamespace,
  MutationResolver,
  MutationResponseWithRecord,
  Resolver,
  TypeResolver,
} from '~/internals/graphql'
import { Connection } from '~/schema/connection'
import {
  DiscriminatorType,
  UserPayload,
  UuidPayload,
  UuidResolvers,
} from '~/schema/uuid'
import {
  Scalars,
  ThreadAwareThreadsArgs,
  ThreadCommentsArgs,
  ThreadMutationCreateCommentArgs,
  ThreadMutationCreateThreadArgs,
  ThreadMutationSetCommentStateArgs,
  ThreadMutationSetThreadArchivedArgs,
  ThreadMutationSetThreadStateArgs,
  ThreadSetCommentStateResponse,
  ThreadSetThreadArchivedResponse,
  ThreadSetThreadStateResponse,
} from '~/types'

export interface ThreadsPayload {
  firstCommentIds: number[]
}

export const ThreadDataType = 'Thread'

export interface ThreadData {
  __typename: typeof ThreadDataType
  commentPayloads: CommentPayload[]
}

export interface ThreadResolvers {
  Thread: {
    id: Resolver<ThreadData, never, string>
    createdAt: Resolver<ThreadData, never, Scalars['DateTime']>
    title: Resolver<ThreadData, never, string | null>
    archived: Resolver<ThreadData, never, boolean>
    object: Resolver<ThreadData, never, UuidPayload>
    comments: Resolver<
      ThreadData,
      ThreadCommentsArgs,
      Connection<CommentPayload>
    >
  }
  Comment: {
    createdAt: Resolver<CommentPayload, never, Scalars['DateTime']>
    author: Resolver<CommentPayload, never, UserPayload>
  } & UuidResolvers
  Mutation: {
    thread: MutationNamespace
  }
  ThreadMutation: {
    createThread: MutationResolver<
      ThreadMutationCreateThreadArgs,
      MutationResponseWithRecord<ThreadData | null>
    >
    createComment: MutationResolver<
      ThreadMutationCreateCommentArgs,
      MutationResponseWithRecord<CommentPayload | null>
    >
    setThreadArchived: MutationResolver<
      ThreadMutationSetThreadArchivedArgs,
      ThreadSetThreadArchivedResponse
    >
    setThreadState: MutationResolver<
      ThreadMutationSetThreadStateArgs,
      ThreadSetThreadStateResponse
    >
    setCommentState: MutationResolver<
      ThreadMutationSetCommentStateArgs,
      ThreadSetCommentStateResponse
    >
  }
  ThreadAware: {
    __resolveType: TypeResolver<UuidPayload>
  }
}

export interface ThreadAwareResolvers {
  threads: Resolver<UuidPayload, ThreadAwareThreadsArgs, Connection<ThreadData>>
}

export interface CommentPayload {
  id: number
  trashed: boolean
  alias: null | string
  __typename: DiscriminatorType.Comment
  authorId: number
  title: string | null
  date: string
  archived: boolean
  content: string
  parentId: number
  childrenIds: number[]
}
