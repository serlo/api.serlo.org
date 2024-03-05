import gql from 'graphql-tag'
import * as R from 'ramda'

import { user, user2, article, article2 } from '../../../__fixtures__'
import { Client, given } from '../../__utils__'
import { Model } from '~/internals/graphql'
import { castToAlias, castToUuid, DiscriminatorType } from '~/model/decoder'
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

export const comment: Model<'Comment'> = {
  id: castToUuid(35163),
  trashed: false,
  alias: castToAlias('/mathe/27778/applets-vertauscht'),
  __typename: DiscriminatorType.Comment,
  authorId: user.id,
  title: 'Falsche Lösungen',
  date: '2015-02-21 13:13:24',
  archived: false,
  content:
    'Der Autor selbst hat erkannt, dass man hier die Reihenfolge beachten muss dennoch benutzt er als Lösungsvorschlag die Kombination bei der die Reihenfolge natürlich missachtet bleibt.',
  parentId: article.id,
  childrenIds: [],
  status: 'open',
}

export const comment1: Model<'Comment'> = {
  id: castToUuid(35090),
  trashed: false,
  alias: castToAlias('/mathe/41443/related-content-ist-chaotisch'),
  __typename: DiscriminatorType.Comment,
  authorId: user.id,
  parentId: article.id,
  title: 'Hier fehlen uns noch Aufgaben',
  date: '2015-02-19 16:47:16',
  archived: false,
  content: 'Kann jemand ein paar erstellen?',
  childrenIds: [], //[49237].map(castToUuid),
  status: 'done',
}

export const comment2: Model<'Comment'> = {
  id: castToUuid(26976),
  trashed: false,
  alias: castToAlias('/mathe/49237/related-content'),
  __typename: DiscriminatorType.Comment,
  authorId: user2.id,
  parentId: comment1.id,
  title: 'related content aufräumen',
  date: '2014-08-05 07:36:24',
  archived: false,
  content:
    'Dieser Themenbaum ist etwas unübersichtlich, könnte man da die Größen und Einheiten vielleicht zusammennehmen, damit eine bessere Übersicht entsteht?',
  childrenIds: [],
  status: 'noStatus',
}

export const comment3: Model<'Comment'> = {
  id: castToUuid(35082),
  trashed: false,
  alias: castToAlias('/mathe/27144/feedback-zu-dem-artikel-über-das-formular'),
  __typename: DiscriminatorType.Comment,
  authorId: 10,
  title: 'Aufgaben noch umwortieren',
  date: '2015-02-19 16:01:46',
  archived: false,
  content:
    'Hier müssen die Aufgaben noch in die content-group umsortiert werden.',
  parentId: article2.id,
  childrenIds: [],
  status: 'open',
}

export const comment4: Model<'Comment'> = {
  id: castToUuid(34793),
  trashed: false,
  alias: castToAlias('/mathe/27144/feedback-zu-dem-artikel-über-das-formular'),
  __typename: DiscriminatorType.Comment,
  authorId: 10,
  title: 'Verschiebung von Ordnern',
  date: '2015-02-16 17:29:30',
  archived: false,
  content: 'Ist das nun so, wie du es meintest?',
  parentId: article2.id,
  childrenIds: [],
  status: 'open',
}

describe('allThreads', () => {
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
    await query.withVariables({ status: 'open' }).shouldReturnData({
      thread: {
        allThreads: { nodes: [comment, comment3, comment4].map(getThreadData) },
      },
    })
  })

  test('fails when limit is bigger than 50', async () => {
    await query
      .withVariables({ first: 51 })
      .shouldFailWithError('BAD_USER_INPUT')
  })
})
