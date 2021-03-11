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
  event,
  eventRevision,
  getEventDataWithoutSubResolvers,
  getEventRevisionDataWithoutSubResolvers,
} from '../../../__fixtures__'
import {
  addUuidInteraction,
  assertSuccessfulGraphQLQuery,
} from '../../__utils__'
import { ModelOf } from '~/model'
import { EventRevision, Event } from '~/types'

test('Event', async () => {
  await addUuidInteraction<ModelOf<Event>>({
    __typename: event.__typename,
    id: event.id,
    trashed: Matchers.boolean(event.trashed),
    instance: Matchers.string(event.instance),
    alias: Matchers.string(event.alias),
    date: Matchers.iso8601DateTime(event.date),
    currentRevisionId: event.currentRevisionId
      ? Matchers.integer(event.currentRevisionId)
      : null,
    revisionIds: Matchers.eachLike(event.revisionIds[0]),
    licenseId: Matchers.integer(event.licenseId),
    taxonomyTermIds:
      event.taxonomyTermIds.length > 0
        ? Matchers.eachLike(Matchers.like(event.taxonomyTermIds[0]))
        : [],
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
        {
          uuid(id: ${event.id}) {
            __typename
            ... on Event {
              id
              trashed
              instance
              date
            }
          }
        }
      `,
    data: {
      uuid: getEventDataWithoutSubResolvers(event),
    },
  })
})

test('EventRevision', async () => {
  await addUuidInteraction<ModelOf<EventRevision>>({
    __typename: eventRevision.__typename,
    id: eventRevision.id,
    trashed: Matchers.boolean(eventRevision.trashed),
    alias: Matchers.string(eventRevision.alias),
    date: Matchers.iso8601DateTime(eventRevision.date),
    authorId: Matchers.integer(eventRevision.authorId),
    repositoryId: Matchers.integer(eventRevision.repositoryId),
    title: Matchers.string(eventRevision.title),
    content: Matchers.string(eventRevision.content),
    changes: Matchers.string(eventRevision.changes),
    metaTitle: Matchers.string(eventRevision.metaTitle),
    metaDescription: Matchers.string(eventRevision.metaDescription),
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
        {
          uuid(id: ${eventRevision.id}) {
            __typename
            ... on EventRevision {
              id
              trashed
              date
              title
              content
              changes
              metaTitle
              metaDescription
            }
          }
        }
      `,
    data: {
      uuid: getEventRevisionDataWithoutSubResolvers(eventRevision),
    },
  })
})
