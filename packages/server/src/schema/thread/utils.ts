import * as t from 'io-ts'

import { UuidResolver } from '../uuid/abstract-uuid/resolvers'
import { Context } from '~/context'
import { UserInputError } from '~/errors'
import { Model } from '~/internals/graphql'
import { CommentDecoder } from '~/model/decoder'
import { resolveConnection } from '~/schema/connection/utils'
import { ThreadAwareResolvers } from '~/types'
import { isDefined } from '~/utils'

export function createThreadResolvers(): Pick<ThreadAwareResolvers, 'threads'> {
  return {
    async threads(parent, payload, context) {
      const result = await context.database.fetchAll<{ id: number }>(
        'select id from comment where uuid_id = ? order by id desc',
        [parent.id],
      )
      const firstCommentIds = result.map((row) => row.id)

      return resolveConnection({
        nodes: await resolveThreads({ ...payload, firstCommentIds }, context),
        payload: payload,
        createCursor(node) {
          return node.commentPayloads[0].id.toString()
        },
      })
    },
  }
}

export async function resolveThreads(
  {
    firstCommentIds,
    archived,
    trashed,
    subjectId,
  }: {
    firstCommentIds: number[]
    archived?: boolean
    trashed?: boolean
    subjectId?: number | null
  },
  context: Context,
): Promise<Model<'Thread'>[]> {
  const firstComments = await resolveComments(firstCommentIds, context)

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

      const entity = await UuidResolver.resolve(
        { id: comment.parentId },
        context,
      )

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
        firstComment.childrenIds,
        context,
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
  context: Context,
): Promise<Model<'Thread'>> {
  const firstComment = await UuidResolver.resolveWithDecoder(
    CommentDecoder,
    { id: firstCommentId },
    context,
  )
  const remainingComments = await resolveComments(
    firstComment.childrenIds,
    context,
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

async function resolveComments(ids: number[], context: Context) {
  const comments = await Promise.all(
    ids.map((id) =>
      UuidResolver.resolveWithDecoder(
        t.union([CommentDecoder, t.null]),
        { id },
        context,
      ),
    ),
  )

  return comments.filter(isDefined)
}
