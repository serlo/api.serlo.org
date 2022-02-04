/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
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
  LegacyClient,
  createTestClient,
  createUuidHandler,
  nextUuid,
  getTypenameAndId,
  given,
  givenUuid,
} from '../../__utils__'
import { Model } from '~/internals/graphql'
import {
  EntityRevisionType,
  EntityType,
  RepositoryType,
  RevisionType,
  DiscriminatorType,
  castToUuid,
} from '~/model/decoder'

let client: LegacyClient

beforeEach(() => {
  client = createTestClient()
})

const repositoryFixtures: Record<
  RepositoryType,
  {
    repository: Model<'AbstractRepository'>
    revision: Model<'AbstractRevision'>
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
const repositoryCases = R.toPairs(repositoryFixtures)

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
        uuid: R.pick(['__typename', 'id', 'trashed', 'date'], repository),
      },
      client,
    })
  })

  test.each(repositoryCases)(
    '%s by alias (url-encoded)',
    async (_type, { repository }) => {
      givenUuid(repository)
      given('AliasQuery')
        .withPayload({ instance: repository.instance, path: '/ü' })
        .returns({
          id: repository.id,
          instance: repository.instance,
          path: '/ü',
        })

      await assertSuccessfulGraphQLQuery({
        query: gql`
          query repository($alias: AliasInput!) {
            uuid(alias: $alias) {
              __typename
              ... on AbstractRepository {
                id
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
          uuid: getTypenameAndId(repository),
        },
        client,
      })
    }
  )

  test.each(repositoryCases)(
    '%s by alias (/:id)',
    async (_type, { repository }) => {
      givenUuid(repository)
      given('AliasQuery')
        .withPayload({ instance: repository.instance, path: '/path' })
        .returns({
          id: repository.id,
          instance: repository.instance,
          path: '/path',
        })
      await assertSuccessfulGraphQLQuery({
        query: gql`
          query repository($alias: AliasInput!) {
            uuid(alias: $alias) {
              __typename
              ... on AbstractRepository {
                id
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
          uuid: getTypenameAndId(repository),
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
            currentRevision: R.pick(
              ['__typename', 'id', 'trashed', 'date'],
              revision
            ),
          },
        },
        client,
      })
    }
  )

  test.each(repositoryCases)(
    '%s by id (w/ license)',
    async (_type, { repository }) => {
      given('LicenseQuery').withPayload({ id: license.id }).returns(license)
      global.server.use(createUuidHandler(repository))

      await assertSuccessfulGraphQLQuery({
        query: `
            query license($id: Int!) {
              uuid(id: $id) {
                ... on AbstractRepository {
                  license {
                    id
                    instance
                    default
                    title
                    url
                    content
                    agreement
                    iconHref
                  }
                }
              }
            }
          `,
        variables: { id: repository.id },
        data: { uuid: { license } },
        client,
      })
    }
  )

  describe.each(repositoryCases)(
    '%s by id (w/ revisions)',
    (type, { repository, revision }) => {
      const revisedRevision = { ...revision, id: castToUuid(revision.id - 10) }
      const unrevisedRevision = { ...revision, id: nextUuid(revision.id) }

      beforeEach(() => {
        global.server.use(
          createUuidHandler({
            ...repository,
            revisionIds: [
              unrevisedRevision.id,
              revisedRevision.id,
              revision.id,
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
                  nodes {
                    __typename
                    id
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
                nodes: [
                  getTypenameAndId(unrevisedRevision),
                  getTypenameAndId(revision),
                  getTypenameAndId(revisedRevision),
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
                nodes: [getTypenameAndId(unrevisedRevision)],
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
                  getTypenameAndId(revision),
                  getTypenameAndId(revisedRevision),
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
                nodes: [getTypenameAndId(revision)],
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
                }
              }
            }
          }
        `,
        variables: revision,
        data: {
          uuid: {
            author: getTypenameAndId(user),
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
                  }
                }
              }
            }
          `,
        variables: revision,
        data: {
          uuid: {
            repository: getTypenameAndId(repository),
          },
        },
        client,
      })
    }
  )
})

function trashed(revision: Model<'AbstractRevision'>) {
  return { ...revision, trashed: true }
}
