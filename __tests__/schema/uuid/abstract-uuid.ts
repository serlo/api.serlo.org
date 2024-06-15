import gql from 'graphql-tag'

import {
  article,
  articleRevision,
  comment,
  exercise,
  exerciseGroup,
  page,
  taxonomyTermRoot,
  taxonomyTermSubject,
  user,
} from '../../../__fixtures__'
import { Client, getTypenameAndId, given } from '../../__utils__'
import { Model } from '~/internals/graphql'
import { Instance } from '~/types'

const client = new Client()

describe('uuid by alias', () => {
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
    await uuidQuery
      .withVariables({
        alias: { instance: Instance.De, path: '/not-existing' },
      })
      .shouldReturnData({ uuid: null })
  })

  test('returns uuid when alias is /:uuid', async () => {
    await uuidQuery
      .withVariables({
        alias: { instance: Instance.De, path: `/${exercise.id}` },
      })
      .shouldReturnData({ uuid: { id: exercise.id } })
  })

  test('returns uuid when alias is /entity/view/:id', async () => {
    await uuidQuery
      .withVariables({
        alias: { instance: Instance.De, path: `/entity/view/${article.id}` },
      })
      .shouldReturnData({ uuid: getTypenameAndId(article) })
  })

  test('returns uuid when alias is /:subject/:id/:alias', async () => {
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
    await uuidQuery
      .withVariables({
        alias: { instance: Instance.De, path: `/user/profile/${user.id}` },
      })
      .shouldReturnData({ uuid: { id: user.id } })
  })

  test('returns course page when alias is /{subject}/{course-id}/{course-page-id}/{slug-from-course-page-title}', async () => {
    await uuidQuery
      .withVariables({
        alias: {
          instance: Instance.De,
          path: `/mathe/35598/f47ac10b/a-course`,
        },
      })
      .shouldReturnData({ uuid: { id: 35598 } })
  })

  test('returns null when uuid does not exist', async () => {
    await uuidQuery
      .withVariables({ id: 666666 })
      .shouldReturnData({ uuid: null })
  })

  test('returns an error when no arguments are given', async () => {
    await uuidQuery.shouldFailWithError('BAD_USER_INPUT')
  })

  test("returns an error when the path does not start with '/'", async () => {
    await uuidQuery
      .withVariables({ alias: { instance: 'de', path: 'math' } })
      .shouldFailWithError('BAD_USER_INPUT')
  })
})

test('`uuid` returns null on unsupported uuid type', async () => {
  given('UuidQuery').for({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error We assume here that we get an invalid type name
    __typename: 'MathPuzzle',
    id: 146944,
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

describe('custom aliases', () => {
  test('de.serlo.org/community resolves to uuid 19767', async () => {
    given('UuidQuery').for({
      ...page,
      id: 19882,
      alias: '/legacy-alias',
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
          revisionIds: [123, article.currentRevisionId],
        },
        articleRevision,
      ],
      'Parabel',
    ],
    /*
    [
      'article without current revision',
      [
        {
          ...article,
          currentRevisionId: null,
          revisionIds: [article.currentRevisionId, 123],
        },
        articleRevision,
      ],
      articleRevision.title,
    ],
    */
    [
      'article without revisions',
      [
        {
          ...article,
          currentRevisionId: null,
          revisionIds: [],
          id: 123,
        },
      ],
      '122a238f',
    ],
    ['exercise', [exercise, taxonomyTermSubject], 'Aufgaben zum Baumdiagramm'],
    ['exercise group', [exerciseGroup, taxonomyTermSubject], 'Sachaufgaben'],
    ['user', [user], user.username],
    ['taxonomy term', [taxonomyTermRoot], 'Root'],
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

  // TODO: This property is not used and thus can be deleted
  // See https://serlo.github.io/unused-graphql-properties/#Comment.title
  test.skip('"title" for comments with title of thread', async () => {
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

  // TODO: This property is not used and thus can be deleted
  // See https://serlo.github.io/unused-graphql-properties/#Comment.title
  test.skip('"title" for comments without title in thread', async () => {
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
