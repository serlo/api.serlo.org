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
import { Matchers } from '@pact-foundation/pact'
import { gql } from 'apollo-server'

import {
  comment1,
  getCommentDataWithoutSubresolvers,
} from '../../../__fixtures__/uuid/comment'
import { CommentPayload } from '../../../src/graphql/schema/uuid/thread/types'
import {
  addUuidInteraction,
  assertSuccessfulGraphQLQuery,
} from '../../__utils__'

test('Comment', async () => {
  await addUuidInteraction<CommentPayload>({
    __typename: comment1.__typename,
    id: comment1.id,
    trashed: Matchers.boolean(comment1.trashed),
    alias: null,
    authorId: Matchers.integer(comment1.authorId),
    title: Matchers.string(comment1.title),
    date: Matchers.iso8601DateTime(comment1.date),
    archived: Matchers.boolean(comment1.archived),
    content: Matchers.string(comment1.content),
    parentId: Matchers.integer(comment1.parentId),
    childrenIds: Matchers.eachLike(Matchers.integer(1)),
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query comments($id: Int!) {
        uuid(id: $id) {
          __typename
          ... on Comment {
            __typename
            trashed
            id
            content
            alias
            title
            archived
          }
        }
      }
    `,
    variables: comment1,
    data: {
      uuid: getCommentDataWithoutSubresolvers(comment1),
    },
  })
})
