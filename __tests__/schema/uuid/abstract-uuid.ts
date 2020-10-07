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
  getAbstractNotificationEventDataWithoutSubResolvers,
  createEntityNotificationEvent,
  createTaxonomyTermNotificationEvent,
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
  createNotificationEventHandler,
  createEventsHandler,
} from '../../__utils__'

let client: Client

beforeEach(() => {
  client = createTestClient({
    service: Service.SerloCloudflareWorker,
    user: null,
  }).client
})

const abstractUuidFixtures: Record<UuidType, UuidPayload> = {
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

describe('property "uuidEvents"', () => {
  const event1 = { ...createEntityNotificationEvent, id: 1 }
  const event2 = { ...createTaxonomyTermNotificationEvent, id: 2 }

  describe.each(abstractUuidRepository)('type %s', (_type, payload) => {
    beforeEach(() => {
      global.server.use(
        createUuidHandler(payload),
        createNotificationEventHandler(event1),
        createNotificationEventHandler(event2)
      )
    })

    test('without any filter', async () => {
      global.server.use(
        createEventsHandler(
          { eventIds: [2, 1], totalCount: 2 },
          { uuid: payload.id.toString() }
        )
      )

      await assertSuccessfulGraphQLQuery({
        query: gql`
          query events($id: Int) {
            uuid(id: $id) {
              ... on AbstractUuid {
                uuidEvents {
                  totalCount
                  nodes {
                    ... on AbstractNotificationEvent {
                      __typename
                      id
                      instance
                      date
                    }
                  }
                }
              }
            }
          }
        `,
        data: {
          uuid: {
            uuidEvents: {
              totalCount: 2,
              nodes: [
                getAbstractNotificationEventDataWithoutSubResolvers(event2),
                getAbstractNotificationEventDataWithoutSubResolvers(event1),
              ],
            },
          },
        },
        variables: { id: payload.id },
        client,
      })
    })

    test.each([
      ['after', `"MTA="`],
      ['before', '"MTA="'],
      ['first', '10'],
      ['last', '10'],
    ])('with filter %s', async (filterName, filterValue) => {
      global.server.use(
        createEventsHandler(
          { eventIds: [2, 1], totalCount: 2 },
          { uuid: payload.id.toString(), [filterName]: '10' }
        )
      )

      await assertSuccessfulGraphQLQuery({
        query: gql`
        query events($id: Int) {
          uuid(id: $id) {
            ... on AbstractUuid {
              uuidEvents(${filterName}: ${filterValue}) {
                totalCount
                nodes {
                  ... on AbstractNotificationEvent {
                    __typename
                    id
                    instance
                    date
                  }
                }
              }
            }
          }
        }
      `,
        data: {
          uuid: {
            uuidEvents: {
              totalCount: 2,
              nodes: [
                getAbstractNotificationEventDataWithoutSubResolvers(event2),
                getAbstractNotificationEventDataWithoutSubResolvers(event1),
              ],
            },
          },
        },
        variables: { id: payload.id },
        client,
      })
    })
  })
})
