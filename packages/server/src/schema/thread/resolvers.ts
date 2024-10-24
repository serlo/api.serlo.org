import * as auth from '@serlo/authorization'
import * as t from 'io-ts'
import type { RowDataPacket } from 'mysql2/promise'

import {
  decodeThreadId,
  decodeThreadIds,
  encodeThreadId,
  resolveThreads,
} from './utils'
import { createEvent } from '../events/event'
import { setSubscription } from '../subscription/resolvers'
import { Context } from '~/context'
import { ForbiddenError, UserInputError } from '~/errors'
import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
  Model,
} from '~/internals/graphql'
import {
  CommentDecoder,
  DiscriminatorType,
  EntityDecoder,
  NotificationEventType,
  TaxonomyTermDecoder,
  UserDecoder,
  UuidDecoder,
} from '~/model/decoder'
import { fetchInstance, fetchScopeOfUuid } from '~/schema/authorization/utils'
import { resolveConnection } from '~/schema/connection/utils'
import { decodeSubjectId } from '~/schema/subject/utils'
import {
  UuidResolver,
  setUuidState,
} from '~/schema/uuid/abstract-uuid/resolvers'
import { createUuidResolvers } from '~/schema/uuid/abstract-uuid/utils'
import { CommentStatus, Resolvers } from '~/types'

