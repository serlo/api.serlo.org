import { ApolloError } from 'apollo-server'

import { SerloDataSource } from '../../../data-sources/serlo'
import { resolveConnection } from '../../connection'
import { isDefined } from '../../utils'
import { UuidResolvers } from '../abstract-uuid'
import { CommentPayload, ThreadData, ThreadDataType } from './types'

export function createThreadResolvers(): Pick<UuidResolvers, 'threads'> {
  return {
    async threads(parent, cursorPayload, { dataSources }) {
      const { firstCommentIds } = await Promise.resolve(
        dataSources.serlo.getThreadIds({ id: parent.id })
      )

      return resolveConnection({
        nodes: await Promise.all(
          firstCommentIds.map((id) => toThreadPayload(dataSources.serlo, id))
        ),
        payload: cursorPayload,
        createCursor(node) {
          return node.commentPayloads[0].id.toString()
        },
      })
    },
  }
}

export async function toThreadPayload(
  serlo: SerloDataSource,
  firstCommentId: number
): Promise<ThreadData> {
  const firstComment = await serlo.getUuid<CommentPayload>({
    id: firstCommentId,
  })
  if (firstComment === null) {
    throw new ApolloError('There are no comments yet')
  }
  const remainingComments = await Promise.all(
    firstComment.childrenIds.map((id) => serlo.getUuid<CommentPayload>({ id }))
  )
  return {
    __typename: ThreadDataType,
    commentPayloads: [firstComment, ...remainingComments.filter(isDefined)],
  }
}
