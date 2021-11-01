/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { UserInputError } from 'apollo-server-express'
import { option as O, function as F } from 'fp-ts'
import * as t from 'io-ts'
import fetch, { Response } from 'node-fetch'
import * as R from 'ramda'

import {
  CommentDecoder,
  InstanceDecoder,
  NotificationEventDecoder,
  UuidDecoder,
  Uuid,
  NotificationDecoder,
  NavigationDecoder,
  NavigationDataDecoder,
  EntityRevisionDecoder,
  EntityDecoder,
  SubscriptionsDecoder,
  PageRevisionDecoder,
  PageDecoder,
} from './decoder'
import {
  createMutation,
  createQuery,
  createRequest,
} from '~/internals/data-source-helper'
import { Environment } from '~/internals/environment'
import { Model } from '~/internals/graphql'
import { isInstance } from '~/schema/instance/utils'
import { isUnsupportedNotificationEvent } from '~/schema/notification/utils'
import { isSupportedUuidType } from '~/schema/uuid/abstract-uuid/utils'
import { decodePath, encodePath } from '~/schema/uuid/alias/utils'
import { Instance, ThreadCreateThreadInput } from '~/types'

export function createSerloModel({
  environment,
}: {
  environment: Environment
}) {
  const getUuid = createQuery(
    {
      decoder: t.union([UuidDecoder, t.null]),
      enableSwr: true,
      getCurrentValue: async (payload: { id: number }) => {
        const uuid = (await handleMessage({
          type: 'UuidQuery',
          payload,
        })) as Model<'AbstractUuid'> | null
        return uuid !== null && isSupportedUuidType(uuid.__typename)
          ? uuid
          : null
      },
      staleAfter: { day: 1 },
      getKey: ({ id }) => {
        return `de.serlo.org/api/uuid/${id}`
      },
      getPayload: (key) => {
        if (!key.startsWith('de.serlo.org/api/uuid/')) return O.none
        const id = parseInt(key.replace('de.serlo.org/api/uuid/', ''), 10)
        return O.some({ id })
      },
      examplePayload: { id: 1 },
    },
    environment
  )

  async function getUuidWithCustomDecoder<
    S extends Model<'AbstractUuid'> | null
  >({ id, decoder }: { id: number; decoder: t.Type<S, unknown> }): Promise<S> {
    return getUuid._querySpec.queryWithDecoder({ id }, decoder)
  }

  const setUuidState = createMutation({
    decoder: t.void,
    async mutate(payload: { ids: number[]; userId: number; trashed: boolean }) {
      await handleMessageWithoutResponse({
        type: 'UuidSetStateMutation',
        payload,
      })
    },
    async updateCache({ ids, trashed }) {
      await getUuid._querySpec.setCache({
        payloads: ids.map((id) => {
          return { id }
        }),
        getValue(current) {
          if (!current || current.trashed === trashed) {
            return
          }
          return { ...current, trashed }
        },
      })
    },
  })

  const getActiveAuthorIds = createQuery(
    {
      decoder: t.array(t.number),
      enableSwr: true,
      getCurrentValue: async () => {
        return await handleMessage({ type: 'ActiveAuthorsQuery' })
      },
      staleAfter: { hour: 1 },
      getKey: () => {
        return 'de.serlo.org/api/user/active-authors'
      },
      getPayload: (key: string) => {
        if (key !== 'de.serlo.org/api/user/active-authors') return O.none
        return O.some(undefined)
      },
      examplePayload: undefined,
    },
    environment
  )

  const getActiveReviewerIds = createQuery(
    {
      decoder: t.array(t.number),
      enableSwr: true,
      getCurrentValue: () => {
        return handleMessage({ type: 'ActiveReviewersQuery' })
      },
      staleAfter: { hour: 1 },
      getKey: () => {
        return 'de.serlo.org/api/user/active-reviewers'
      },
      getPayload: (key: string) => {
        if (key !== 'de.serlo.org/api/user/active-reviewers') return O.none
        return O.some(undefined)
      },
      examplePayload: undefined,
    },
    environment
  )

  const getActivityByType = createQuery(
    {
      decoder: t.type({
        edits: t.number,
        comments: t.number,
        reviews: t.number,
        taxonomy: t.number,
      }),
      enableSwr: true,
      getCurrentValue: (payload: { userId: number }) => {
        return handleMessage({ type: 'ActivityByTypeQuery', payload })
      },
      staleAfter: { minutes: 10 },
      getKey: ({ userId }) => {
        return `de.serlo.org/api/user/activity-by-type/${userId}`
      },
      getPayload: (key) => {
        if (!key.startsWith('de.serlo.org/api/user/activity-by-type/'))
          return O.none
        const userId = parseInt(
          key.replace('de.serlo.org/api/user/activity-by-type/', '')
        )
        if (Number.isNaN(userId)) return O.none
        return O.some({ userId })
      },
      examplePayload: { userId: 1 },
    },
    environment
  )

  const getPotentialSpamUsers = createRequest({
    decoder: t.strict({ userIds: t.array(t.number) }),
    async getCurrentValue(payload: { first: number; after: number | null }) {
      return await handleMessage({
        type: 'UserPotentialSpamUsersQuery',
        payload,
      })
    },
  })

  const deleteBots = createMutation({
    decoder: t.strict({ success: t.literal(true) }),
    async mutate(payload: { botIds: number[] }) {
      return await handleMessage({ type: 'UserDeleteBotsMutation', payload })
    },
    async updateCache({ botIds }) {
      await getUuid._querySpec.removeCache({
        payloads: botIds.map((id) => {
          return { id }
        }),
      })
    },
  })

  const deleteRegularUsers = createMutation({
    decoder: t.union([
      t.type({ success: t.literal(true) }),
      t.type({ success: t.literal(false), reason: t.string }),
    ]),
    mutate: (payload: { userId: number }) => {
      return handleMessage({ type: 'UserDeleteRegularUsersMutation', payload })
    },
    async updateCache({ userId }, { success }) {
      if (success) {
        await getUuid._querySpec.removeCache({ payload: { id: userId } })
      }
    },
  })

  const setEmail = createMutation({
    decoder: t.type({ success: t.literal(true), username: t.string }),
    mutate: (payload: { userId: number; email: string }) => {
      return handleMessage({ type: 'UserSetEmailMutation', payload })
    },
  })

  const getNavigationPayload = createQuery(
    {
      decoder: NavigationDecoder,
      enableSwr: true,
      getCurrentValue: (payload: { instance: Instance }) => {
        return handleMessage({ type: 'NavigationQuery', payload })
      },
      staleAfter: { hour: 1 },
      getKey: ({ instance }) => {
        return `${instance}.serlo.org/api/navigation`
      },
      getPayload: (key: string) => {
        const instance = getInstanceFromKey(key)
        return instance && key === `${instance}.serlo.org/api/navigation`
          ? O.some({ instance })
          : O.none
      },
      examplePayload: { instance: Instance.De },
    },
    environment
  )

  const getNavigation = createRequest({
    decoder: t.union([NavigationDataDecoder, t.null]),
    async getCurrentValue({
      instance,
      id,
    }: {
      instance: Instance
      id: number
    }) {
      const payload = await getNavigationPayload({ instance })
      const { data } = payload

      type NodeData = typeof data[number]

      const leaves: Record<string, number> = {}

      const findLeaves = (node: NodeData): number[] => {
        return [
          ...(node.id ? [node.id] : []),
          ...R.flatten(R.map(findLeaves, node.children || [])),
        ]
      }

      for (let i = 0; i < data.length; i++) {
        findLeaves(data[i]).forEach((id) => {
          leaves[id] = i
        })
      }

      const treeIndex = leaves[id]

      if (treeIndex === undefined) return null

      const findPathToLeaf = (node: NodeData, leaf: number): NodeData[] => {
        if (node.id !== undefined && node.id === leaf) {
          return [node]
        }

        if (node.children === undefined) return []

        const childPaths = node.children.map((childNode) => {
          return findPathToLeaf(childNode, leaf)
        })
        const goodPaths = childPaths.filter((path) => {
          return path.length > 0
        })
        if (goodPaths.length === 0) return []
        return [node, ...goodPaths[0]]
      }

      const nodes = findPathToLeaf(data[treeIndex], id)
      const path = []

      for (let i = 0; i < nodes.length; i++) {
        const nodeData = nodes[i]
        const uuid = nodeData.id ? await getUuid({ id: nodeData.id }) : null
        const node = {
          label: nodeData.label,
          url: (uuid ? uuid.alias : null) || nodeData.url || null,
          id: uuid ? uuid.id : null,
        }
        path.push(node)
      }

      return {
        data: data[treeIndex],
        path,
      }
    },
  })

  const getAlias = createQuery(
    {
      decoder: t.union([
        t.type({
          id: t.number,
          instance: InstanceDecoder,
          path: t.string,
        }),
        t.null,
      ]),
      getCurrentValue: ({
        path,
        instance,
      }: {
        path: string
        instance: Instance
      }) => {
        return handleMessage({
          type: 'AliasQuery',
          payload: { instance, path: decodePath(path) },
        })
      },
      enableSwr: true,
      staleAfter: { day: 1 },
      getKey: ({ path, instance }) => {
        const cleanPath = encodePath(decodePath(path))
        return `${instance}.serlo.org/api/alias${cleanPath}`
      },
      getPayload: (key) => {
        const instance = getInstanceFromKey(key)
        const prefix = `${instance || ''}.serlo.org/api/alias`
        return instance && key.startsWith(`${prefix}/`)
          ? O.some({ instance, path: key.replace(prefix, '') })
          : O.none
      },
      examplePayload: { path: '/math', instance: Instance.En },
    },
    environment
  )

  const getLicense = createQuery(
    {
      decoder: t.union([
        t.type({
          id: t.number,
          instance: InstanceDecoder,
          default: t.boolean,
          title: t.string,
          url: t.string,
          content: t.string,
          agreement: t.string,
          iconHref: t.string,
        }),
        t.null,
      ]),
      getCurrentValue: (payload: { id: number }) => {
        return handleMessage({ type: 'LicenseQuery', payload })
      },
      enableSwr: true,
      staleAfter: { day: 1 },
      getKey: ({ id }) => `de.serlo.org/api/license/${id}`,
      getPayload: (key) => {
        const prefix = 'de.serlo.org/api/license/'
        return key.startsWith(prefix)
          ? O.some({ id: parseInt(key.replace(prefix, ''), 10) })
          : O.none
      },
      examplePayload: { id: 1 },
    },
    environment
  )

  const getSubjects = createQuery(
    {
      decoder: t.strict({
        subjects: t.array(
          t.strict({ instance: InstanceDecoder, taxonomyTermId: t.number })
        ),
      }),
      getCurrentValue() {
        return handleMessage({ type: 'SubjectsQuery', payload: {} })
      },
      enableSwr: true,
      staleAfter: { day: 1 },
      getKey() {
        return 'serlo.org/subjects'
      },
      getPayload(key) {
        return key === 'serlo.org/subjects' ? O.some(undefined) : O.none
      },
      examplePayload: undefined,
    },
    environment
  )

  const getUnrevisedEntities = createQuery(
    {
      decoder: t.strict({ unrevisedEntityIds: t.array(t.number) }),
      getCurrentValue(_payload: undefined) {
        return handleMessage({ type: 'UnrevisedEntitiesQuery', payload: {} })
      },
      enableSwr: true,
      staleAfter: { minutes: 2 },
      maxAge: { hour: 1 },
      getKey() {
        return 'serlo.org/unrevised'
      },
      getPayload(key) {
        return key === 'serlo.org/unrevised' ? O.some(undefined) : O.none
      },
      examplePayload: undefined,
    },
    environment
  )

  const getUnrevisedEntitiesPerSubject = createRequest({
    decoder: t.record(t.string, t.union([t.array(t.number), t.null])),
    async getCurrentValue(_payload: undefined) {
      const { unrevisedEntityIds } = await getUnrevisedEntities()
      const result = {} as Record<string, number[] | null>

      for (const entityId of unrevisedEntityIds) {
        const entity = await getUuidWithCustomDecoder({
          id: entityId,
          decoder: EntityDecoder,
        })
        const key = entity.canonicalSubjectId?.toString() ?? '__no_subject'

        result[key] ??= []
        result[key]?.push(entity.id)
      }

      return result
    },
  })

  const getNotificationEvent = createQuery(
    {
      decoder: t.union([NotificationEventDecoder, t.null]),
      enableSwr: true,
      getCurrentValue: async (payload: { id: number }) => {
        const notificationEvent = (await handleMessage({
          type: 'EventQuery',
          payload,
        })) as Model<'AbstractNotificationEvent'> | null

        return notificationEvent === null ||
          isUnsupportedNotificationEvent(notificationEvent)
          ? null
          : notificationEvent
      },
      staleAfter: { day: 1 },
      getKey: ({ id }) => {
        return `de.serlo.org/api/event/${id}`
      },
      getPayload: (key) => {
        const prefix = 'de.serlo.org/api/event/'
        return key.startsWith(prefix)
          ? O.some({ id: parseInt(key.replace(prefix, ''), 10) })
          : O.none
      },
      examplePayload: { id: 1 },
    },
    environment
  )

  const getEventsAfter = createRequest({
    decoder: t.type({
      events: t.array(NotificationEventDecoder),
      hasNextPage: t.boolean,
    }),
    async getCurrentValue(payload: {
      after: number
      first: number
      actorId?: number
      objectId?: number
      instance?: Instance
    }) {
      return await handleMessage({ type: 'EventsQuery', payload })
    },
  })

  const getEvents = createQuery(
    {
      decoder: t.type({
        events: t.array(NotificationEventDecoder),
        hasNextPage: t.boolean,
      }),
      async getCurrentValue(payload: {
        first: number
        actorId?: number
        objectId?: number
        instance?: Instance
      }) {
        return await handleMessage({ type: 'EventsQuery', payload })
      },
      getKey(payload) {
        return 'serlo/events/' + JSON.stringify(payload)
      },
      getPayload(key: string) {
        if (!key.startsWith('serlo/events/')) return O.none

        try {
          const payload = JSON.parse(key.substring('serlo/events/'.length)) as {
            first: number
            actorId?: number
            objectId?: number
            instance?: Instance
          }

          return O.some(payload)
        } catch (e) {
          return O.none
        }
      },
      enableSwr: true,
      staleAfter: { minute: 2 },
      maxAge: { hour: 1 },
      examplePayload: { first: 5 },
    },
    environment
  )

  const getNotifications = createQuery(
    {
      decoder: t.exact(
        t.type({
          notifications: t.array(NotificationDecoder),
          userId: Uuid,
        })
      ),
      enableSwr: true,
      getCurrentValue: (payload: { userId: number }) => {
        return handleMessage({ type: 'NotificationsQuery', payload })
      },
      staleAfter: { hour: 1 },
      getKey: ({ userId }) => {
        return `de.serlo.org/api/notifications/${userId}`
      },
      getPayload: (key) => {
        const prefix = 'de.serlo.org/api/notifications/'
        return key.startsWith(prefix)
          ? O.some({ userId: parseInt(key.replace(prefix, ''), 10) })
          : O.none
      },
      examplePayload: { userId: 1 },
    },
    environment
  )

  const setNotificationState = createMutation({
    decoder: t.void,
    async mutate(payload: { ids: number[]; userId: number; unread: boolean }) {
      await handleMessageWithoutResponse({
        type: 'NotificationSetStateMutation',
        payload,
      })
    },
    async updateCache({ ids, userId, unread }) {
      await getNotifications._querySpec.setCache({
        payload: { userId },
        getValue(current) {
          if (!current) return

          const notifications = current.notifications.map((notification) =>
            ids.includes(notification.id)
              ? { ...notification, unread }
              : notification
          )
          return { ...current, notifications }
        },
      })
    },
  })

  const getSubscriptions = createQuery(
    {
      decoder: SubscriptionsDecoder,
      enableSwr: true,
      getCurrentValue: (payload: { userId: number }) => {
        return handleMessage({ type: 'SubscriptionsQuery', payload })
      },
      staleAfter: { hour: 1 },
      getKey: ({ userId }) => {
        return `de.serlo.org/api/subscriptions/${userId}`
      },
      getPayload: (key) => {
        const prefix = 'de.serlo.org/api/subscriptions/'
        return key.startsWith(prefix)
          ? O.some({ userId: parseInt(key.replace(prefix, ''), 10) })
          : O.none
      },
      examplePayload: { userId: 1 },
    },
    environment
  )

  const setSubscription = createMutation({
    decoder: t.void,
    async mutate(payload: {
      ids: Uuid[]
      userId: number
      subscribe: boolean
      sendEmail: boolean
    }) {
      await handleMessageWithoutResponse({
        type: 'SubscriptionSetMutation',
        payload,
      })
    },
    async updateCache({ ids, sendEmail, userId, subscribe }) {
      await getSubscriptions._querySpec.setCache({
        payload: { userId },
        getValue(current) {
          if (!current) return

          const currentWithoutNew = current.subscriptions.filter(
            ({ objectId }) => !ids.includes(objectId)
          )

          // remove
          if (!subscribe) {
            return { subscriptions: currentWithoutNew }
          }

          // merge
          const newEntries = ids.map((objectId) => ({ objectId, sendEmail }))
          return {
            subscriptions: newEntries
              .concat(currentWithoutNew)
              .sort((a, b) => a.objectId - b.objectId),
          }
        },
      })
    },
  })

  const getThreadIds = createQuery(
    {
      decoder: t.type({ firstCommentIds: t.array(t.number) }),
      getCurrentValue: async (payload: { id: number }) => {
        return handleMessage({ type: 'ThreadsQuery', payload })
      },
      enableSwr: true,
      staleAfter: { day: 1 },
      getKey: ({ id }) => {
        return `de.serlo.org/api/threads/${id}`
      },
      getPayload: (key) => {
        const prefix = 'de.serlo.org/api/threads/'
        return key.startsWith(prefix)
          ? O.some({ id: parseInt(key.replace(prefix, ''), 10) })
          : O.none
      },
      examplePayload: { id: 1 },
    },
    environment
  )

  const createThread = createMutation({
    decoder: t.union([CommentDecoder, t.null]),
    mutate: (payload: ThreadCreateThreadInput & { userId: number }) => {
      return handleMessage({ type: 'ThreadCreateThreadMutation', payload })
    },
    updateCache: async (payload, value) => {
      if (value !== null) {
        await getUuid._querySpec.setCache({
          payload: { id: value.id },
          value,
        })
        await getThreadIds._querySpec.setCache({
          payload: { id: payload.objectId },
          getValue(current) {
            if (!current) return
            current.firstCommentIds.unshift(value.id) //new thread on first pos
            return current
          },
        })
      }
    },
  })

  const createComment = createMutation({
    decoder: t.union([CommentDecoder, t.null]),
    mutate: (payload: {
      content: string
      threadId: number
      userId: number
      subscribe: boolean
      sendEmail: boolean
    }) => {
      return handleMessage({ type: 'ThreadCreateCommentMutation', payload })
    },
    updateCache: async (payload, value) => {
      if (value !== null) {
        await getUuid._querySpec.setCache({
          payload: { id: value.id },
          value,
        })
        await getUuid._querySpec.setCache({
          payload: { id: payload.threadId },
          getValue(current) {
            if (!current || current.__typename !== 'Comment') return
            current.childrenIds.push(value.id) // new comment on last pos in thread
            return current
          },
        })
      }
    },
  })

  const archiveThread = createMutation({
    decoder: t.void,
    async mutate(payload: {
      ids: number[]
      archived: boolean
      userId: number
    }) {
      await handleMessageWithoutResponse({
        type: 'ThreadSetThreadArchivedMutation',
        payload,
      })
    },
    async updateCache({ ids, archived }) {
      await getUuid._querySpec.setCache({
        payloads: ids.map((id) => {
          return { id }
        }),
        getValue(current) {
          if (!current || current.__typename !== 'Comment') return
          return {
            ...current,
            archived: ids.includes(current.id) ? archived : current.archived,
          }
        },
      })
    },
  })

  const checkoutEntityRevision = createMutation({
    decoder: t.type({ success: t.literal(true) }),
    async mutate(payload: {
      revisionId: Uuid
      userId: number
      reason: string
    }) {
      return handleMessage({ type: 'EntityCheckoutRevisionMutation', payload })
    },
    async updateCache({ revisionId }) {
      const revision = await getUuidWithCustomDecoder({
        id: revisionId,
        decoder: EntityRevisionDecoder,
      })

      await getUuid._querySpec.setCache({
        payload: { id: revision.repositoryId },
        getValue(current) {
          if (!EntityDecoder.is(current)) return

          current.currentRevisionId = revisionId

          return current
        },
      })

      await getUuid._querySpec.setCache({
        payload: { id: revisionId },
        getValue(current) {
          if (!EntityRevisionDecoder.is(current)) return

          return { ...current, trashed: false }
        },
      })

      await getUnrevisedEntities._querySpec.removeCache({ payload: undefined })
    },
  })

  const checkoutPageRevision = createMutation({
    decoder: t.type({ success: t.literal(true) }),
    async mutate(payload: {
      revisionId: Uuid
      userId: number
      reason: string
    }) {
      return handleMessage({ type: 'PageCheckoutRevisionMutation', payload })
    },
    async updateCache({ revisionId }) {
      const revision = await getUuidWithCustomDecoder({
        id: revisionId,
        decoder: PageRevisionDecoder,
      })

      await getUuid._querySpec.setCache({
        payload: { id: revision.repositoryId },
        getValue(current) {
          if (!PageDecoder.is(current)) return

          current.currentRevisionId = revisionId

          return current
        },
      })

      await getUuid._querySpec.setCache({
        payload: { id: revisionId },
        getValue(current) {
          if (!PageRevisionDecoder.is(current)) return

          return { ...current, trashed: false }
        },
      })
    },
  })

  const rejectEntityRevision = createMutation({
    decoder: t.type({ success: t.literal(true) }),
    async mutate(payload: {
      revisionId: number
      userId: number
      reason: string
    }) {
      return handleMessage({ type: 'EntityRejectRevisionMutation', payload })
    },
    async updateCache({ revisionId }) {
      await getUuid._querySpec.setCache({
        payload: { id: revisionId },
        getValue(current) {
          if (!EntityRevisionDecoder.is(current)) return

          return { ...current, trashed: true }
        },
      })

      await getUnrevisedEntities._querySpec.removeCache({ payload: undefined })
    },
  })

  const rejectPageRevision = createMutation({
    decoder: t.type({ success: t.literal(true) }),
    async mutate(payload: {
      revisionId: number
      userId: number
      reason: string
    }) {
      return handleMessage({ type: 'PageRejectRevisionMutation', payload })
    },
    async updateCache({ revisionId }) {
      await getUuid._querySpec.setCache({
        payload: { id: revisionId },
        getValue(current) {
          if (!PageRevisionDecoder.is(current)) return

          return { ...current, trashed: true }
        },
      })
    },
  })

  return {
    createThread,
    archiveThread,
    createComment,
    deleteBots,
    deleteRegularUsers,
    setEmail,
    checkoutEntityRevision,
    checkoutPageRevision,
    getActiveAuthorIds,
    getActiveReviewerIds,
    getActivityByType,
    getAlias,
    getLicense,
    getNavigationPayload,
    getNavigation,
    getNotificationEvent,
    getEvents,
    getEventsAfter,
    getNotifications,
    getPotentialSpamUsers,
    getSubjects,
    getSubscriptions,
    setSubscription,
    getThreadIds,
    getUnrevisedEntities,
    getUnrevisedEntitiesPerSubject,
    getUuid,
    getUuidWithCustomDecoder,
    rejectEntityRevision,
    rejectPageRevision,
    setUuidState,
    setNotificationState,
  }
}