export const resolvers: Resolvers = {
  ThreadAware: {
    __resolveType(parent) {
      return parent.__typename
    },
  },
  Query: {
    thread: createNamespace(),
  },
  ThreadQuery: {
    async allThreads(_parent, input, context) {
      const { database } = context
      const subjectId = input.subjectId
        ? decodeSubjectId(input.subjectId)
        : null
      const limit = 50
      const { first = 10, instance = null, status = null } = input

      // TODO: Better solution
      const after = input.after
        ? Buffer.from(input.after, 'base64').toString()
        : new Date().toISOString()

      if (first && first > limit)
        throw new UserInputError(`"first" cannot be larger than ${limit}`)

      interface FirstComment extends RowDataPacket {
        id: number
      }
      const firstComments = await database.fetchAll<FirstComment>(
        `
          WITH RECURSIVE descendants AS (
                    SELECT id, parent_id
                    FROM taxonomy
                    WHERE (? is null OR id = ?)

                    UNION

                    SELECT tt.id, tt.parent_id
                    FROM taxonomy tt
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
          subjectId ? String(subjectId) : null,
          subjectId ? String(subjectId) : null,
          instance,
          instance,
          status,
          // camelCase here but snake_case in database
          status == CommentStatus.NoStatus ? 'no_status' : status,
          after,
          String(first + 1),
        ],
      )

      const threads = await resolveThreads(
        {
          firstCommentIds: firstComments.map((firstComment) => firstComment.id),
        },
        context,
      )

      // TODO: The types do not match
      // TODO: Support for resolving small changes
      return resolveConnection({
        nodes: threads,
        payload: { ...input, first, after: after ? after : undefined },
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
    object(thread, _args, context) {
      const id = thread.commentPayloads[0].parentId
      return UuidResolver.resolveWithDecoder(UuidDecoder, { id }, context)
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
    async author(comment, _args, context) {
      const id = comment.authorId
      return await UuidResolver.resolveWithDecoder(UserDecoder, { id }, context)
    },
    async legacyObject(comment, _args, context) {
      return resolveObject(comment, context)
    },
  },
  Mutation: {
    thread: createNamespace(),
  },
  ThreadMutation: {
    async createThread(_parent, payload, context) {
      const { database, userId } = context
      const { objectId, title, content, subscribe, sendEmail } = payload.input

      const object = await UuidResolver.resolveWithDecoder(
        t.union([EntityDecoder, TaxonomyTermDecoder, UserDecoder]),
        { id: objectId },
        context,
      )

      const scope =
        'instance' in object
          ? auth.instanceToScope(object.instance)
          : auth.Scope.Serlo

      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        guard: auth.Thread.createThread(scope),
        message: 'You are not allowed to create a thread on this object.',
        context,
      })

      const transaction = await database.beginTransaction()

      try {
        const { insertId: threadId } = await database.mutate(
          "insert into uuid (discriminator) values ('comment')",
        )

        const instance = 'instance' in object ? object.instance : 'de'
        await database.mutate(
          `
          insert into comment 
          (id, instance_id, author_id, uuid_id, title, content)
          select ?, instance.id, ?, ?, ?, ?
          from instance where instance.subdomain = ?
          `,
          [threadId, userId, objectId, title, content, instance],
        )

        await setSubscription(
          { objectId: threadId, subscribe, sendEmail, userId },
          context,
        )

        await transaction.commit()

        return { success: true, query: {} }
      } finally {
        await transaction.rollback()
      }
    },
    async createComment(_parent, { input }, context) {
      const { database, userId } = context
      const threadId = decodeThreadId(input.threadId)
      const { content, subscribe, sendEmail } = input
      const scope = await fetchScopeOfUuid({ id: threadId }, context)

      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        guard: auth.Thread.createComment(scope),
        message: 'You are not allowed to comment on this thread.',
        context,
      })

      const transaction = await database.beginTransaction()

      try {
        const { insertId: commentId } = await database.mutate(
          "insert into uuid (discriminator) values ('comment')",
        )

        await database.mutate(
          `
          insert into comment
          (id, instance_id, author_id, parent_id, content)
          select ?, parent.instance_id, ?, ?, ?
          from comment parent where parent.id = ?
          `,
          [commentId, userId, threadId, content, threadId],
        )

        await setSubscription(
          { objectId: threadId, subscribe, sendEmail, userId },
          context,
        )

        await transaction.commit()

        await UuidResolver.removeCacheEntry({ id: threadId }, context)

        return { success: true, query: {} }
      } finally {
        await transaction.rollback()
      }
    },
    async editComment(_parent, { input }, context) {
      const { userId, database } = context

      assertUserIsAuthenticated(userId)

      const { commentId, content } = input

      if (content.trim() === '') throw new UserInputError('content is empty')

      const scope = await fetchScopeOfUuid({ id: commentId }, context)
      await assertUserIsAuthorized({
        guard: auth.Thread.createThread(scope),
        message: 'You are not allowed to edit this thread or comment.',
        context,
      })

      await database.mutate(`UPDATE comment set content = ? where id = ?`, [
        content,
        commentId,
      ])

      await UuidResolver.removeCacheEntry({ id: commentId }, context)

      return { success: true, query: {} }
    },
    async setThreadStatus(_parent, payload, context) {
      const { database, userId } = context

      assertUserIsAuthenticated(userId)

      const { id, status } = payload.input
      const ids = decodeThreadIds(id)

      const threads = await resolveThreads({ firstCommentIds: ids }, context)

      await assertUserIsAuthorizedOrTookPartInDiscussion({ context, threads })

      await database.mutate(
        `
        UPDATE comment
        SET comment_status_id = (SELECT id from comment_status where name = ?)
        WHERE comment.id IN (${ids.join(',')})
        `,
        [status == CommentStatus.NoStatus ? 'no_status' : status],
      )

      await UuidResolver.removeCacheEntries(
        ids.map((id) => ({ id })),
        context,
      )

      return { success: true, query: {} }
    },
    async setThreadArchived(_parent, payload, context) {
      const { database, userId } = context
      const { id, archived } = payload.input
      const ids = decodeThreadIds(id)

      const scopes = await Promise.all(
        ids.map((id) => fetchScopeOfUuid({ id }, context)),
      )

      assertUserIsAuthenticated(userId)
      await assertUserIsAuthorized({
        guards: scopes.map((scope) => auth.Thread.setThreadArchived(scope)),
        message: 'You are not allowed to archive the provided thread(s).',
        context,
      })

      const transaction = await database.beginTransaction()

      try {
        for (const id of ids) {
          await database.mutate(
            `update comment set archived = ? where id = ?`,
            [archived ? 1 : 0, id],
          )

          await UuidResolver.removeCacheEntry({ id }, context)
        }

        await transaction.commit()

        return { success: true, query: {} }
      } finally {
        await transaction.rollback()
      }
    },
    async setThreadState(_parent, payload, context) {
      const { database, userId } = context
      const { trashed } = payload.input
      const ids = decodeThreadIds(payload.input.id)

      const scopes = await Promise.all(
        ids.map((id) => fetchScopeOfUuid({ id }, context)),
      )

      assertUserIsAuthenticated(userId)

      await assertUserIsAuthorized({
        guards: scopes.map((scope) => auth.Thread.setThreadState(scope)),
        message:
          'You are not allowed to set the state of the provided thread(s).',
        context,
      })

      const transaction = await database.beginTransaction()

      try {
        for (const id of ids) {
          const comment = await UuidResolver.resolve({ id }, context)

          if (comment?.__typename !== DiscriminatorType.Comment) {
            throw new UserInputError(`${id} is no comment`)
          }

          const instance = await fetchInstance(comment, context)

          if (instance == null) {
            throw new UserInputError('comment must have an instance')
          }

          if (comment.trashed !== trashed) {
            await setUuidState({ id, trashed }, context)

            await createEvent(
              {
                __typename: NotificationEventType.SetThreadState,
                actorId: userId,
                archived: trashed,
                threadId: comment.id,
                instance,
              },
              context,
            )
          }
        }

        await transaction.commit()

        return { success: true, query: {} }
      } finally {
        await transaction.rollback()
      }
    },
    async setCommentState(_parent, payload, context) {
      const { database, userId } = context
      const { id: ids, trashed } = payload.input

      const scopes = await Promise.all(
        ids.map((id) => fetchScopeOfUuid({ id }, context)),
      )

      assertUserIsAuthenticated(userId)

      const comments = await Promise.all(
        ids.map((id) =>
          UuidResolver.resolveWithDecoder(CommentDecoder, { id }, context),
        ),
      )

      const currentUserHasCreatedAllComments = comments.every(
        (comment) => comment.authorId === userId,
      )

      if (!currentUserHasCreatedAllComments) {
        await assertUserIsAuthorized({
          guards: scopes.map((scope) => auth.Thread.setCommentState(scope)),
          message:
            'You are not allowed to set the state of the provided comments(s).',
          context,
        })
      }

      const transaction = await database.beginTransaction()

      try {
        for (const id of ids) {
          const comment = await UuidResolver.resolve({ id }, context)

          if (comment?.__typename !== DiscriminatorType.Comment) {
            throw new UserInputError(`${id} is no comment`)
          }

          const instance = await fetchInstance(comment, context)

          if (instance == null) {
            throw new UserInputError('comment must have an instance')
          }

          if (comment.trashed !== trashed) {
            await setUuidState({ id, trashed }, context)

            await createEvent(
              {
                __typename: NotificationEventType.SetThreadState,
                actorId: userId,
                archived: trashed,
                threadId: comment.id,
                instance,
              },
              context,
            )
          }
        }

        await transaction.commit()

        return { success: true, query: {} }
      } finally {
        await transaction.rollback()
      }
    },
  },
}

async function resolveObject(
  comment: Model<'Comment'>,
  context: Context,
): Promise<Model<'AbstractUuid'>> {
  const obj = await UuidResolver.resolveWithDecoder(
    UuidDecoder,
    { id: comment.parentId },
    context,
  )

  return obj.__typename === DiscriminatorType.Comment
    ? resolveObject(obj, context)
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
  const { userId } = context

  const scopes = await Promise.all(
    threads.map((thread) =>
      fetchScopeOfUuid({ id: thread.commentPayloads[0].parentId }, context),
    ),
  )

  const message =
    'You are not allowed to set the status of the provided thread(s).'

  try {
    await assertUserIsAuthorized({
      guards: scopes.map((scope) => auth.Thread.setThreadStatus(scope)),
      message,
      context,
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
