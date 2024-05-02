import gql from 'graphql-tag'

import {
  article,
  comment1,
  comment2,
  comment3,
  user,
} from '../../../__fixtures__'
import { given, Client, givenThreads } from '../../__utils__'

describe('uuid["threads"]', () => {
  describe('returns comment threads', () => {
    const query = new Client()
      .prepareQuery<{
        id: number
        archived?: boolean
        trashed?: boolean
      }>({
        query: gql`
          query threads($id: Int!, $archived: Boolean, $trashed: Boolean) {
            uuid(id: $id) {
              ... on ThreadAware {
                threads(archived: $archived, trashed: $trashed) {
                  nodes {
                    comments {
                      nodes {
                        id
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

    test('Threads with 3 Comments (with some comments trashed / archived)', async () => {
      givenThreads({
        uuid: article,
        threads: [
          [comment1, { ...comment2, trashed: true }],
          [{ ...comment3, archived: true }],
        ],
      })

      await query.shouldReturnData({
        uuid: {
          threads: {
            nodes: [
              {
                comments: {
                  nodes: [{ id: comment1.id }, { id: comment2.id }],
                },
              },
              { comments: { nodes: [{ id: comment3.id }] } },
            ],
          },
        },
      })
    })

    test('Thread with 1 Comment', async () => {
      givenThreads({ uuid: article, threads: [[comment3]] })

      await query.shouldReturnData({
        uuid: {
          threads: {
            nodes: [{ comments: { nodes: [{ id: comment3.id }] } }],
          },
        },
      })
    })

    test('Thread with 0 Comments', async () => {
      givenThreads({ uuid: article, threads: [] })

      await query.shouldReturnData({ uuid: { threads: { nodes: [] } } })
    })

    // TODO: Upate this after we have migrated the threads
    describe.skip('input "archived" filters archived threads', () => {
      test.each([true, false])(
        'when "archived" is set to %s',
        async (archived) => {
          await query
            .withVariables({ id: article.id, archived })
            .shouldReturnData({
              uuid: {
                threads: {
                  nodes: [
                    { comments: { nodes: [{ id: 27778 }, { id: 49237 }] } },
                    { comments: { nodes: [{ id: 27144 }] } },
                  ],
                },
              },
            })
        },
      )
    })

    // TODO: Upate this after we have migrated the threads
    describe.skip('input "trashed" filters trashed comments and threads', () => {
      test.each([true, false])(
        'when "trashed" is set to %s',
        async (trashed) => {
          await query
            .withVariables({ id: article.id, trashed })
            .shouldReturnData({
              uuid: {
                threads: {
                  nodes: [
                    { comments: { nodes: [{ id: 27778 }, { id: 49237 }] } },
                    { comments: { nodes: [{ id: 27144 }] } },
                  ],
                },
              },
            })
        },
      )
    })

    test('Deleted threads are ignored (for example threads created by a deleted spam account)', async () => {
      givenThreads({
        uuid: article,
        threads: [
          [comment1, { ...comment2, trashed: true }],
          [{ ...comment3, archived: true }],
        ],
      })
      // Simulates that `comment1` was deleted in the database
      given('UuidQuery').withPayload({ id: comment1.id }).returnsNotFound()

      await query.shouldReturnData({
        uuid: {
          threads: {
            nodes: [{ comments: { nodes: [{ id: comment3.id }] } }],
          },
        },
      })
    })
  })

  test('property "createdAt" of Thread', async () => {
    givenThreads({ uuid: article, threads: [[comment1, comment2]] })

    await new Client()
      .prepareQuery({
        query: gql`
          query propertyCreatedAt($id: Int!) {
            uuid(id: $id) {
              ... on ThreadAware {
                threads {
                  nodes {
                    createdAt
                  }
                }
              }
            }
          }
        `,
      })
      .withVariables({ id: article.id })
      .shouldReturnData({
        uuid: { threads: { nodes: [{ createdAt: comment1.date }] } },
      })
  })

  describe('property "title"', () => {
    const query = new Client()
      .prepareQuery({
        query: gql`
          query propertyTitle($id: Int!) {
            uuid(id: $id) {
              ... on ThreadAware {
                threads {
                  nodes {
                    title
                  }
                }
              }
            }
          }
        `,
      })
      .withVariables({ id: article.id })

    test('returns the "title" of a thread', async () => {
      givenThreads({ uuid: article, threads: [[comment1, comment2]] })

      await query.shouldReturnData({
        uuid: { threads: { nodes: [{ title: comment1.title }] } },
      })
    })

    test('can be null', async () => {
      givenThreads({ uuid: article, threads: [[{ ...comment1, title: null }]] })

      await query.shouldReturnData({
        uuid: { threads: { nodes: [{ title: null }] } },
      })
    })
  })

  test('property "id" of Thread', async () => {
    givenThreads({ uuid: article, threads: [[comment1, comment2]] })

    await new Client()
      .prepareQuery({
        query: gql`
          query propertyArchived($id: Int!) {
            uuid(id: $id) {
              ... on ThreadAware {
                threads {
                  nodes {
                    id
                  }
                }
              }
            }
          }
        `,
      })
      .withVariables({ id: article.id })
      .shouldReturnData({
        uuid: { threads: { nodes: [{ id: expect.any(String) as string }] } },
      })
  })

  test('property "archived" of Thread', async () => {
    givenThreads({ uuid: article, threads: [[comment1, comment2]] })

    await new Client()
      .prepareQuery({
        query: gql`
          query propertyArchived($id: Int!) {
            uuid(id: $id) {
              ... on ThreadAware {
                threads {
                  nodes {
                    archived
                  }
                }
              }
            }
          }
        `,
      })
      .withVariables({ id: article.id })
      .shouldReturnData({ uuid: { threads: { nodes: [{ archived: false }] } } })
  })

  test('property "trashed" of Thread', async () => {
    givenThreads({ uuid: article, threads: [[comment1, comment2]] })

    await new Client()
      .prepareQuery({
        query: gql`
          query propertyArchived($id: Int!) {
            uuid(id: $id) {
              ... on ThreadAware {
                threads {
                  nodes {
                    trashed
                  }
                }
              }
            }
          }
        `,
      })
      .withVariables({ id: article.id })
      .shouldReturnData({ uuid: { threads: { nodes: [{ trashed: false }] } } })
  })

  test('property "object" of Thread', async () => {
    givenThreads({ uuid: article, threads: [[comment1, comment2]] })

    await new Client()
      .prepareQuery({
        query: gql`
          query propertyObject($id: Int!) {
            uuid(id: $id) {
              ... on ThreadAware {
                threads {
                  nodes {
                    object {
                      id
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
        uuid: { threads: { nodes: [{ object: { id: article.id } }] } },
      })
  })

  describe('property "object" of Comment', () => {
    const query = new Client().prepareQuery({
      query: gql`
        query comments($id: Int!) {
          uuid(id: $id) {
            ... on Comment {
              legacyObject {
                id
                alias
              }
            }
          }
        }
      `,
    })

    test('property "status" of Thread', async () => {
      givenThreads({ uuid: article, threads: [[comment1, comment2]] })

      await new Client()
        .prepareQuery({
          query: gql`
            query propertyStatus($id: Int!) {
              uuid(id: $id) {
                ... on ThreadAware {
                  threads {
                    nodes {
                      status
                    }
                  }
                }
              }
            }
          `,
        })
        .withVariables({ id: article.id })
        .shouldReturnData({
          uuid: { threads: { nodes: [{ status: 'done' }] } },
        })
    })

    test('1-level comment', async () => {
      givenThreads({ uuid: article, threads: [[comment1]] })

      await query.withVariables({ id: comment1.id }).shouldReturnData({
        uuid: { legacyObject: { id: article.id, alias: article.alias } },
      })
    })

    test('2-level comment', async () => {
      givenThreads({ uuid: article, threads: [[comment1, comment2]] })

      await query.withVariables({ id: comment2.id }).shouldReturnData({
        uuid: { legacyObject: { id: article.id, alias: article.alias } },
      })
    })
  })

  test('property "createdAt" of Comment', async () => {
    givenThreads({ uuid: article, threads: [[comment1]] })

    await new Client()
      .prepareQuery({
        query: gql`
          query propertyCreatedAt($id: Int!) {
            uuid(id: $id) {
              ... on ThreadAware {
                threads {
                  nodes {
                    comments {
                      nodes {
                        createdAt
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
            nodes: [{ comments: { nodes: [{ createdAt: comment1.date }] } }],
          },
        },
      })
  })

  test('Test property "author" of Comment', async () => {
    givenThreads({ uuid: article, threads: [[comment1]] })
    given('UuidQuery').for(user)

    await new Client()
      .prepareQuery({
        query: gql`
          query propertyCreatedAt($id: Int!) {
            uuid(id: $id) {
              ... on ThreadAware {
                threads {
                  nodes {
                    comments {
                      nodes {
                        author {
                          username
                        }
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
                comments: { nodes: [{ author: { username: user.username } }] },
              },
            ],
          },
        },
      })
  })
})
