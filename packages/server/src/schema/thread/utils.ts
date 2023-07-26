import { UserInputError } from 'apollo-server'
import * as t from 'io-ts'

import { Context, Model, PickResolvers } from '~/internals/graphql'
import { CommentDecoder } from '~/model/decoder'
import { resolveConnection } from '~/schema/connection/utils'
import { isDefined } from '~/utils'

export function createThreadResolvers(): PickResolvers<'ThreadAware'> {
  return {
    async threads(parent, payload, { dataSources }) {
      const { firstCommentIds } = await dataSources.model.serlo.getThreadIds({
        id: parent.id,
      })

      return resolveConnection({
        nodes: await resolveThreads({
          ...payload,
          firstCommentIds: firstCommentIds.sort((a, b) => b - a),
          dataSources,
        }),
        payload: payload,
        createCursor(node) {
          return node.commentPayloads[0].id.toString()
        },
      })
    },
  }
}

export async function resolveThreads({
  firstCommentIds,
  archived,
  trashed,
  subjectId,
  dataSources,
}: {
  firstCommentIds: number[]
  archived?: boolean
  trashed?: boolean
  subjectId?: number | null
  dataSources: Context['dataSources']
}): Promise<Model<'Thread'>[]> {
  const firstComments = await resolveComments(dataSources, firstCommentIds)

  const firstCommentsAfterFilter = firstComments.filter((comment) => {
    if (archived !== undefined && archived !== comment.archived) {
      return false
    }
    if (trashed !== undefined && trashed !== comment.trashed) {
      return false
    }

    return true
  })

  const firstCommentsAfterSubjectFilter = await Promise.all(
    firstCommentsAfterFilter.map(async (comment) => {
      if (subjectId == null) return comment

      const entity = await dataSources.model.serlo.getUuid({
        id: comment.parentId,
      })

      return t.type({ canonicalSubjectId: t.number }).is(entity) &&
        entity.canonicalSubjectId === subjectId
        ? comment
        : null
    }),
  )
  const filteredFirstComments =
    firstCommentsAfterSubjectFilter.filter(isDefined)

  return await Promise.all(
    filteredFirstComments.map(async (firstComment) => {
      const remainingComments = await resolveComments(
        dataSources,
        firstComment.childrenIds,
      )
      const filteredComments = remainingComments.filter(
        (comment) => trashed === undefined || trashed === comment.trashed,
      )
      return {
        __typename: 'Thread' as const,
        commentPayloads: [firstComment, ...filteredComments],
      }
    }),
  )
}

export async function resolveThread(
  firstCommentId: number,
  dataSources: Context['dataSources'],
): Promise<Model<'Thread'>> {
  const firstComment = await dataSources.model.serlo.getUuidWithCustomDecoder({
    id: firstCommentId,
    decoder: CommentDecoder,
  })

  const remainingComments = await resolveComments(
    dataSources,
    firstComment.childrenIds,
  )

  return {
    __typename: 'Thread' as const,
    commentPayloads: [firstComment, ...remainingComments],
  }
}

export function encodeThreadId(firstCommentId: number) {
  return Buffer.from(`t${firstCommentId}`).toString('base64')
}

export function decodeThreadId(threadId: string): number {
  const result = parseInt(
    Buffer.from(threadId, 'base64').toString('utf-8').substring(1),
  )
  if (Number.isNaN(result) || result <= 0) {
    throw new UserInputError('you need to provide a valid thread id (string)')
  }
  return result
}

export function decodeThreadIds(ids: string[]): number[] {
  return ids.map(decodeThreadId)
}

async function resolveComments(
  dataSources: Context['dataSources'],
  ids: number[],
) {
  const comments = await Promise.all(
    ids.map((id) =>
      dataSources.model.serlo.getUuidWithCustomDecoder({
        id,
        decoder: t.union([CommentDecoder, t.null]),
      }),
    ),
  )

  return comments.filter(isDefined)
}
