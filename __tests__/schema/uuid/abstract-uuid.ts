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
import * as R from 'ramda'

import {
  event,
  user,
  page,
  pageRevision,
  taxonomyTermRoot,
  applet,
  article,
  video,
  course,
  coursePage,
  groupedExercise,
  exercise,
  exerciseGroup,
  solution,
  appletRevision,
  articleRevision,
  courseRevision,
  coursePageRevision,
  exerciseRevision,
  exerciseGroupRevision,
  groupedExerciseRevision,
  solutionRevision,
  videoRevision,
  eventRevision,
} from '../../../__fixtures__'
import { EntityType, EntityRevisionType } from '../../../src/graphql/schema'
import { Service } from '../../../src/graphql/schema/types'
import {
  DiscriminatorType,
  UuidType,
  UuidPayload,
} from '../../../src/graphql/schema/uuid/abstract-uuid/types'
import {
  assertSuccessfulGraphQLQuery,
  Client,
  createTestClient,
  createUuidHandler,
} from '../../__utils__'

let client: Client

beforeEach(() => {
  client = createTestClient({
    service: Service.SerloCloudflareWorker,
    user: null,
  }).client
})

const abstractUuidFixtures: Record<
  // Endpoint uuid() returns null for comments
  Exclude<UuidType, DiscriminatorType.Comment>,
  UuidPayload
> = {
  [DiscriminatorType.Page]: page,
  [DiscriminatorType.PageRevision]: pageRevision,
  [DiscriminatorType.TaxonomyTerm]: taxonomyTermRoot,
  [DiscriminatorType.User]: user,
  [EntityType.Applet]: applet,
  [EntityType.Article]: article,
  [EntityType.Course]: course,
  [EntityType.CoursePage]: coursePage,
  [EntityType.Exercise]: exercise,
  [EntityType.ExerciseGroup]: exerciseGroup,
  [EntityType.Event]: event,
  [EntityType.GroupedExercise]: groupedExercise,
  [EntityType.Solution]: solution,
  [EntityType.Video]: video,
  [EntityRevisionType.AppletRevision]: appletRevision,
  [EntityRevisionType.ArticleRevision]: articleRevision,
  [EntityRevisionType.CourseRevision]: courseRevision,
  [EntityRevisionType.CoursePageRevision]: coursePageRevision,
  [EntityRevisionType.ExerciseRevision]: exerciseRevision,
  [EntityRevisionType.ExerciseGroupRevision]: exerciseGroupRevision,
  [EntityRevisionType.EventRevision]: eventRevision,
  [EntityRevisionType.GroupedExerciseRevision]: groupedExerciseRevision,
  [EntityRevisionType.SolutionRevision]: solutionRevision,
  [EntityRevisionType.VideoRevision]: videoRevision,
}
const abstractUuidRepository = R.toPairs(abstractUuidFixtures)

describe('property "alias"', () => {
  describe('returns encoded alias when alias of payloads is a string', () => {
    test.each(abstractUuidRepository.filter(aliasIsString))(
      'type = %s',
      async (_type, payload) => {
        global.server.use(createUuidHandler({ ...payload, alias: '/%%/größe' }))

        await assertSuccessfulGraphQLQuery({
          query: gql`
            query($id: Int) {
              uuid(id: $id) {
                alias
              }
            }
          `,
          variables: { id: payload.id },
          data: { uuid: { alias: '/%25%25/gr%C3%B6%C3%9Fe' } },
          client,
        })
      }
    )
  })

  describe('returns null when alias of payload = null', () => {
    test.each(abstractUuidRepository.filter(aliasIsNull))(
      'type = %s',
      async (_type, payload) => {
        global.server.use(createUuidHandler(payload))

        await assertSuccessfulGraphQLQuery({
          query: gql`
            query($id: Int) {
              uuid(id: $id) {
                alias
              }
            }
          `,
          variables: { id: payload.id },
          data: { uuid: { alias: null } },
          client,
        })
      }
    )
  })
})

function aliasIsNull(
  testCase: [string, UuidPayload]
): testCase is [string, UuidPayload & { alias: null }] {
  return testCase[1].alias === null
}

function aliasIsString(
  testCase: [string, UuidPayload]
): testCase is [string, UuidPayload & { alias: string }] {
  return typeof testCase[1].alias === 'string'
}
