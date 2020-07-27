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

import {
  groupedExercise,
  groupedExerciseRevision,
  getGroupedExerciseDataWithoutSubResolvers,
  getGroupedExerciseRevisionDataWithoutSubResolvers,
} from '../../../__fixtures__'
import { Service } from '../../../src/graphql/schema/types'
import {
  assertSuccessfulGraphQLQuery,
  Client,
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

describe('GroupedExercise', () => {
  beforeEach(() => {
    global.server.use(createUuidHandler(groupedExercise))
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query groupedExercise($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on GroupedExercise {
              id
              trashed
              instance
              alias
              date
            }
          }
        }
      `,
      variables: groupedExercise,
      data: {
        uuid: getGroupedExerciseDataWithoutSubResolvers(groupedExercise),
      },
      client,
    })
  })

  test('by id (w/ currentRevision)', async () => {
    global.server.use(createUuidHandler(groupedExerciseRevision))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query groupedExercise($id: Int!) {
          uuid(id: $id) {
            ... on GroupedExercise {
              currentRevision {
                __typename
                id
                trashed
                date
                content
                changes
              }
            }
          }
        }
      `,
      variables: groupedExercise,
      data: {
        uuid: {
          currentRevision: getGroupedExerciseRevisionDataWithoutSubResolvers(
            groupedExerciseRevision
          ),
        },
      },
      client,
    })
  })
})

describe('GroupedExerciseRevision', () => {
  beforeEach(() => {
    global.server.use(createUuidHandler(groupedExerciseRevision))
  })

  test('by id', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query groupedExerciseRevision($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on GroupedExerciseRevision {
              id
              trashed
              date
              content
              changes
            }
          }
        }
      `,
      variables: groupedExerciseRevision,
      data: {
        uuid: getGroupedExerciseRevisionDataWithoutSubResolvers(
          groupedExerciseRevision
        ),
      },
      client,
    })
  })

  test('by id (w/ groupedExercise)', async () => {
    global.server.use(createUuidHandler(groupedExercise))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query applet($id: Int!) {
          uuid(id: $id) {
            ... on GroupedExerciseRevision {
              groupedExercise {
                __typename
                id
                trashed
                instance
                alias
                date
              }
            }
          }
        }
      `,
      variables: groupedExerciseRevision,
      data: {
        uuid: {
          groupedExercise: getGroupedExerciseDataWithoutSubResolvers(
            groupedExercise
          ),
        },
      },
      client,
    })
  })
})
