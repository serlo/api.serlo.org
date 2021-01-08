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
import { Connection } from '../../connection'
import {
  AbstractUuidPayload,
  DiscriminatorType,
  UuidResolvers,
} from '../abstract-uuid'
import { UserPayload } from '../user'
import {
  MutationNamespace,
  MutationResolver,
  OverwriteRecord,
  Resolver,
} from '~/internals/graphql'
import {
  Scalars,
  ThreadCommentsArgs,
  ThreadCreateCommentInput,
  ThreadCreateCommentResponse,
  ThreadCreateThreadInput,
  ThreadCreateThreadResponse,
  ThreadSetCommentStateInput,
  ThreadSetCommentStateResponse,
  ThreadSetThreadArchivedInput,
  ThreadSetThreadArchivedResponse,
  ThreadSetThreadStateInput,
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
    id: Resolver<ThreadData, never, string | null>
    createdAt: Resolver<ThreadData, never, Scalars['DateTime']>
    title: Resolver<ThreadData, never, string | null>
    archived: Resolver<ThreadData, never, boolean>
    object: Resolver<ThreadData, never, AbstractUuidPayload>
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
      ThreadCreateThreadInput,
      OverwriteRecord<ThreadCreateThreadResponse, ThreadData | null>
    >
    createComment: MutationResolver<
      ThreadCreateCommentInput,
      ThreadCreateCommentResponse
    >
    setThreadArchived: MutationResolver<
      ThreadSetThreadArchivedInput,
      ThreadSetThreadArchivedResponse
    >
    setThreadState: MutationResolver<
      ThreadSetThreadStateInput,
      ThreadSetThreadStateResponse
    >
    setCommentState: MutationResolver<
      ThreadSetCommentStateInput,
      ThreadSetCommentStateResponse
    >
  }
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
