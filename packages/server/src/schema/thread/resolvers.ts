import * as auth from '@serlo/authorization'
import type { RowDataPacket } from 'mysql2/promise'

import {
  decodeThreadId,
  decodeThreadIds,
  encodeThreadId,
  resolveThreads,
} from './utils'
import { ForbiddenError, UserInputError } from '~/errors'
import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
  InterfaceResolvers,
  Mutations,
  TypeResolvers,
  Model,
  Context,
  Queries,
} from '~/internals/graphql'
import { runSql } from '~/model/database'
import {
  CommentDecoder,
  DiscriminatorType,
  UserDecoder,
  UuidDecoder,
} from '~/model/decoder'
import { fetchScopeOfUuid } from '~/schema/authorization/utils'
import { resolveConnection } from '~/schema/connection/utils'
import { decodeSubjectId } from '~/schema/subject/utils'
import { createUuidResolvers } from '~/schema/uuid/abstract-uuid/utils'
import { Comment, CommentStatus, Thread } from '~/types'

export const resolvers: InterfaceResolvers<'ThreadAware'> &
  Mutations<'thread'> &
  TypeResolvers<Thread> &
  TypeResolvers<Comment> &
  Queries<'thread'> = {
  ThreadAware: {
    __resolveType(parent) {
      return parent.__typename
    },
  },
  Query: {
    thread: createNamespace(),
  },
  ThreadQuery: {
    async allThreads(_parent, input, { dataSources }) {
      const subjectId = input.subjectId
        ? decodeSubjectId(input.subjectId)
        : null
      const limit = 50
      const { first = 10, instance = null, status = null } = input
      // TODO: Better solution
      const after = input.after
        ? Buffer.from(input.after, 'base64').toString()
        : null

      if (first && first > limit)
        throw new UserInputError(`"first" cannot be larger than ${limit}`)

      interface FirstComment extends RowDataPacket {
        id: number
      }
      const firstComments = await runSql<FirstComment>(
        `
          WITH RECURSIVE descendants AS (
                    SELECT id, parent_id
                    FROM term_taxonomy
                    WHERE (? is null OR id = ?)

                    UNION

                    SELECT tt.id, tt.parent_id
                    FROM term_taxonomy tt
                    JOIN descendants d ON tt.parent_id = d.id
                ), subject_entities AS (
                SELECT id as entity_id FROM descendants

                UNION

                SELECT tte.entity_id
                FROM descendants
                JOIN term_taxonomy_entity tte ON descendants.id = tte.term_taxonomy_id

                UNION

                SELECT entity_link.child_id
                FROM descendants
                JOIN term_taxonomy_entity tte ON descendants.id = tte.term_taxonomy_id
                JOIN entity_link ON entity_link.parent_id = tte.entity_id

                UNION

                SELECT entity_link.child_id
                FROM descendants
                JOIN term_taxonomy_entity tte ON descendants.id = tte.term_taxonomy_id
                JOIN entity_link parent_link ON parent_link.parent_id = tte.entity_id
                JOIN entity_link ON entity_link.parent_id = parent_link.child_id
                )
                SELECT comment.id
                FROM comment
                JOIN uuid ON uuid.id = comment.id
                JOIN comment answer ON comment.id = answer.parent_id OR
                    comment.id = answer.id
                JOIN uuid parent_uuid ON parent_uuid.id = comment.uuid_id
                JOIN subject_entities ON subject_entities.entity_id = comment.uuid_id
                JOIN comment_status on comment.comment_status_id = comment_status.id
                JOIN instance on comment.instance_id = instance.id
                WHERE
                    comment.uuid_id IS NOT NULL
                    AND uuid.trashed = 0
                    AND comment.archived = 0
                    AND (? is null OR instance.subdomain = ?)
                    AND parent_uuid.discriminator != "user"
                    AND (? is null OR comment_status.name = ?)
                GROUP BY comment.id
                HAVING MAX(GREATEST(answer.date, comment.date)) < ?
                ORDER BY MAX(GREATEST(answer.date, comment.date)) DESC
                LIMIT ?;
        `,
        [
          String(subjectId),
          String(subjectId),
          instance,
          instance,
          status,
          status,
          after,
          String(first + 1),
        ],
      )

      const threads = await resolveThreads({
        firstCommentIds: firstComments.map((firstComment) => firstComment.id),
        dataSources,
      })

      // TODO: The types do not match
      // TODO: Support for resolving small changes
      return resolveConnection({
        nodes: threads,
        payload: { ...input, first, after },
        createCursor: (node) => {
          const comments = node.commentPayloads
          const latestComment = comments[comments.length - 1]

          return latestComment.date
        },
      })
    },
  },
  Thread: {
    id(thread) {
      return encodeThreadId(thread.commentPayloads[0].id)
    },
    createdAt(thread) {
      return thread.commentPayloads[0].date
    },
    title(thread) {
      return thread.commentPayloads[0].title
    },
    archived(thread) {
      return thread.commentPayloads[0].archived
    },
    trashed(thread) {
      return thread.commentPayloads[0].trashed
    },
    status(thread) {
      return convertToApiCommentStatus(thread.commentPayloads[0].status)
    },
    async object(thread, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: thread.commentPayloads[0].parentId,
        decoder: UuidDecoder,
      })
    },
    comments(thread, cursorPayload) {
      return resolveConnection({
        nodes: thread.commentPayloads.sort((a, b) => a.id - b.id),
        payload: cursorPayload,
        createCursor(node) {
          return node.id.toString()
        },
      })
    },
  },
  Comment: {
    ...createUuidResolvers(),
    createdAt(comment) {
      return comment.date
    },
    async author(comment, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: comment.authorId,
        decoder: UserDecoder,
      })
    },
    async legacyObject(comment, _args, { dataSources }) {
      return resolveObject(comment, dataSources)
    },
  },
  Mutation: {
    thread: createNamespace(),
  },
  ThreadMutation: {
    async createThread(_parent, payload, { dataSources, userId }) {
      const { objectId } = payload.input
      const scope = await fetchScopeOfUuid({ id: objectId, dataSources })

      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        userId,
        guard: auth.Thread.createThread(scope),
        message: 'You are not allowed to create a thread on this object.',
        dataSources,
      })

      const commentPayload = await dataSources.model.serlo.createThread({
        ...payload.input,
        userId,
      })
      const success = commentPayload !== null
      return {
        record:
          commentPayload !== null
            ? { __typename: 'Thread', commentPayloads: [commentPayload] }
            : null,
        success,
        query: {},
      }
    },
    async createComment(_parent, { input }, { dataSources, userId }) {
      const threadId = decodeThreadId(input.threadId)
      const scope = await fetchScopeOfUuid({ id: threadId, dataSources })

      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        userId,
        guard: auth.Thread.createComment(scope),
        message: 'You are not allowed to comment on this thread.',
        dataSources,
      })

      const commentPayload = await dataSources.model.serlo.createComment({
        ...input,
        threadId,
        userId,
      })

      return {
        record: commentPayload,
        success: commentPayload !== null,
        query: {},
      }
    },
    async editComment(_parent, { input }, { dataSources, userId }) {
      const commentId = input.commentId
      const scope = await fetchScopeOfUuid({ id: commentId, dataSources })

      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        userId,
        guard: auth.Thread.createThread(scope),
        message: 'You are not allowed to edit this thread or comment.',
        dataSources,
      })

      await dataSources.model.serlo.editComment({
        ...input,
        commentId,
        userId,
      })

      return {
        success: true,
        query: {},
      }
    },
    async setThreadStatus(_parent, payload, context) {
      const { dataSources, userId } = context

      assertUserIsAuthenticated(userId)

      const { id, status } = payload.input
      const ids = decodeThreadIds(id)

      const threads = await resolveThreads({
        firstCommentIds: ids,
        dataSources,
      })

      await assertUserIsAuthorizedOrTookPartInDiscussion({ context, threads })

      await dataSources.model.serlo.setThreadStatus({ ids, status })

      return { success: true, query: {} }
    },
    async setThreadArchived(_parent, payload, { dataSources, userId }) {
      const { id, archived } = payload.input
      const ids = decodeThreadIds(id)

      const scopes = await Promise.all(
        ids.map((id) => fetchScopeOfUuid({ id, dataSources })),
      )

      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        userId,
        guards: scopes.map((scope) => auth.Thread.setThreadArchived(scope)),
        message: 'You are not allowed to archive the provided thread(s).',
        dataSources,
      })

      await dataSources.model.serlo.archiveThread({
        ids,
        archived,
        userId,
      })
      return { success: true, query: {} }
    },
    async setThreadState(_parent, payload, { dataSources, userId }) {
      const { trashed } = payload.input
      const ids = decodeThreadIds(payload.input.id)

      const scopes = await Promise.all(
        ids.map((id) => fetchScopeOfUuid({ id, dataSources })),
      )

      assertUserIsAuthenticated(userId)

      await assertUserIsAuthorized({
        userId,
        guards: scopes.map((scope) => auth.Thread.setThreadState(scope)),
        message:
          'You are not allowed to set the state of the provided thread(s).',
        dataSources,
      })

      await dataSources.model.serlo.setUuidState({ ids, userId, trashed })

      return { success: true, query: {} }
    },
    async setCommentState(_parent, payload, { dataSources, userId }) {
      const { id: ids, trashed } = payload.input

      const scopes = await Promise.all(
        ids.map((id) => fetchScopeOfUuid({ id, dataSources })),
      )

      assertUserIsAuthenticated(userId)

      const comments = await Promise.all(
        ids.map((id) =>
          dataSources.model.serlo.getUuidWithCustomDecoder({
            id,
            decoder: CommentDecoder,
          }),
        ),
      )

      const currentUserHasCreatedAllComments = comments.every(
        (comment) => comment.authorId === userId,
      )

      if (!currentUserHasCreatedAllComments) {
        await assertUserIsAuthorized({
          userId,
          guards: scopes.map((scope) => auth.Thread.setCommentState(scope)),
          message:
            'You are not allowed to set the state of the provided comments(s).',
          dataSources,
        })
      }

      await dataSources.model.serlo.setUuidState({ ids, trashed, userId })

      return { success: true, query: {} }
    },
  },
}

