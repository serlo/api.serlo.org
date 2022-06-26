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
import { gql } from 'apollo-server'
import R from 'ramda'

import { page, pageRevision, license } from '../../../__fixtures__'
import { given, Client } from '../../__utils__'

describe('Page', () => {
  beforeEach(() => {
    given('UuidQuery').for(page)
  })

  test('by id', async () => {
    await new Client()
      .prepareQuery({
        query: gql`
          query page($id: Int!) {
            uuid(id: $id) {
              __typename
              ... on Page {
                id
                trashed
                instance
                date
              }
            }
          }
        `,
        variables: page,
      })
      .shouldReturnData({
        uuid: R.pick(['__typename', 'id', 'trashed', 'instance', 'date'], page),
      })
  })

  test('by id (w/ license)', async () => {
    await new Client()
      .prepareQuery({
        query: gql`
          query page($id: Int!) {
            uuid(id: $id) {
              ... on Page {
                license {
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
            }
          }
        `,
        variables: page,
      })
      .shouldReturnData({
        uuid: {
          license,
        },
      })
  })
})

test('PageRevision', async () => {
  given('UuidQuery').for(pageRevision)

  await new Client()
    .prepareQuery({
      query: gql`
        query pageRevision($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on PageRevision {
              id
              trashed
              title
              content
              date
            }
          }
        }
      `,
      variables: pageRevision,
    })
    .shouldReturnData({
      uuid: R.pick(
        ['__typename', 'id', 'trashed', 'title', 'content', 'date'],
        pageRevision
      ),
    })
})
