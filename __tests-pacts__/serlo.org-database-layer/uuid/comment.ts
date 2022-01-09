/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { Matchers } from '@pact-foundation/pact'

import { comment } from '../../../__fixtures__'
import { addUuidInteraction } from '../../__utils__'
import { Model } from '~/internals/graphql'

test('Comment', async () => {
  await addUuidInteraction<Model<'Comment'>>({
    __typename: comment.__typename,
    id: comment.id,
    trashed: Matchers.boolean(comment.trashed),
    alias: comment.alias,
    authorId: Matchers.integer(comment.authorId),
    title: comment.title ? Matchers.string(comment.title) : null,
    date: Matchers.iso8601DateTime(comment.date),
    archived: Matchers.boolean(comment.archived),
    content: Matchers.string(comment.content),
    parentId: Matchers.integer(comment.parentId),
    childrenIds: comment.childrenIds,
  })
  const response = await global.serloModel.getUuid({ id: comment.id })
  expect(response).toEqual(comment)
})
