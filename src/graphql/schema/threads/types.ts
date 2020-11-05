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
import { Scalars, ThreadCommentsArgs } from '../../../types'
import { Connection } from '../connection'
import { Resolver } from '../types'
import { DiscriminatorType, UuidPayload } from '../uuid'
import { CommentPayload } from '../uuid/comment/types'

export interface ThreadsPayload {
  firstCommentIds: number[]
}

export interface ThreadPayload {
  __typename: DiscriminatorType.Thread
  commentPayloads: CommentPayload[]
}

export interface ThreadResolvers {
  Thread: {
    createdAt: Resolver<ThreadPayload, never, Scalars['DateTime']>
    updatedAt: Resolver<ThreadPayload, never, Scalars['DateTime']>
    title: Resolver<ThreadPayload, never, string>
    archived: Resolver<ThreadPayload, never, boolean>
    trashed: Resolver<ThreadPayload, never, boolean>
    object: Resolver<ThreadPayload, never, UuidPayload>
    comments: Resolver<
      ThreadPayload,
      ThreadCommentsArgs,
      Connection<CommentPayload>
    >
  }
}
