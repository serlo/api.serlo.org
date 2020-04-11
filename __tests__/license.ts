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

import { Service } from '../src/graphql/schema/types'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  assertSuccessfulGraphQLQuery,
} from './__utils__/assertions'
import { createTestClient } from './__utils__/test-client'

test('_removeLicense (forbidden)', async () => {
  const { client } = createTestClient({ service: Service.Playground })
  await assertFailingGraphQLMutation(
    {
      mutation: gql`
        mutation {
          _removeLicense(id: 1)
        }
      `,
      client,
    },
    (errors) => {
      expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
    }
  )
})

test('_removeLicense (authenticated)', async () => {
  const { client } = createTestClient({ service: Service.Serlo })
  await assertSuccessfulGraphQLMutation({
    mutation: gql`
      mutation {
        _removeLicense(id: 1)
      }
    `,
    client,
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      {
        license(id: 1) {
          id
        }
      }
    `,
    data: { license: null },
    client,
  })
})

test('_setLicense (forbidden)', async () => {
  const { client } = createTestClient({ service: Service.Playground })
  await assertFailingGraphQLMutation(
    {
      mutation: gql`
        mutation {
          _setLicense(
            id: 1
            instance: de
            default: true
            title: "title"
            url: "url"
            content: "content"
            agreement: "agreement"
            iconHref: "iconHref"
          )
        }
      `,
      client,
    },
    (errors) => {
      expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
    }
  )
})

test('_setLicense (authenticated)', async () => {
  const { client } = createTestClient({ service: Service.Serlo })
  await assertSuccessfulGraphQLMutation({
    mutation: gql`
      mutation {
        _setLicense(
          id: 1
          instance: de
          default: true
          title: "title"
          url: "url"
          content: "content"
          agreement: "agreement"
          iconHref: "iconHref"
        )
      }
    `,
    client,
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      {
        license(id: 1) {
          id
          instance
          default
          title
          url
          content
          agreement
          iconHref
        }
      }
    `,
    data: {
      license: {
        id: 1,
        instance: 'de',
        default: true,
        title: 'title',
        url: 'url',
        content: 'content',
        agreement: 'agreement',
        iconHref: 'iconHref',
      },
    },
    client,
  })
})
