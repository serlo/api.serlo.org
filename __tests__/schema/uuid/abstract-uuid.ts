import gql from 'graphql-tag'
import * as R from 'ramda'

import {
  applet,
  appletRevision,
  article,
  articleRevision,
  comment,
  comment1,
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
  taxonomyTermRoot,
  taxonomyTermSubject,
  user,
  video,
  videoRevision,
} from '../../../__fixtures__'
import { getTypenameAndId, given, Client, givenThreads } from '../../__utils__'
import { Model } from '~/internals/graphql'
import {
  EntityRevisionType,
  EntityType,
  DiscriminatorType,
  UuidType,
  castToUuid,
  castToAlias,
  Alias,
} from '~/model/decoder'
import { Instance } from '~/types'

const client = new Client()

// Endpoint uuid() returns null for comments
type AccessibleUuidTypes = Exclude<UuidType, DiscriminatorType.Comment>

const abstractUuidFixtures: Record<
  AccessibleUuidTypes,
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
  [EntityType.Video]: video,
  [EntityRevisionType.AppletRevision]: appletRevision,
  [EntityRevisionType.ArticleRevision]: articleRevision,
  [EntityRevisionType.CourseRevision]: courseRevision,
  [EntityRevisionType.CoursePageRevision]: coursePageRevision,
  [EntityRevisionType.ExerciseRevision]: exerciseRevision,
  [EntityRevisionType.ExerciseGroupRevision]: exerciseGroupRevision,
  [EntityRevisionType.EventRevision]: eventRevision,
  [EntityRevisionType.GroupedExerciseRevision]: groupedExerciseRevision,
  [EntityRevisionType.VideoRevision]: videoRevision,
}
const abstractUuidRepository = R.toPairs(abstractUuidFixtures)

describe('uuid', () => {
  const uuidQuery = client.prepareQuery({
    query: gql`
      query ($id: Int, $alias: AliasInput) {
        uuid(id: $id, alias: $alias) {
          id
          __typename
        }
      }
    `,
  })

  test('returns null when alias cannot be found', async () => {
    given('AliasQuery')
      .withPayload({
        instance: Instance.De,
        path: '/not-existing',
      })
      .returnsNotFound()

    await uuidQuery
      .withVariables({
        alias: { instance: Instance.De, path: '/not-existing' },
      })
      .shouldReturnData({ uuid: null })
  })

  test('returns uuid when alias is /:uuid', async () => {
    given('UuidQuery').for(exercise)

    await uuidQuery
        .withVariables({
          alias: {
            instance: Instance.De,
            path: `/${exercise.id}`,
          },
        })
        .shouldReturnData({ uuid: { id: exercise.id } })
  })

  test('returns uuid when alias is /entity/view/:id', async () => {
    given('UuidQuery').for(article)

    await uuidQuery
      .withVariables({
        alias: { instance: Instance.De, path: `/entity/view/${article.id}` },
      })
      .shouldReturnData({ uuid: getTypenameAndId(article) })
  })

  test('returns uuid when alias is /:subject/:id/:alias (as hotfix for the current bug in the database layer)', async () => {
    given('UuidQuery').for(article)

    await uuidQuery
      .withVariables({
        alias: {
          instance: Instance.De,
          path: `/mathe/${article.id}/das-viereck`,
        },
      })
      .shouldReturnData({ uuid: getTypenameAndId(article) })
  })

  test('returns uuid when alias starts with an instance', async () => {
    given('UuidQuery').for(article)

    await uuidQuery
        .withVariables({
          alias: {
            instance: Instance.De,
            path: `/${Instance.Es}/mathe/${article.id}/das-viereck`,
          },
        })
        .shouldReturnData({ uuid: getTypenameAndId(article) })
  })

  test('returns revision when alias is /entity/repository/compare/:entityId/:revisionId', async () => {
    given('UuidQuery').for(articleRevision)

    await uuidQuery
      .withVariables({
        alias: {
          instance: Instance.De,
          path: `/entity/repository/compare/${article.id}/${articleRevision.id}`,
        },
      })
      .shouldReturnData({ uuid: { id: articleRevision.id } })
  })

  test('returns user when alias is /user/profile/:userId', async () => {
    given('UuidQuery').for(user)

    await uuidQuery
        .withVariables({
          alias: {
            instance: Instance.De,
            path: `/user/profile/${user.id}`,
          },
        })
        .shouldReturnData({ uuid: { id: user.id } })
  })

  test('returns null when uuid does not exist', async () => {
    given('UuidQuery').withPayload({ id: 666 }).returnsNotFound()

    await uuidQuery.withVariables({ id: 666 }).shouldReturnData({ uuid: null })
  })

  test('returns null when requested id is too high to be an uuid', async () => {
    await uuidQuery
      .withVariables({ alias: { path: '/100000000000000', instance: 'de' } })
      .shouldReturnData({ uuid: null })
  })

  test('returns an error when alias contains the null character', async () => {
    given('UuidQuery').for({ ...article, alias: '\0\0/1/math' as Alias })

    await uuidQuery
      .withVariables({ id: article.id })
      .shouldFailWithError('INTERNAL_SERVER_ERROR')
  })

  test('returns an error when no arguments are given', async () => {
    await uuidQuery.shouldFailWithError('BAD_USER_INPUT')
  })

  test("returns an error when the path does not start with '/'", async () => {
    await uuidQuery
      .withVariables({ alias: { instance: 'de', path: 'math' } })
      .shouldFailWithError('BAD_USER_INPUT')
  })

  test('returns an error when request fails (500)', async () => {
    given('UuidQuery').withPayload({ id: user.id }).hasInternalServerError()

    await uuidQuery
      .withVariables({ id: user.id })
      .shouldFailWithError('INTERNAL_SERVER_ERROR')
  })

  test('succeeds on 404', async () => {
    given('UuidQuery').withPayload({ id: user.id }).returnsNotFound()

    await uuidQuery
      .withVariables({ id: user.id })
      .shouldReturnData({ uuid: null })
  })
})

