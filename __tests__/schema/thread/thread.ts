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

import {
  article,
  comment,
  comment1,
  comment2,
  comment3,
  user,
} from '../../../__fixtures__'
import { given, Client, givenThreads } from '../../__utils__'

describe('uuid["threads"]', () => {
  describe('returns comment threads', () => {
    const query = new Client().prepareQuery<{
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
      variables: { id: article.id },
    })

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
                comments: { nodes: [{ id: comment1.id }, { id: comment2.id }] },
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
          threads: { nodes: [{ comments: { nodes: [{ id: comment3.id }] } }] },
        },
      })
    })

    test('Thread with 0 Comments', async () => {
      givenThreads({ uuid: article, threads: [] })

      await query.shouldReturnData({ uuid: { threads: { nodes: [] } } })
    })

    describe('input "archived" filters archived threads', () => {
      test.each([true, false])(
        'when "archived" is set to %s',
        async (archived) => {
          const threads = [
            [{ ...comment2, archived }],
            [{ ...comment3, archived: !archived }],
          ]
          givenThreads({ uuid: article, threads })

          await query
            .withVariables({ id: article.id, archived })
            .shouldReturnData({
              uuid: {
                threads: {
                  nodes: [{ comments: { nodes: [{ id: comment2.id }] } }],
                },
              },
            })
        }
      )
    })

    describe('input "trashed" filters trashed comments and threads', () => {
      test.each([true, false])(
        'when "trashed" is set to %s',
        async (trashed) => {
          const threads = [
            [
              { ...comment2, trashed },
              { ...comment, trashed: !trashed },
            ],
            [{ ...comment3, trashed: !trashed }],
          ]
          givenThreads({ uuid: article, threads })

          await query
            .withVariables({ id: article.id, trashed })
            .shouldReturnData({
              uuid: {
                threads: {
                  nodes: [{ comments: { nodes: [{ id: comment2.id }] } }],
                },
              },
            })
        }
      )
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
        variables: { id: article.id },
      })
      .shouldReturnData({
        uuid: { threads: { nodes: [{ createdAt: comment1.date }] } },
      })
  })

  describe('property "title"', () => {
    const query = new Client().prepareQuery({
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
      variables: { id: article.id },
    })

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
        variables: { id: article.id },
      })
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
        variables: { id: article.id },
      })
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
        variables: { id: article.id },
      })
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
        variables: { id: article.id },
      })
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
        variables: { id: article.id },
      })
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
        variables: { id: article.id },
      })
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
