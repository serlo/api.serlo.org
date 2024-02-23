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
import { castToAlias, castToUuid, DiscriminatorType } from '~/model/decoder'
import { encodeSubjectId } from '~/schema/subject/utils'
import { Instance } from '~/types'

describe('allThreads', () => {
  const comment4 = { ...comment3, id: nextUuid(comment3.id) }

  beforeEach(() => {
    given('UuidQuery').for(comment, comment1, comment2, comment3, comment4)
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
              __typename
              createdAt
            }
          }
        }
      }
    `,
  })

  test('returns list of threads', async () => {
    const first5Query = new Client().prepareQuery({
      query: gql`
        query {
          thread {
            allThreads(first: 5) {
              nodes {
                id
              }
            }
          }
        }
      `,
    })
    function mockUuidQuery(commentId: number) {
      const comment: Model<'Comment'> = {
        id: castToUuid(commentId),
        trashed: false,
        alias: castToAlias('/mathe/27778/applets-vertauscht'),
        __typename: DiscriminatorType.Comment,
        authorId: 1234,
        title: 'comentario',
        date: '2014-08-25T12:51:02+02:00',
        archived: false,
        content:
          'Soy un comentario',
        parentId: article.id,
        childrenIds: [],
        status: 'open',
      }
      given('UuidQuery').for(comment)
    }
    const first5threads = [35163, 35090, 26976, 35082, 34793]
    first5threads.forEach(mockUuidQuery)
    const result = await first5Query.execute()
    console.log(result.body.singleResult)
    await first5Query.shouldReturnData({
      thread: {
        allThreads: {
          nodes: first5threads.map((id) => ({ id })),
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

function getThreadData(comment: Model<'Comment'>) {
  return { __typename: 'Thread', createdAt: comment.date }
}
