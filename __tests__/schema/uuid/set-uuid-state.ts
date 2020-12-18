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
import { gql } from 'apollo-server'
import { rest } from 'msw'

import { article, user, user2 } from '../../../__fixtures__'
import { MutationSetUuidStateArgs } from '../../../src/types'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  createTestClient,
  Client,
} from '../../__utils__'
import { Service } from '~/internals/auth'

let client: Client
beforeEach(() => {
  client = createTestClient({
    service: Service.Serlo,
    user: user.id,
  })
})

describe('setUuidState', () => {
  test('authenticated', async () => {
    global.server.use(
      rest.post(
        `http://de.${process.env.SERLO_ORG_HOST}/api/set-uuid-state/${article.id}`,
        (req, res, ctx) => {
          return res(
            ctx.json({
              ...article,
              trashed: false,
            })
          )
        }
      )
    )
    await assertSuccessfulGraphQLMutation({
      ...createSetUuidStateMutation({
        id: 1,
        trashed: false,
      }),
      client,
      //TODO: Add data
    })
  })

  test('unauthenticated', async () => {
    const client = createTestClient({
      service: Service.SerloCloudflareWorker,
      user: null,
    })
    await assertFailingGraphQLMutation(
      {
        ...createSetUuidStateMutation({ id: 1, trashed: false }),
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('UNAUTHENTICATED')
      }
    )
  })

  test('wrong user id', async () => {
    global.server.use(
      rest.post(
        `http://de.${process.env.SERLO_ORG_HOST}/api/set-uuid-state/1`,
        (req, res, ctx) => {
          return res(ctx.status(403), ctx.json({}))
        }
      )
    )
    const client = createTestClient({
      service: Service.SerloCloudflareWorker,
      user: user2.id,
    })
    await assertFailingGraphQLMutation(
      {
        ...createSetUuidStateMutation({ id: 1, trashed: false }),
        client,
      },
      (errors) => {
        expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
      }
    )
  })

  function createSetUuidStateMutation(variables: MutationSetUuidStateArgs) {
    return {
      mutation: gql`
        mutation setUuidState($id: Int!, $trashed: Boolean!) {
          setUuidState(id: $id, trashed: $trashed)
        }
      `,
      variables,
    }
  }
})
