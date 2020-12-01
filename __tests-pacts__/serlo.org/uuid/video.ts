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

import {
  getVideoDataWithoutSubResolvers,
  getVideoRevisionDataWithoutSubResolvers,
  video,
  videoRevision,
} from '../../../__fixtures__'
import { VideoPayload, VideoRevisionPayload } from '../../../src/graphql/schema'
import {
  addUuidInteraction,
  assertSuccessfulGraphQLQuery,
} from '../../__utils__'

test('Video', async () => {
  await addUuidInteraction<VideoPayload>({
    __typename: video.__typename,
    id: video.id,
    trashed: Matchers.boolean(video.trashed),
    instance: Matchers.string(video.instance),
    alias: video.alias ? Matchers.string(video.alias) : null,
    date: Matchers.iso8601DateTime(video.date),
    currentRevisionId: video.currentRevisionId
      ? Matchers.integer(video.currentRevisionId)
      : null,
    revisionIds: Matchers.eachLike(video.revisionIds[0]),
    licenseId: Matchers.integer(video.licenseId),
    taxonomyTermIds:
      video.taxonomyTermIds.length > 0
        ? Matchers.eachLike(Matchers.like(video.taxonomyTermIds[0]))
        : [],
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
        {
          uuid(id: ${video.id}) {
            __typename
            ... on Video {
              id
              trashed
              instance
              date
            }
          }
        }
      `,
    data: {
      uuid: getVideoDataWithoutSubResolvers(video),
    },
  })
})

test('VideoRevision', async () => {
  await addUuidInteraction<VideoRevisionPayload>({
    __typename: videoRevision.__typename,
    id: videoRevision.id,
    trashed: Matchers.boolean(videoRevision.trashed),
    alias: null,
    date: Matchers.iso8601DateTime(videoRevision.date),
    authorId: Matchers.integer(videoRevision.authorId),
    repositoryId: Matchers.integer(videoRevision.repositoryId),
    title: Matchers.string(videoRevision.title),
    content: Matchers.string(videoRevision.content),
    url: Matchers.string(videoRevision.url),
    changes: Matchers.string(videoRevision.changes),
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
        {
          uuid(id: ${videoRevision.id}) {
            __typename
            ... on VideoRevision {
              id
              trashed
              date
              title
              content
              url
              changes
            }
          }
        }
      `,
    data: {
      uuid: getVideoRevisionDataWithoutSubResolvers(videoRevision),
    },
  })
})
