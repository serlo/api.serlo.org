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
import { Matchers } from '@pact-foundation/pact'

import { article } from '../../__fixtures__'
import { addMessageInteraction } from '../__utils__'

test('ThreadsQuery', async () => {
  await addMessageInteraction({
    given: `article ${article.id} has threads`,
    message: {
      type: 'ThreadsQuery',
      payload: { id: article.id },
    },
    responseBody: {
      firstCommentIds: Matchers.eachLike(Matchers.integer(1)),
    },
  })
  const response = await global.serloModel.getThreadIds({ id: article.id })
  expect(response).toEqual({ firstCommentIds: [1] })
})
