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
  applet,
  appletRevision,
  article,
  articleRevision,
  course,
  coursePage,
  coursePageRevision,
  courseRevision,
  createEntityLicenseQuery,
  event,
  eventRevision,
  exercise,
  exerciseGroup,
  exerciseGroupRevision,
  exerciseRevision,
  getEntityDataWithoutSubResolvers,
  groupedExercise,
  groupedExerciseRevision,
  license,
  solution,
  solutionRevision,
  user,
  video,
  videoRevision,
} from '../../../__fixtures__'
import {
  EntityPayload,
  EntityRevisionPayload,
  EntityRevisionType,
  EntityType,
} from '../../../src/graphql/schema'
import { Service } from '../../../src/graphql/schema/types'
import {
  assertSuccessfulGraphQLQuery,
  Client,
  createAliasHandler,
  createLicenseHandler,
  createTestClient,
  createUuidHandler,
} from '../../__utils__'

let client: Client

beforeEach(() => {
  client = createTestClient({
    service: Service.Playground,
    user: null,
  }).client
})

describe('Entity', () => {
  const entityFixtures: Record<EntityType, EntityPayload> = {
    [EntityType.Applet]: applet,
    [EntityType.Article]: article,
    [EntityType.Course]: course,
    [EntityType.CoursePage]: coursePage,
    [EntityType.Event]: event,
    [EntityType.Exercise]: exercise,
    [EntityType.ExerciseGroup]: exerciseGroup,
    [EntityType.GroupedExercise]: groupedExercise,
    [EntityType.Solution]: solution,
    [EntityType.Video]: video,
  }
  const entityCases = R.toPairs(entityFixtures) as Array<
    [EntityType, EntityPayload]
  >

  test.each(entityCases)('%s by id', async (type, entity) => {
    global.server.use(createUuidHandler(entity))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query entity($id: Int!) {
          uuid(id: $id) {
            __typename
            id
            trashed
            ... on AbstractEntity {
              instance
              alias
              date
            }
          }
        }
      `,
      variables: entity,
      data: {
        uuid: getEntityDataWithoutSubResolvers(entity),
      },
      client,
    })
  })

  test.each(entityCases)('%s by alias', async (type, entity) => {
    global.server.use(
      createUuidHandler(entity),
      createAliasHandler({
        id: entity.id,
        instance: entity.instance,
        path: '/path',
        source: `/entity/view/${entity.id}`,
        timestamp: 'timestamp',
      })
    )
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query entity($alias: AliasInput) {
          uuid(alias: $alias) {
            __typename
            id
            trashed
            ... on AbstractEntity {
              instance
              alias
              date
            }
          }
        }
      `,
      variables: {
        alias: {
          instance: entity.instance,
          path: '/path',
        },
      },
      data: {
        uuid: getEntityDataWithoutSubResolvers(entity),
      },
      client,
    })
  })

  test.each(entityCases)('%s by id (w/ license)', async (type, entity) => {
    global.server.use(createUuidHandler(entity), createLicenseHandler(license))
    await assertSuccessfulGraphQLQuery({
      ...createEntityLicenseQuery(entity),
      variables: entity,
      data: {
        uuid: {
          license,
        },
      },
      client,
    })
  })
})

describe('EntityRevision', () => {
  const entityRevisionFixtures: Record<
    EntityRevisionType,
    EntityRevisionPayload
  > = {
    [EntityRevisionType.AppletRevision]: appletRevision,
    [EntityRevisionType.ArticleRevision]: articleRevision,
    [EntityRevisionType.CourseRevision]: courseRevision,
    [EntityRevisionType.CoursePageRevision]: coursePageRevision,
    [EntityRevisionType.EventRevision]: eventRevision,
    [EntityRevisionType.ExerciseRevision]: exerciseRevision,
    [EntityRevisionType.ExerciseGroupRevision]: exerciseGroupRevision,
    [EntityRevisionType.GroupedExerciseRevision]: groupedExerciseRevision,
    [EntityRevisionType.SolutionRevision]: solutionRevision,
    [EntityRevisionType.VideoRevision]: videoRevision,
  }
  const entityRevisionCases = R.toPairs(entityRevisionFixtures) as Array<
    [EntityRevisionType, EntityRevisionPayload]
  >

  test.each(entityRevisionCases)(
    '%s by id (w/ author)',
    async (type, entityRevision) => {
      global.server.use(
        createUuidHandler(entityRevision),
        createUuidHandler(user)
      )
      await assertSuccessfulGraphQLQuery({
        query: gql`
          query entityRevision($id: Int!) {
            uuid(id: $id) {
              ... on AbstractEntityRevision {
                author {
                  __typename
                  id
                  trashed
                  username
                  date
                  lastLogin
                  description
                }
              }
            }
          }
        `,
        variables: entityRevision,
        data: {
          uuid: {
            author: user,
          },
        },
        client,
      })
    }
  )
})