async function resolveObject(
  comment: Model<'Comment'>,
  dataSources: Context['dataSources'],
): Promise<Model<'AbstractUuid'>> {
  const obj = await dataSources.model.serlo.getUuidWithCustomDecoder({
    id: comment.parentId,
    decoder: UuidDecoder,
  })

  return obj.__typename === DiscriminatorType.Comment
    ? resolveObject(obj, dataSources)
    : obj
}

function convertToApiCommentStatus(
  rawStatus: Model<'Comment'>['status'],
): CommentStatus {
  switch (rawStatus) {
    case 'noStatus':
      return CommentStatus.NoStatus
    case 'open':
      return CommentStatus.Open
    case 'done':
      return CommentStatus.Done
  }
}

async function assertUserIsAuthorizedOrTookPartInDiscussion({
  context,
  threads,
}: {
  context: Context
  threads: Model<'Thread'>[]
}) {
  const { dataSources, userId } = context

  const scopes = await Promise.all(
    threads.map((thread) =>
      fetchScopeOfUuid({
        id: thread.commentPayloads[0].parentId,
        dataSources,
      }),
    ),
  )

  const message =
    'You are not allowed to set the status of the provided thread(s).'

  try {
    await assertUserIsAuthorized({
      userId,
      guards: scopes.map((scope) => auth.Thread.setThreadStatus(scope)),
      message,
      dataSources,
    })
  } catch {
    for (const thread of threads) {
      if (
        !thread.commentPayloads.some((comment) => comment.authorId === userId)
      ) {
        throw new ForbiddenError(message)
      }
    }
  }
}