function getInstanceFromKey(key: string): Instance | null {
  const instance = key.slice(0, 2)
  return key.startsWith(`${instance}.serlo.org`) && isInstance(instance)
    ? instance
    : null
}

async function handleMessage(args: MessagePayload) {
  const response = await handleMessageWithoutResponse(args)
  return (await response.json()) as unknown
}

async function handleMessageWithoutResponse(
  message: MessagePayload
): Promise<Response> {
  const response = await fetch(
    `http://${process.env.SERLO_ORG_DATABASE_LAYER_HOST}`,
    {
      method: 'POST',
      body: JSON.stringify(message),
      headers: { 'Content-Type': 'application/json' },
    }
  )
  switch (response.status) {
    case 200:
    case 404:
      return response
    case 400:
      throw new UserInputError((await parseReason(response)) ?? 'Bad Request')
    default:
      throw new Error(`${response.status}: ${JSON.stringify(message)}`)
  }
}

async function parseReason(response: Response) {
  const responseText = await response.text()
  return F.pipe(
    O.tryCatch(() => JSON.parse(responseText) as unknown),
    O.chain(O.fromPredicate(t.type({ reason: t.string }).is)),
    O.map((json) => json.reason),
    O.toNullable
  )
}

interface MessagePayload {
  type: string
  payload?: Record<string, unknown>
}
