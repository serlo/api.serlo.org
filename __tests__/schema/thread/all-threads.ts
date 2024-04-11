import gql from 'graphql-tag'

import {
  article,
  article2,
  comment as baseComment,
} from '../../../__fixtures__'
import { Client, given } from '../../__utils__'
import { Model } from '~/internals/graphql'
import { runSql } from '~/model/database'
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

const commentNoChildren = { ...baseComment, childrenIds: [] }
const comment = {
  ...commentNoChildren,
  id: castToUuid(35163),
  date: '2015-02-21T13:13:24+01:00',
}
const comment1 = {
  ...commentNoChildren,
  id: castToUuid(35090),
  date: '2015-02-19T16:47:16+01:00',
}
const comment2 = {
  ...commentNoChildren,
  id: castToUuid(26976),
  date: '2014-08-05T07:36:24+02:00',
}
const comment3 = {
  ...commentNoChildren,
  id: castToUuid(34793),
  date: '2015-02-16T17:29:30+01:00',
}
const comment4 = { ...commentNoChildren, id: castToUuid(34161) }

describe('allThreads', () => {
  beforeEach(() => {
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
            nodes: [comment, comment1, comment2].map(getThreadData),
          },
        },
      })
  })

  test('parameter "after"', async () => {
    await query
      .withVariables({
        first: 2,
        after: Buffer.from('2015-02-19 16:47:16').toString('base64'),
      })
      .shouldReturnData({
        thread: {
          allThreads: { nodes: [comment2, comment3].map(getThreadData) },
        },
      })
  })

  test('parameter "instance"', async () => {
    // temporary solution because all comments in dump are German
    await runSql(`UPDATE comment SET instance_id = 2 WHERE id = ${comment1.id}`)

    await query
      .withVariables({
        first: 1,
        instance: Instance.En,
      })
      .shouldReturnData({
        thread: { allThreads: { nodes: [comment1].map(getThreadData) } },
      })

    await runSql(`UPDATE comment SET instance_id = 1 WHERE id = ${comment1.id}`)
  })

  test('parameter "subjectId"', async () => {
    await query
      .withVariables({
        first: 2,
        subjectId: encodeSubjectId(article.canonicalSubjectId!),
      })
      .shouldReturnData({
        thread: {
          allThreads: { nodes: [comment, comment1].map(getThreadData) },
        },
      })
  })

  test('parameter "status"', async () => {
    await query
      .withVariables({ first: 2, status: 'noStatus' })
      .shouldReturnData({
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