test('`uuid` returns null on unsupported uuid type', async () => {
  given('UuidQuery').for({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error We assume here that we get an invalid type name
    __typename: 'MathPuzzle',
    id: castToUuid(146944),
    trashed: false,
  })

  await new Client()
    .prepareQuery({
      query: gql`
        query unsupported($id: Int!) {
          uuid(id: $id) {
            __typename
            id
          }
        }
      `,
    })
    .withVariables({ id: 146944 })
    .shouldReturnData({ uuid: null })
})

describe('property "alias"', () => {
  describe('returns encoded alias when alias of payloads is a string', () => {
    test.each(abstractUuidRepository)('type = %s', async (_type, payload) => {
      given('UuidQuery').for({
        ...payload,
        alias: castToAlias('/%%/größe'),
        id: castToUuid(23),
      })

      await client
        .prepareQuery({
          query: gql`
            query ($id: Int) {
              uuid(id: $id) {
                alias
              }
            }
          `,
        })
        .withVariables({ id: 23 })
        .shouldReturnData({ uuid: { alias: '/%25%25/gr%C3%B6%C3%9Fe' } })
    })
  })
})

describe('custom aliases', () => {
  test('de.serlo.org/community resolves to uuid 19767', async () => {
    given('UuidQuery').for({
      ...page,
      id: castToUuid(19882),
      alias: castToAlias('/legacy-alias'),
    })

    await client
      .prepareQuery({
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
      })
      .withVariables({ alias: { instance: Instance.De, path: '/community' } })
      .shouldReturnData({ uuid: { id: 19882, alias: '/community' } })
  })
})

describe('property "title"', () => {
  const testCases = [
    [
      'article with current revision',
      [
        {
          ...article,
          revisionIds: [castToUuid(123), article.currentRevisionId],
        },
        articleRevision,
      ],
      articleRevision.title,
    ],
    [
      'article without current revision',
      [
        {
          ...article,
          currentRevisionId: null,
          revisionIds: [article.currentRevisionId, castToUuid(123)],
        },
        articleRevision,
      ],
      articleRevision.title,
    ],
    [
      'article without revisions',
      [
        {
          ...article,
          currentRevisionId: null,
          revisionIds: [],
          id: castToUuid(123),
        },
      ],
      '123',
    ],
    ['exercise', [exercise, taxonomyTermSubject], taxonomyTermSubject.name],
    [
      'exercise group',
      [exerciseGroup, taxonomyTermSubject],
      taxonomyTermSubject.name,
    ],
    ['user', [user], user.username],
    ['taxonomy term', [taxonomyTermRoot], taxonomyTermRoot.name],
  ] as [string, Model<'AbstractUuid'>[], string][]

  test.each(testCases)('%s', async (_, uuids, title) => {
    given('UuidQuery').for(uuids)

    await client
      .prepareQuery({
        query: gql`
          query ($id: Int!) {
            uuid(id: $id) {
              title
            }
          }
        `,
      })
      .withVariables({ id: uuids[0].id })
      .shouldReturnData({ uuid: { title } })
  })

  test('"title" for comments with title of thread', async () => {
    givenThreads({
      uuid: article,
      threads: [[comment, { ...comment1, title: null }]],
    })

    await client
      .prepareQuery({
        query: gql`
          query propertyCreatedAt($id: Int!) {
            uuid(id: $id) {
              ... on ThreadAware {
                threads {
                  nodes {
                    comments {
                      nodes {
                        title
                      }
                    }
                  }
                }
              }
            }
          }
        `,
      })
      .withVariables({ id: article.id })
      .shouldReturnData({
        uuid: {
          threads: {
            nodes: [
              {
                comments: {
                  nodes: [{ title: comment.title }, { title: comment.title }],
                },
              },
            ],
          },
        },
      })
  })

  test('"title" for comments without title in thread', async () => {
    givenThreads({
      uuid: article,
      threads: [
        [
          { ...comment, title: null },
          { ...comment1, title: null },
        ],
      ],
    })
    given('UuidQuery').for(articleRevision)

    await client
      .prepareQuery({
        query: gql`
          query propertyCreatedAt($id: Int!) {
            uuid(id: $id) {
              ... on ThreadAware {
                threads {
                  nodes {
                    comments {
                      nodes {
                        title
                      }
                    }
                  }
                }
              }
            }
          }
        `,
      })
      .withVariables({ id: article.id })
      .shouldReturnData({
        uuid: {
          threads: {
            nodes: [
              {
                comments: {
                  nodes: [
                    { title: articleRevision.title },
                    { title: articleRevision.title },
                  ],
                },
              },
            ],
          },
        },
      })
  })
})
