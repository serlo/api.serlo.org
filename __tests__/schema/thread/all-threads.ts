/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2023 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2023 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { gql } from 'apollo-server'
import * as R from 'ramda'

import {
  article,
  article2,
  comment,
  comment1,
  comment2,
  comment3,
} from '../../../__fixtures__'
import { Client, given } from '../../__utils__'
import { Model } from '~/internals/graphql'
import { encodeSubjectId } from '~/schema/subject/utils'
import { Instance } from '~/types'

describe('allThreads', () => {
  beforeEach(() => {
    given('UuidQuery').for(comment, comment1, comment2, comment3)
    given('UuidQuery').for(article, article2)
    given('SubjectsQuery').returns({
      subjects: [
        {
          instance: article.instance,
          taxonomyTermId: article.taxonomyTermIds[0],
        },
        {
          instance: article2.instance,
          taxonomyTermId: article2.taxonomyTermIds[0],
        },
      ],
    })
  })

  const query = new Client().prepareQuery({
    query: gql`
      query (
        $first: Int
        $after: String
        $instance: Instance
        $subjectId: String
      ) {
        thread {
          allThreads(
            first: $first
            after: $after
            instance: $instance
            subjectId: $subjectId
          ) {
            nodes {
              __typename
              createdAt
            }
          }
        }
      }
    `,
  })

  test('returns list of threads', async () => {
    given('AllThreadsQuery')
      .withPayload({ first: 11 })
      .returns({
        firstCommentIds: [comment, comment1, comment3].map(R.prop('id')),
      })

    await query.shouldReturnData({
      thread: {
        allThreads: {
          nodes: [comment, comment1, comment3].map(getThreadData),
        },
      },
    })
  })

  test('parameter "first"', async () => {
    given('AllThreadsQuery')
      .withPayload({ first: 3 })
      .returns({ firstCommentIds: [comment, comment1].map(R.prop('id')) })

    await query.withVariables({ first: 2 }).shouldReturnData({
      thread: { allThreads: { nodes: [comment, comment1].map(getThreadData) } },
    })
  })

  test('parameter "after"', async () => {
    given('AllThreadsQuery')
      .withPayload({ first: 11, after: comment1.date })
      .returns({ firstCommentIds: [comment3].map(R.prop('id')) })

    await query
      .withVariables({
        after: Buffer.from(comment1.date).toString('base64'),
      })
      .shouldReturnData({
        thread: { allThreads: { nodes: [comment3].map(getThreadData) } },
      })
  })

  test('parameter "instance"', async () => {
    given('AllThreadsQuery')
      .withPayload({ first: 11, instance: Instance.En })
      .returns({ firstCommentIds: [comment2].map(R.prop('id')) })

    await query
      .withVariables({
        instance: Instance.En,
      })
      .shouldReturnData({
        thread: { allThreads: { nodes: [comment2].map(getThreadData) } },
      })
  })

  test('parameter "subjectId"', async () => {
    given('AllThreadsQuery')
      .withPayload({ first: 11 })
      .returns({
        firstCommentIds: [comment, comment1, comment3].map(R.prop('id')),
      })

    await query
      .withVariables({
        subjectId: encodeSubjectId(article.taxonomyTermIds[0]),
      })
      .shouldReturnData({
        thread: {
          allThreads: { nodes: [comment, comment1].map(getThreadData) },
        },
      })
  })

  test('parameter "subjectId" with small first', async () => {
    given('AllThreadsQuery')
      .withPayload({ first: 3 })
      .returns({
        firstCommentIds: [comment, comment1, comment3].map(R.prop('id')),
      })

    given('AllThreadsQuery')
      .withPayload({ first: 3, after: comment3.date })
      .returns({
        firstCommentIds: [comment3].map(R.prop('id')),
      })

    await query
      .withVariables({
        first: 2,
        subjectId: encodeSubjectId(article2.taxonomyTermIds[0]),
      })
      .shouldReturnData({
        thread: {
          allThreads: { nodes: [comment3].map(getThreadData) },
        },
      })
  })

  test('fails when limit is bigger than 50', async () => {
    await query
      .withVariables({ first: 51 })
      .shouldFailWithError('BAD_USER_INPUT')
  })
})

function getThreadData(comment: Model<'Comment'>) {
  return { __typename: 'Thread', createdAt: comment.date }
}
