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
import { option as O } from 'fp-ts'
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
  async function handleMessage(args: MessagePayload) {
    const response = await handleMessageWithoutResponse(args)
    return (await response.json()) as unknown
  }

  async function handleMessageWithoutResponse({
    message,
    expectedStatusCodes,
  }: MessagePayload): Promise<Response> {
    const response = await fetch(
      `http://${process.env.SERLO_ORG_DATABASE_LAYER_HOST}`,
      {
        method: 'POST',
        body: JSON.stringify(message),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    if (!expectedStatusCodes.includes(response.status)) {
      throw new Error(`${response.status}: ${JSON.stringify(message)}`)
    }
    return response
  }

  interface MessagePayload {
    message: {
      type: string
      payload?: Record<string, unknown>
    }
    expectedStatusCodes: number[]
  }

  const getUuid = createQuery(
    {
      decoder: t.union([UuidDecoder, t.null]),
      enableSwr: true,
      getCurrentValue: async ({ id }: { id: number }) => {
        const uuid = (await handleMessage({
          message: {
            type: 'UuidQuery',
            payload: {
              id,
            },
          },
          expectedStatusCodes: [200, 404],
        })) as Model<'AbstractUuid'> | null
        return uuid !== null && isSupportedUuidType(uuid.__typename)
          ? uuid
          : null
      },
      maxAge: { hour: 1 },
      getKey: ({ id }) => {
        return `de.serlo.org/api/uuid/${id}`
      },
      getPayload: (key) => {
        if (!key.startsWith('de.serlo.org/api/uuid/')) return O.none
        const id = parseInt(key.replace('de.serlo.org/api/uuid/', ''), 10)
        return O.some({ id })
      },
    },
    environment
  )

  async function getUuidWithCustomDecoder<
    S extends Model<'AbstractUuid'> | null
  >({ id, decoder }: { id: number; decoder: t.Type<S> }): Promise<S> {
    return getUuid._querySpec.queryWithDecoder({ id }, decoder)
  }

  const setUuidState = createMutation({
    decoder: t.union([
      t.void,
      t.strict({ success: t.literal(false), reason: t.string }),
    ]),
    async mutate(payload: { ids: number[]; userId: number; trashed: boolean }) {
      const response = await handleMessageWithoutResponse({
        message: { type: 'UuidSetStateMutation', payload },
        expectedStatusCodes: [200, 400],
      })

      if (response.status === 400) {
        return (await response.json()) as unknown
      }
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
        const response = await handleMessageWithoutResponse({
          message: {
            type: 'ActiveAuthorsQuery',
          },
          expectedStatusCodes: [200],
        })
        return (await response.json()) as number[]
      },
      maxAge: { hour: 1 },
      getKey: () => {
        return 'de.serlo.org/api/user/active-authors'
      },
      getPayload: (key: string) => {
        if (key !== 'de.serlo.org/api/user/active-authors') return O.none
        return O.some(undefined)
      },
    },
    environment
  )

  const getActiveReviewerIds = createQuery(
    {
      decoder: t.array(t.number),
      enableSwr: true,
      getCurrentValue: async () => {
        const response = await handleMessageWithoutResponse({
          message: {
            type: 'ActiveReviewersQuery',
          },
          expectedStatusCodes: [200],
        })
        return (await response.json()) as number[]
      },
      maxAge: { hour: 1 },
      getKey: () => {
        return 'de.serlo.org/api/user/active-reviewers'
      },
      getPayload: (key: string) => {
        if (key !== 'de.serlo.org/api/user/active-reviewers') return O.none
        return O.some(undefined)
      },
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
      getCurrentValue: async (payload: { userId: number }) => {
        return handleMessage({
          message: { type: 'ActivityByTypeQuery', payload },
          expectedStatusCodes: [200],
        })
      },
      maxAge: { minutes: 10 },
      getKey: ({ userId }) => {
        return `de.serlo.org/api/user/activity-by-type/${userId}`
      },
      getPayload: (key) => {
        if (!key.startsWith('de.serlo.org/api/user/activity-by-type/'))
          return O.none
        const userId = parseInt(
          key.replace('de.serlo.org/api/activity-by-type/', '')
        )
        if (Number.isNaN(userId)) return O.none
        return O.some({ userId })
      },
    },
    environment
  )

  const deleteBots = createMutation({
    decoder: t.union([
      t.type({ success: t.literal(true), deletedUuids: t.array(t.number) }),
      t.type({ success: t.literal(false), reason: t.string }),
    ]),
    async mutate(payload: { botId: number }) {
      return await handleMessage({
        message: { type: 'UserDeleteBotsMutation', payload },
        expectedStatusCodes: [200],
      })
    },
    async updateCache({ botId }, serverPayload) {
      if (!serverPayload.success) return

      await getUuid._querySpec.removeCache({
        payloads: [botId, ...serverPayload.deletedUuids].map((id) => {
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
      return handleMessage({
        message: { type: 'UserDeleteRegularUsersMutation', payload },
        expectedStatusCodes: [200],
      })
    },
    async updateCache({ userId }, { success }) {
      if (success) {
        await getUuid._querySpec.removeCache({ payload: { id: userId } })
      }
    },
  })

  const setEmail = createMutation({
    decoder: t.union([
      t.type({ success: t.literal(true), username: t.string }),
      t.type({ success: t.literal(false), reason: t.string }),
    ]),
    mutate: (payload: { userId: number; email: string }) => {
      return handleMessage({
        message: { type: 'UserSetEmailMutation', payload },
        expectedStatusCodes: [200, 400],
      })
    },
  })

  const getNavigationPayload = createQuery(
    {
      decoder: NavigationDecoder,
      enableSwr: true,
      getCurrentValue: async ({ instance }: { instance: Instance }) => {
        return await handleMessage({
          message: {
            type: 'NavigationQuery',
            payload: {
              instance,
            },
          },
          expectedStatusCodes: [200],
        })
      },
      maxAge: { hour: 1 },
      getKey: ({ instance }) => {
        return `${instance}.serlo.org/api/navigation`
      },
      getPayload: (key: string) => {
        const instance = getInstanceFromKey(key)
        return instance && key === `${instance}.serlo.org/api/navigation`
          ? O.some({ instance })
          : O.none
      },
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
      enableSwr: true,
      getCurrentValue: ({
        path,
        instance,
      }: {
        path: string
        instance: Instance
      }) => {
        return handleMessage({
          message: {
            type: 'AliasQuery',
            payload: { instance, path: decodePath(path) },
          },
          expectedStatusCodes: [200, 404],
        })
      },
      maxAge: { hour: 1 },
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
      getCurrentValue: ({ id }: { id: number }) => {
        return handleMessage({
          message: { type: 'LicenseQuery', payload: { id } },
          expectedStatusCodes: [200, 404],
        })
      },
      enableSwr: true,
      maxAge: { day: 1 },
      getKey: ({ id }) => `de.serlo.org/api/license/${id}`,
      getPayload: (key) => {
        const prefix = 'de.serlo.org/api/license/'
        return key.startsWith(prefix)
          ? O.some({ id: parseInt(key.replace(prefix, ''), 10) })
          : O.none
      },
    },
    environment
  )

  const getNotificationEvent = createQuery(
    {
      decoder: t.union([NotificationEventDecoder, t.null]),
      enableSwr: true,
      getCurrentValue: async ({ id }: { id: number }) => {
        const notificationEvent = (await handleMessage({
          message: { type: 'EventQuery', payload: { id } },
          expectedStatusCodes: [200, 404],
        })) as Model<'AbstractNotificationEvent'> | null

        return notificationEvent === null ||
          isUnsupportedNotificationEvent(notificationEvent)
          ? null
          : notificationEvent
      },
      maxAge: { day: 1 },
      getKey: ({ id }) => {
        return `de.serlo.org/api/event/${id}`
      },
      getPayload: (key) => {
        const prefix = 'de.serlo.org/api/event/'
        return key.startsWith(prefix)
          ? O.some({ id: parseInt(key.replace(prefix, ''), 10) })
          : O.none
      },
    },
    environment
  )

  const getNewEvents = createRequest({
    decoder: t.type({ events: t.array(NotificationEventDecoder) }),
    async getCurrentValue(payload: { after?: number }) {
      return await handleMessage({
        message: { type: 'EventsQuery', payload },
        expectedStatusCodes: [200],
      })
    },
  })

  const getEvents = createQuery<
    undefined,
    Model<'AbstractNotificationEvent'>[]
  >(
    {
      decoder: t.array(NotificationEventDecoder),
      async getCurrentValue(_payload, current) {
        current ??= []
        const lastEvent = R.last(current)
        const payload = lastEvent === undefined ? {} : { after: lastEvent.id }
        const updateEvents = await getNewEvents(payload)

        if (updateEvents.events.length === 0) {
          return current
        } else {
          return this.getCurrentValue(
            undefined,
            current.concat(updateEvents.events)
          )
        }
      },
      getKey() {
        return 'de.serlo.org/events'
      },
      getPayload(key: string) {
        return key === 'de.serlo.org/events' ? O.some(undefined) : O.none
      },
      enableSwr: true,
      maxAge: { minute: 2 },
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
      getCurrentValue: ({ userId }: { userId: number }) => {
        return handleMessage({
          message: {
            type: 'NotificationsQuery',
            payload: {
              userId,
            },
          },
          expectedStatusCodes: [200],
        })
      },
      maxAge: { hour: 1 },
      getKey: ({ userId }) => {
        return `de.serlo.org/api/notifications/${userId}`
      },
      getPayload: (key) => {
        const prefix = 'de.serlo.org/api/notifications/'
        return key.startsWith(prefix)
          ? O.some({ userId: parseInt(key.replace(prefix, ''), 10) })
          : O.none
      },
    },
    environment
  )

  const setNotificationState = createMutation({
    decoder: t.void,
    async mutate(payload: { ids: number[]; userId: number; unread: boolean }) {
      await handleMessageWithoutResponse({
        message: { type: 'NotificationSetStateMutation', payload },
        expectedStatusCodes: [200],
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
      getCurrentValue: async ({ userId }: { userId: number }) => {
        return await handleMessage({
          message: {
            type: 'SubscriptionsQuery',
            payload: {
              userId,
            },
          },
          expectedStatusCodes: [200],
        })
      },
      maxAge: { hour: 1 },
      getKey: ({ userId }) => {
        return `de.serlo.org/api/subscriptions/${userId}`
      },
      getPayload: (key) => {
        const prefix = 'de.serlo.org/api/subscriptions/'
        return key.startsWith(prefix)
          ? O.some({ userId: parseInt(key.replace(prefix, ''), 10) })
          : O.none
      },
    },
    environment
  )

  const setSubscription = createMutation({
    decoder: t.void,
    async mutate(payload: {
      ids: number[]
      userId: number
      subscribe: boolean
      sendEmail: boolean
    }) {
      await handleMessageWithoutResponse({
        message: { type: 'SubscriptionSetMutation', payload },
        expectedStatusCodes: [200],
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
      getCurrentValue: async ({ id }: { id: number }) => {
        return handleMessage({
          message: { type: 'ThreadsQuery', payload: { id } },
          expectedStatusCodes: [200],
        })
      },
      enableSwr: true,
      maxAge: { hour: 1 },
      getKey: ({ id }) => {
        return `de.serlo.org/api/threads/${id}`
      },
      getPayload: (key) => {
        const prefix = 'de.serlo.org/api/threads/'
        return key.startsWith(prefix)
          ? O.some({ id: parseInt(key.replace(prefix, ''), 10) })
          : O.none
      },
    },
    environment
  )

  const createThread = createMutation({
    decoder: t.union([CommentDecoder, t.null]),
    mutate: (payload: ThreadCreateThreadInput & { userId: number }) => {
      return handleMessage({
        message: { type: 'ThreadCreateThreadMutation', payload },
        expectedStatusCodes: [200],
      })
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
      return handleMessage({
        message: { type: 'ThreadCreateCommentMutation', payload },
        expectedStatusCodes: [200],
      })
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
        message: { type: 'ThreadSetThreadArchivedMutation', payload },
        expectedStatusCodes: [200],
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

  const checkoutRevision = createMutation({
    decoder: t.union([
      t.type({ success: t.literal(true) }),
      t.type({ success: t.literal(false), reason: t.string }),
    ]),
    async mutate(payload: {
      revisionId: number
      userId: number
      reason: string
    }) {
      return await handleMessage({
        message: { type: 'EntityCheckoutRevisionMutation', payload },
        expectedStatusCodes: [200, 400],
      })
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
    },
  })

  const rejectRevision = createMutation({
    decoder: t.union([
      t.type({ success: t.literal(true) }),
      t.type({ success: t.literal(false), reason: t.string }),
    ]),
    async mutate(payload: {
      revisionId: number
      userId: number
      reason: string
    }) {
      return await handleMessage({
        message: { type: 'EntityRejectRevisionMutation', payload },
        expectedStatusCodes: [200, 400],
      })
    },
    async updateCache({ revisionId }) {
      await getUuid._querySpec.setCache({
        payload: { id: revisionId },
        getValue(current) {
          if (!EntityRevisionDecoder.is(current)) return

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
    checkoutRevision,
    getActiveAuthorIds,
    getActiveReviewerIds,
    getActivityByType,
    getAlias,
    getLicense,
    getNavigationPayload,
    getNavigation,
    getNotificationEvent,
    getEvents,
    getNotifications,
    getSubscriptions,
    setSubscription,
    getThreadIds,
    getUuid,
    getUuidWithCustomDecoder,
    rejectRevision,
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
