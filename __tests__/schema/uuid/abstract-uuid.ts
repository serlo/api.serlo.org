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
  event,
  eventRevision,
  exercise,
  exerciseGroup,
  exerciseGroupRevision,
  exerciseRevision,
  groupedExercise,
  groupedExerciseRevision,
  page,
  pageRevision,
  solution,
  solutionRevision,
  taxonomyTermRoot,
  user,
  video,
  videoRevision,
} from '../../../__fixtures__'
import {
  assertFailingGraphQLMutation,
  assertFailingGraphQLQuery,
  assertSuccessfulGraphQLMutation,
  assertSuccessfulGraphQLQuery,
  Client,
  createMessageHandler,
  createTestClient,
  createUuidHandler,
  getTypenameAndId,
} from '../../__utils__'
import { Model } from '~/internals/graphql'
import {
  EntityRevisionType,
  EntityType,
  DiscriminatorType,
  UuidType,
} from '~/model/decoder'
import { Instance } from '~/types'

let client: Client

beforeEach(() => {
  client = createTestClient()
})

const abstractUuidFixtures: Record<
  // Endpoint uuid() returns null for comments
  Exclude<UuidType, DiscriminatorType.Comment>,
  Model<'AbstractUuid'>
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

describe('uuid', () => {
  test('returns null when alias cannot be found', async () => {
    global.server.use(
      createMessageHandler({
        message: {
          type: 'AliasQuery',
          payload: {
            instance: Instance.De,
            path: '/not-existing',
          },
        },
        statusCode: 404,
        body: null,
      })
    )

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query notExistingUuid($alias: AliasInput) {
          uuid(alias: $alias) {
            __typename
          }
        }
      `,
      variables: { alias: { instance: Instance.De, path: '/not-existing' } },
      data: { uuid: null },
      client,
    })
  })

  test('returns uuid when alias is /entity/view/:id', async () => {
    global.server.use(createUuidHandler(article))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query uuid($alias: AliasInput!) {
          uuid(alias: $alias) {
            id
            __typename
          }
        }
      `,
      variables: {
        alias: { instance: Instance.De, path: `/entity/view/${article.id}` },
      },
      data: { uuid: getTypenameAndId(article) },
      client,
    })
  })

  test('returns uuid when alias is /:subject/:id/:alias (as hotfix for the current bug in the database layer)', async () => {
    global.server.use(createUuidHandler(article))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query uuid($alias: AliasInput!) {
          uuid(alias: $alias) {
            __typename
            id
          }
        }
      `,
      variables: {
        alias: {
          instance: Instance.De,
          path: `/mathe/${article.id}/das-viereck`,
        },
      },
      data: { uuid: getTypenameAndId(article) },
      client,
    })
  })

  test('returns revision when alias is /entity/repository/compare/:entityId/:revisionId', async () => {
    global.server.use(createUuidHandler(articleRevision))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query uuid($alias: AliasInput!) {
          uuid(alias: $alias) {
            id
          }
        }
      `,
      variables: {
        alias: {
          instance: Instance.De,
          path: `/entity/repository/compare/${article.id}/${articleRevision.id}`,
        },
      },
      data: { uuid: { id: articleRevision.id } },
      client,
    })
  })

  test('returns null when uuid does not exist', async () => {
    global.server.use(
      createMessageHandler({
        message: {
          type: 'UuidQuery',
          payload: { id: 666 },
        },
        body: null,
      })
    )

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query requestNonExistingUuid($id: Int!) {
          uuid(id: $id) {
            __typename
          }
        }
      `,
      variables: { id: 666 },
      data: {
        uuid: null,
      },
      client,
    })
  })

  test('returns null when requested id is too high to be an uuid', async () => {
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query ($path: String!) {
          uuid(alias: { instance: de, path: $path }) {
            __typename
          }
        }
      `,
      variables: { path: '/100000000000000' },
      data: { uuid: null },
      client,
    })
  })

  test('returns an error when alias contains the null character', async () => {
    global.server.use(createUuidHandler({ ...article, alias: '\0\0/1/math' }))

    await assertFailingGraphQLQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            __typename
          }
        }
      `,
      variables: { id: article.id },
      message: expect.stringContaining('Invalid value'),
      client,
    })
  })

  test('returns an error when no arguments are given', async () => {
    await assertFailingGraphQLQuery({
      query: gql`
        query emptyUuidRequest {
          uuid {
            __typename
          }
        }
      `,
      message: 'you need to provide an id or an alias',
      client,
    })
  })

  test("returns an error when the path does not start with '/'", async () => {
    await assertFailingGraphQLQuery({
      query: gql`
        query emptyUuidRequest {
          uuid(alias: { instance: de, path: "mathe" }) {
            __typename
          }
        }
      `,
      message:
        "First is the worst, please add a '/' at the beginning of your path",
      client,
    })
  })

  test('returns an error when request fails (500)', async () => {
    global.server.use(
      createMessageHandler({
        message: {
          type: 'UuidQuery',
          payload: { id: user.id },
        },
        statusCode: 500,
      })
    )

    await assertFailingGraphQLQuery({
      query: gql`
        query user($id: Int!) {
          uuid(id: $id) {
            __typename
          }
        }
      `,
      variables: user,
      message: '500: {"type":"UuidQuery","payload":{"id":1}}',
      client,
    })
  })

  test('succeeds on 404', async () => {
    global.server.use(
      createMessageHandler({
        message: {
          type: 'UuidQuery',
          payload: { id: user.id },
        },
        body: null,
        statusCode: 404,
      })
    )

    await assertSuccessfulGraphQLQuery({
      query: gql`
        query user($id: Int!) {
          uuid(id: $id) {
            __typename
          }
        }
      `,
      variables: user,
      data: {
        uuid: null,
      },
      client,
    })
  })
})

describe('uuid mutation setState', () => {
  const mutation = gql`
    mutation uuid($input: UuidSetStateInput!) {
      uuid {
        setState(input: $input) {
          success
        }
      }
    }
  `

  test('authenticated with array of ids', async () => {
    const ids = [article.id, article.id + 1, article.id + 2]
    global.server.use(
      ...ids.map((id) => createUuidHandler({ ...article, id })),
      createUuidHandler({
        ...user,
        roles: ['de_architect'],
      })
    )
    global.server.use(
      createMessageHandler({
        message: {
          type: 'UuidSetStateMutation',
          payload: {
            ids,
            userId: user.id,
            trashed: true,
          },
        },
      })
    )
    await assertSuccessfulGraphQLMutation({
      mutation,
      variables: {
        input: { id: ids, trashed: true },
      },
      data: { uuid: { setState: { success: true } } },
      client: createTestClient({ userId: user.id }),
    })
  })

  test('unauthenticated', async () => {
    global.server.use(createUuidHandler(user))
    await assertFailingGraphQLMutation({
      mutation,
      variables: { input: { id: 1, trashed: true } },
      client: createTestClient({ userId: null }),
      expectedError: 'UNAUTHENTICATED',
    })
  })

  test('insufficient permissions', async () => {
    // Architects are not allowed to set the state of pages.
    global.server.use(
      createUuidHandler(page),
      createUuidHandler({
        ...user,
        roles: ['de_architect'],
      })
    )
    await assertFailingGraphQLMutation({
      mutation,
      variables: { input: { id: page.id, trashed: false } },
      client: createTestClient({ userId: user.id }),
      expectedError: 'FORBIDDEN',
    })
  })
})

describe('property "alias"', () => {
  describe('returns encoded alias when alias of payloads is a string', () => {
    test.each(abstractUuidRepository)('type = %s', async (_type, payload) => {
      global.server.use(
        createUuidHandler({ ...payload, alias: '/%%/größe', id: 23 })
      )

      await assertSuccessfulGraphQLQuery({
        query: gql`
          query ($id: Int) {
            uuid(id: $id) {
              alias
            }
          }
        `,
        variables: { id: 23 },
        data: { uuid: { alias: '/%25%25/gr%C3%B6%C3%9Fe' } },
        client,
      })
    })
  })
})

describe('custom aliases', () => {
  test('de.serlo.org/mathe resolves to uuid 19767', async () => {
    global.server.use(
      createUuidHandler({
        ...page,
        id: 19767,
        alias: '/legacy-alias',
      })
    )
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query uuid($alias: AliasInput!) {
          uuid(alias: $alias) {
            id
            ... on Page {
              alias
            }
          }
        }
      `,
      variables: {
        alias: { instance: Instance.De, path: '/mathe' },
      },
      data: {
        uuid: { id: 19767, alias: '/mathe' },
      },
      client,
    })
  })
})
