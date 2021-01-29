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
import { gql } from 'apollo-server'

import {
  applet,
  appletRevision,
  getAppletDataWithoutSubResolvers,
  getAppletRevisionDataWithoutSubResolvers,
} from '../../../__fixtures__'
import {
  addUuidInteraction,
  assertSuccessfulGraphQLQuery,
} from '../../__utils__'
import { AppletPayload, AppletRevisionPayload } from '~/schema/uuid'

test('Applet', async () => {
  await addUuidInteraction<AppletPayload>({
    __typename: applet.__typename,
    id: applet.id,
    trashed: Matchers.boolean(applet.trashed),
    instance: Matchers.string(applet.instance),
    alias: Matchers.string(applet.alias),
    date: Matchers.iso8601DateTime(applet.date),
    currentRevisionId: applet.currentRevisionId
      ? Matchers.integer(applet.currentRevisionId)
      : null,
    revisionIds: Matchers.eachLike(applet.revisionIds[0]),
    licenseId: Matchers.integer(applet.licenseId),
    taxonomyTermIds:
      applet.taxonomyTermIds.length > 0
        ? Matchers.eachLike(Matchers.like(applet.taxonomyTermIds[0]))
        : [],
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query applet($id: Int!) {
        uuid(id: $id) {
          __typename
          ... on Applet {
            id
            trashed
            instance
            date
          }
        }
      }
    `,
    variables: applet,
    data: {
      uuid: getAppletDataWithoutSubResolvers(applet),
    },
  })
})

test('AppletRevision', async () => {
  await addUuidInteraction<AppletRevisionPayload>({
    __typename: appletRevision.__typename,
    id: appletRevision.id,
    trashed: Matchers.boolean(appletRevision.trashed),
    alias: Matchers.string(appletRevision.alias),
    date: Matchers.iso8601DateTime(appletRevision.date),
    authorId: Matchers.integer(appletRevision.authorId),
    repositoryId: Matchers.integer(appletRevision.repositoryId),
    title: Matchers.string(appletRevision.title),
    url: Matchers.string(appletRevision.url),
    content: Matchers.string(appletRevision.content),
    changes: Matchers.string(appletRevision.changes),
    metaTitle: Matchers.string(appletRevision.metaTitle),
    metaDescription: Matchers.string(appletRevision.metaDescription),
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query appletRevision($id: Int!) {
        uuid(id: $id) {
          __typename
          ... on AppletRevision {
            id
            trashed
            date
            url
            title
            content
            changes
            metaTitle
            metaDescription
          }
        }
      }
    `,
    variables: appletRevision,
    data: {
      uuid: getAppletRevisionDataWithoutSubResolvers(appletRevision),
    },
  })
})
