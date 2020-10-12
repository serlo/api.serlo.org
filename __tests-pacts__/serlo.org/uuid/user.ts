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

import { getUserDataWithoutSubResolvers, user } from '../../../__fixtures__'
import { UserPayload } from '../../../src/graphql/schema/uuid/user'
import {
  addUuidInteraction,
  assertSuccessfulGraphQLQuery,
} from '../../__utils__'

test('User', async () => {
  await addUuidInteraction<UserPayload>({
    __typename: user.__typename,
    id: user.id,
    trashed: Matchers.boolean(user.trashed),
    username: Matchers.string(user.username),
    date: Matchers.iso8601DateTime(user.date),
    lastLogin: user.lastLogin ? Matchers.iso8601DateTime(user.lastLogin) : null,
    description: user.description ? Matchers.string(user.description) : null,
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query article($id: Int!) {
        uuid(id: $id) {
          __typename
          ... on User {
            id
            trashed
            alias
            username
            date
            lastLogin
            description
          }
        }
      }
    `,
    variables: user,
    data: {
      uuid: getUserDataWithoutSubResolvers(user),
    },
  })
})
