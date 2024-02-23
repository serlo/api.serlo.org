import gql from 'graphql-tag'
import * as R from 'ramda'

import {
  article,
  article2,
  comment,
  comment1,
  comment2,
  comment3,
} from '../../../__fixtures__'
import { Client, given, nextUuid } from '../../__utils__'
import { Model } from '~/internals/graphql'
import { castToUuid } from '~/model/decoder'
import { encodeSubjectId } from '~/schema/subject/utils'
import { encodeThreadId } from '~/schema/thread/utils'
import { Instance } from '~/types'

function getThreadData(comment: Model<'Comment'>) {
  return {
    id: encodeThreadId(comment.id),
    __typename: 'Thread',
    createdAt: comment.date,
  }
}

describe('allThreads', () => {
  const comment4 = { ...comment3, id: nextUuid(comment3.id) }
  const firstThreads = [35163, 35090, 26976, 35082, 34793]

  beforeEach(() => {
    given('UuidQuery').for(
      { ...comment, id: castToUuid(firstThreads[0]) },
      { ...comment1, id: castToUuid(firstThreads[1]) },
      { ...comment2, id: castToUuid(firstThreads[2]) },
      { ...comment3, id: castToUuid(firstThreads[3]) },
      { ...comment4, id: castToUuid(firstThreads[4]) },
    )
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
        $status: CommentStatus
      ) {
        thread {
          allThreads(
            first: $first
            after: $after
            instance: $instance
            subjectId: $subjectId
            status: $status
          ) {
            nodes {
              id
              __typename
              createdAt
            }
          }
        }
      }
    `,
  })

  test('parameter "first"', async () => {
    await query
      .withVariables({
        first: 3,
      })
      .shouldReturnData({
        thread: {
          allThreads: {
            nodes: [
              { ...comment, id: castToUuid(firstThreads[0]) },
              { ...comment1, id: castToUuid(firstThreads[1]) },
              { ...comment2, id: castToUuid(firstThreads[2]) },
            ].map(getThreadData),
          },
        },
      })
  })

  test('parameter "after"', async () => {
    await query
      .withVariables({
        first: 2,
        after: Buffer.from(comment1.date).toString('base64'),
      })
      .shouldReturnData({
        thread: {
          allThreads: { nodes: [comment2, comment3].map(getThreadData) },
        },
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
      .withPayload({ first: 11, subjectId: article.canonicalSubjectId! })
      .returns({
        firstCommentIds: [comment, comment1].map(R.prop('id')),
      })

    await query
      .withVariables({
        subjectId: encodeSubjectId(article.canonicalSubjectId!),
      })
      .shouldReturnData({
        thread: {
          allThreads: { nodes: [comment, comment1].map(getThreadData) },
        },
      })
  })

  test('parameter "status"', async () => {
    given('AllThreadsQuery')
      .withPayload({ first: 11, status: 'open' })
      .returns({
        firstCommentIds: [comment, comment1].map(R.prop('id')),
      })

    await query.withVariables({ status: 'open' }).shouldReturnData({
      thread: {
        allThreads: { nodes: [comment, comment1].map(getThreadData) },
      },
    })
  })

  test('fails when limit is bigger than 50', async () => {
    await query
      .withVariables({ first: 51 })
      .shouldFailWithError('BAD_USER_INPUT')
  })
})
