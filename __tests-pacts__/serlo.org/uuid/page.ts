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
import { Matchers } from '@pact-foundation/pact'
import { gql } from 'apollo-server'

import {
  getPageDataWithoutSubResolvers,
  getPageRevisionDataWithoutSubResolvers,
  page,
  pageRevision,
} from '../../../__fixtures__'
import {
  addUuidInteraction,
  assertSuccessfulGraphQLQuery,
} from '../../__utils__'
import { PagePayload, PageRevisionPayload } from '~/schema/uuid'

test('Page', async () => {
  await addUuidInteraction<PagePayload>({
    __typename: page.__typename,
    id: page.id,
    trashed: Matchers.boolean(page.trashed),
    instance: Matchers.string(page.instance),
    alias: page.alias ? Matchers.string(page.alias) : null,
    date: Matchers.iso8601DateTime(page.date),
    currentRevisionId: page.currentRevisionId
      ? Matchers.integer(page.currentRevisionId)
      : null,
    revisionIds: Matchers.eachLike(page.revisionIds[0]),
    licenseId: Matchers.integer(page.licenseId),
  })
  await assertSuccessfulGraphQLQuery({
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
    data: {
      uuid: getPageDataWithoutSubResolvers(page),
    },
  })
})

test('PageRevision', async () => {
  await addUuidInteraction<PageRevisionPayload>({
    __typename: pageRevision.__typename,
    id: 35476,
    trashed: Matchers.boolean(pageRevision.trashed),
    alias: null,
    title: Matchers.string(pageRevision.title),
    content: Matchers.string(pageRevision.content),
    date: Matchers.iso8601DateTime(pageRevision.date),
    authorId: Matchers.integer(pageRevision.authorId),
    repositoryId: Matchers.integer(pageRevision.repositoryId),
  })
  await assertSuccessfulGraphQLQuery({
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
    data: {
      uuid: getPageRevisionDataWithoutSubResolvers(pageRevision),
    },
  })
})
