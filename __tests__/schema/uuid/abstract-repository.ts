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
  assertSuccessfulGraphQLQuery,
  Client,
  createAliasHandler,
  createLicenseHandler,
  createTestClient,
  createUuidHandler,
} from '../../__utils__'
import {
  EntityRevisionType,
  EntityType,
} from '~/schema/uuid/abstract-entity/types'
import {
  RepositoryPayload,
  RepositoryType,
  RevisionPayload,
  RevisionType,
} from '~/schema/uuid/abstract-repository/types'
import { DiscriminatorType } from '~/schema/uuid/abstract-uuid/types'

let client: Client

beforeEach(() => {
  client = createTestClient()
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
  test.each(repositoryCases)('%s by id', async (_type, { repository }) => {
    global.server.use(createUuidHandler(repository))
    await assertSuccessfulGraphQLQuery({
      query: gql`
        query repository($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on AbstractRepository {
              id
              trashed
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
    async (_type, { repository }) => {
      global.server.use(
        createUuidHandler(repository),
        createAliasHandler({
          id: repository.id,
          instance: repository.instance,
          path: '/ü',
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
    async (_type, { repository }) => {
      global.server.use(
        createUuidHandler(repository),
        createAliasHandler({
          id: repository.id,
          instance: repository.instance,
          path: '/path',
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
    async (_type, { repository }) => {
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

  describe.each(repositoryCases)(
    '%s by id (w/ revisions)',
    (type, { repository, revision }) => {
      const revisedRevision = { ...revision, id: revision.id - 10 }
      const unrevisedRevision = { ...revision, id: revision.id + 1 }

      beforeEach(() => {
        global.server.use(
          createUuidHandler({
            ...repository,
            revisionIds: [
              unrevisedRevision.id,
              revision.id,
              revisedRevision.id,
            ],
          }),

          createUuidHandler(unrevisedRevision),
          createUuidHandler(revision),
          createUuidHandler(revisedRevision)
        )
      })

      test('returns all revisions when no arguments are given', async () => {
        await assertSuccessfulGraphQLQuery({
          query: `
          query revisionsOfRepository($id: Int!) {
            uuid(id: $id) {
              ... on ${type} {
                revisions {
                  totalCount
                  nodes {
                    __typename
                    id
                    trashed
                    date
                  }
                }
              }
            }
          }
        `,
          variables: { id: repository.id },
          data: {
            uuid: {
              revisions: {
                totalCount: 3,
                nodes: [
                  getRevisionDataWithoutSubResolvers(unrevisedRevision),
                  getRevisionDataWithoutSubResolvers(revision),
                  getRevisionDataWithoutSubResolvers(revisedRevision),
                ],
              },
            },
          },
          client,
        })
      })

      test('returns all unrevised revisions when unrevised=true', async () => {
        await assertSuccessfulGraphQLQuery({
          query: `
              query unrevisedRevisionsOfRepository($id: Int!) {
                uuid(id: $id) {
                  ... on ${type} {
                    revisions (unrevised: true) {
                      totalCount
                      nodes {
                        __typename
                        id
                        trashed
                        date
                      }
                    }
                  }
                }
              }
            `,
          variables: { id: repository.id },
          data: {
            uuid: {
              revisions: {
                nodes: [getRevisionDataWithoutSubResolvers(unrevisedRevision)],
                totalCount: 1,
              },
            },
          },
          client,
        })
      })

      test('when unrevised=true trashed revisions are not included', async () => {
        global.server.use(createUuidHandler(trashed(unrevisedRevision)))

        await assertSuccessfulGraphQLQuery({
          query: `
              query unrevisedRevisionsOfRepository($id: Int!) {
                uuid(id: $id) {
                  ... on ${type} {
                    revisions (unrevised: true) {
                      totalCount
                      nodes {
                        __typename
                      }
                    }
                  }
                }
              }
            `,
          variables: { id: repository.id },
          data: { uuid: { revisions: { nodes: [], totalCount: 0 } } },
          client,
        })
      })

      test('returns all revised revisions when unrevised=false', async () => {
        await assertSuccessfulGraphQLQuery({
          query: `
              query unrevisedRevisionsOfRepository($id: Int!) {
                uuid(id: $id) {
                  ... on ${type} {
                    revisions (unrevised: false) {
                      totalCount
                      nodes {
                        __typename
                        id
                        trashed
                        date
                      }
                    }
                  }
                }
              }
            `,
          variables: { id: repository.id },
          data: {
            uuid: {
              revisions: {
                totalCount: 2,
                nodes: [
                  getRevisionDataWithoutSubResolvers(revision),
                  getRevisionDataWithoutSubResolvers(revisedRevision),
                ],
              },
            },
          },
          client,
        })
      })

      test('when unrevised=true trashed revisions are not included', async () => {
        global.server.use(createUuidHandler(trashed(revisedRevision)))

        await assertSuccessfulGraphQLQuery({
          query: `
              query unrevisedRevisionsOfRepository($id: Int!) {
                uuid(id: $id) {
                  ... on ${type} {
                    revisions (unrevised: false) {
                      totalCount
                      nodes {
                        __typename
                        id
                        trashed
                        date
                      }
                    }
                  }
                }
              }
            `,
          variables: { id: repository.id },
          data: {
            uuid: {
              revisions: {
                nodes: [getRevisionDataWithoutSubResolvers(revision)],
                totalCount: 1,
              },
            },
          },
          client,
        })
      })
    }
  )
})

describe('Revision', () => {
  test.each(repositoryCases)(
    '%s by id (w/ author)',
    async (_type, { revision }) => {
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
    async (_type, { repository, revision, revisionType }) => {
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

function trashed(revision: RevisionPayload) {
  return { ...revision, trashed: true }
}
