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

import { article, comment, comment1, user } from '../../../__fixtures__'
import { Client, given, givenThreads } from '../../__utils__'
import { castToAlias, DiscriminatorType } from '~/model/decoder'

const mutation = new Client({ userId: user.id }).prepareQuery({
  query: gql`
    mutation createThread($input: ThreadCreateThreadInput!) {
      thread {
        createThread(input: $input) {
          success
          record {
            archived
            comments {
              nodes {
                content
                title
              }
            }
          }
        }
      }
    }
  `,
  variables: {
    input: {
      title: 'My new thread',
      content: '🔥 brand new!',
      objectId: article.id,
      subscribe: true,
      sendEmail: false,
    },
  },
})

beforeEach(() => {
  given('UuidQuery').for(user)
  givenThreads({ uuid: article, threads: [[comment]] })
})

test('thread gets created, cache mutated as expected', async () => {
  const query_comments = new Client().prepareQuery({
    query: gql`
      query ($id: Int) {
        uuid(id: $id) {
          ... on ThreadAware {
            threads {
              nodes {
                comments {
                  nodes {
                    title
                    content
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

  await query_comments.execute()

  given('ThreadCreateThreadMutation')
    .withPayload({
      title: 'My new thread',
      content: '🔥 brand new!',
      objectId: article.id,
      subscribe: true,
      sendEmail: false,
      userId: user.id,
    })
    .returns({
      __typename: DiscriminatorType.Comment,
      id: comment1.id,
      trashed: false,
      alias: castToAlias(`/mathe/${comment1.id}/`),
      authorId: user.id,
      title: 'My new thread',
      date: '2014-08-25T12:51:02+02:00',
      archived: false,
      content: '🔥 brand new!',
      parentId: article.id,
      childrenIds: [],
    })

  await mutation.shouldReturnData({
    thread: {
      createThread: {
        success: true,
        record: {
          archived: false,
          comments: {
            nodes: [{ title: 'My new thread', content: '🔥 brand new!' }],
          },
        },
      },
    },
  })

  await query_comments.shouldReturnData({
    uuid: {
      threads: {
        nodes: [
          {
            comments: {
              nodes: [{ title: 'My new thread', content: '🔥 brand new!' }],
            },
          },
          {
            comments: {
              nodes: [{ title: comment.title, content: comment.content }],
            },
          },
        ],
      },
    },
  })
})

test('unauthenticated user gets error', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})
