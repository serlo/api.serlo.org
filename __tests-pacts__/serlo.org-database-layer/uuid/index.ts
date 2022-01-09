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
/* eslint-disable import/no-unassigned-import */
import { Matchers } from '@pact-foundation/pact'
import { gql } from 'apollo-server'

import { article, user } from '../../../__fixtures__'
import {
  createTestClient,
  createUuidHandler,
} from '../../../__tests__/__utils__'
import {
  addMessageInteraction,
  assertSuccessfulGraphQLMutation,
} from '../../__utils__'

import './applet'
import './article'
import './course'
import './course-page'
import './comment'
import './entity'
import './event'
import './exercise'
import './exercise-group'
import './grouped-exercise'
import './page'
import './solution'
import './taxonomy-term'
import './user'
import './video'

test('UuidSetStateMutation', async () => {
  global.client = createTestClient({ userId: user.id })
  global.server.use(
    createUuidHandler(article),
    createUuidHandler({ ...user, roles: ['de_architect'] })
  )

  await addMessageInteraction({
    given: 'there exists a uuid with id 1855 that is not trashed',
    message: {
      type: 'UuidSetStateMutation',
      payload: { ids: [article.id], userId: user.id, trashed: true },
    },
  })

  await assertSuccessfulGraphQLMutation({
    mutation: gql`
      mutation uuid($input: UuidSetStateInput!) {
        uuid {
          setState(input: $input) {
            success
          }
        }
      }
    `,
    variables: { input: { id: article.id, trashed: true } },
    data: { uuid: { setState: { success: true } } },
  })
})

test('UnrevisedEntitiesQuery', async () => {
  await addMessageInteraction({
    given: 'entity with id 1855 has unrevised revisions',
    message: { type: 'UnrevisedEntitiesQuery', payload: {} },
    responseBody: {
      unrevisedEntityIds: Matchers.eachLike(1855),
    },
  })

  const { unrevisedEntityIds } = await global.serloModel.getUnrevisedEntities()
  expect(unrevisedEntityIds).toEqual([1855])
})
