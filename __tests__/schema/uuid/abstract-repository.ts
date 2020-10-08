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
  createRepositoryLicenseQuery,
  event,
  eventRevision,
  exercise,
  exerciseGroup,
  exerciseGroupRevision,
  exerciseRevision,
  getRepositoryDataWithoutSubResolvers,
  getRevisionDataWithoutSubResolvers,
  getUserDataWithoutSubResolvers,
  groupedExercise,
  groupedExerciseRevision,
  license,
  page,
  pageRevision,
  solution,
  solutionRevision,
  user,
  video,
  videoRevision,
} from '../../../__fixtures__'
import {
  DiscriminatorType,
  EntityRevisionType,
  EntityType,
  RepositoryPayload,
  RepositoryType,
  RevisionPayload,
  RevisionType,
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
    service: Service.SerloCloudflareWorker,
    user: null,
  }).client
})

const repositoryFixtures: Record<
  RepositoryType,
  {
    repository: RepositoryPayload
    revision: RevisionPayload
    revisionType: RevisionType
  }
> = {
  [EntityType.Applet]: {
    repository: applet,
    revision: appletRevision,
    revisionType: EntityRevisionType.AppletRevision,
  },
  [EntityType.Article]: {
    repository: article,
    revision: articleRevision,
    revisionType: EntityRevisionType.ArticleRevision,
  },
  [EntityType.Course]: {
    repository: course,
    revision: courseRevision,
    revisionType: EntityRevisionType.CourseRevision,
  },
  [EntityType.CoursePage]: {
    repository: coursePage,
    revision: coursePageRevision,
    revisionType: EntityRevisionType.CoursePageRevision,
  },
  [EntityType.Event]: {
    repository: event,
    revision: eventRevision,
    revisionType: EntityRevisionType.EventRevision,
  },
  [EntityType.Exercise]: {
    repository: exercise,
    revision: exerciseRevision,
    revisionType: EntityRevisionType.ExerciseRevision,
  },
  [EntityType.ExerciseGroup]: {
    repository: exerciseGroup,
    revision: exerciseGroupRevision,
    revisionType: EntityRevisionType.ExerciseGroupRevision,
  },
  [EntityType.GroupedExercise]: {
    repository: groupedExercise,
    revision: groupedExerciseRevision,
    revisionType: EntityRevisionType.GroupedExerciseRevision,
  },
  [EntityType.Solution]: {
    repository: solution,
    revision: solutionRevision,
    revisionType: EntityRevisionType.SolutionRevision,
  },
  [EntityType.Video]: {
    repository: video,
    revision: videoRevision,
    revisionType: EntityRevisionType.VideoRevision,
  },
  [DiscriminatorType.Page]: {
    repository: page,
    revision: pageRevision,
    revisionType: DiscriminatorType.PageRevision,
  },
}
const repositoryCases = R.toPairs(repositoryFixtures) as Array<
  [
    RepositoryType,
    {
      repository: RepositoryPayload
      revision: RevisionPayload
      revisionType: RevisionType
    }
  ]
>

describe('Repository', () => {
  test.each(repositoryCases)('%s by id', async (type, { repository }) => {
    global.server.use(createUuidHandler(repository))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query repository($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on AbstractRepository {
              id
              trashed
              alias
              date
            }
          }
        }
      `,
      variables: repository,
      data: {
        uuid: getRepositoryDataWithoutSubResolvers(repository),
      },
      client,
    })
  })

  test.each(repositoryCases)(
    '%s by alias (url-encoded)',
    async (type, { repository }) => {
      global.server.use(
        createUuidHandler(repository),
        createAliasHandler({
          id: repository.id,
          instance: repository.instance,
          path: '/ü',
          source: `/source`,
          timestamp: 'timestamp',
        })
      )
      await assertSuccessfulGraphQLQuery({
        query: gql`
          query repository($alias: AliasInput!) {
            uuid(alias: $alias) {
              __typename
              ... on AbstractRepository {
                id
                trashed
                alias
                date
              }
            }
          }
        `,
        variables: {
          alias: {
            instance: repository.instance,
            path: '/%C3%BC',
          },
        },
        data: {
          uuid: getRepositoryDataWithoutSubResolvers(repository),
        },
        client,
      })
    }
  )

  test.each(repositoryCases)(
    '%s by alias (/:id)',
    async (type, { repository }) => {
      global.server.use(
        createUuidHandler(repository),
        createAliasHandler({
          id: repository.id,
          instance: repository.instance,
          path: '/path',
          source: `/source`,
          timestamp: 'timestamp',
        })
      )
      await assertSuccessfulGraphQLQuery({
        query: gql`
          query repository($alias: AliasInput!) {
            uuid(alias: $alias) {
              __typename
              ... on AbstractRepository {
                id
                trashed
                alias
                date
              }
            }
          }
        `,
        variables: {
          alias: {
            instance: repository.instance,
            path: `/${repository.id}`,
          },
        },
        data: {
          uuid: getRepositoryDataWithoutSubResolvers(repository),
        },
        client,
      })
    }
  )

  test.each(repositoryCases)(
    '%s by id (w/ currentRevision)',
    async (type, { repository, revision }) => {
      global.server.use(
        createUuidHandler(repository),
        createUuidHandler(revision)
      )
      await assertSuccessfulGraphQLQuery({
        query: `
          query repository($id: Int!) {
            uuid(id: $id) {
              ... on ${type} {
                currentRevision {
                  __typename
                  id
                  trashed
                  date
                }
              }
            }
          }
        `,
        variables: repository,
        data: {
          uuid: {
            currentRevision: getRevisionDataWithoutSubResolvers(revision),
          },
        },
        client,
      })
    }
  )

  test.each(repositoryCases)(
    '%s by id (w/ license)',
    async (type, { repository }) => {
      global.server.use(
        createUuidHandler(repository),
        createLicenseHandler(license)
      )
      await assertSuccessfulGraphQLQuery({
        ...createRepositoryLicenseQuery(repository),
        data: {
          uuid: {
            license,
          },
        },
        client,
      })
    }
  )
})

describe('Revision', () => {
  test.each(repositoryCases)(
    '%s by id (w/ author)',
    async (type, { revision }) => {
      global.server.use(createUuidHandler(revision), createUuidHandler(user))
      await assertSuccessfulGraphQLQuery({
        query: gql`
          query revision($id: Int!) {
            uuid(id: $id) {
              ... on AbstractRevision {
                author {
                  __typename
                  id
                  trashed
                  alias
                  username
                  date
                  lastLogin
                  description
                }
              }
            }
          }
        `,
        variables: revision,
        data: {
          uuid: {
            author: getUserDataWithoutSubResolvers(user),
          },
        },
        client,
      })
    }
  )

  test.each(repositoryCases)(
    '%s by id (w/ repository)',
    async (type, { repository, revision, revisionType }) => {
      global.server.use(
        createUuidHandler(repository),
        createUuidHandler(revision)
      )
      await assertSuccessfulGraphQLQuery({
        query: `
            query revision($id: Int!) {
              uuid(id: $id) {
                ... on ${revisionType} {
                  repository {
                    __typename
                    id
                    trashed
                    alias
                    date
                  }
                }
              }
            }
          `,
        variables: revision,
        data: {
          uuid: {
            repository: getRepositoryDataWithoutSubResolvers(repository),
          },
        },
        client,
      })
    }
  )
})
