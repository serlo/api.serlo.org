/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { ForbiddenError } from 'apollo-server'
import { option as O } from 'fp-ts'
import jwt from 'jsonwebtoken'
import fetch, { Response } from 'node-fetch'
import * as R from 'ramda'

import { Service } from '~/internals/auth'
import { Environment } from '~/internals/environment'
import { createHelper, createMutation, createQuery } from '~/internals/model'
import { isInstance } from '~/schema/instance'
import {
  AbstractNotificationEventPayload,
  isUnsupportedNotificationEvent,
  NotificationsPayload,
} from '~/schema/notification'
import { SubscriptionsPayload } from '~/schema/subscription'
import { CommentPayload, ThreadsPayload } from '~/schema/thread'
import {
  AbstractUuidPayload,
  AliasPayload,
  decodePath,
  DiscriminatorType,
  encodePath,
  EntityPayload,
  isUnsupportedUuid,
  Navigation,
  NavigationPayload,
  NodeData,
} from '~/schema/uuid'
import { Instance, License, ThreadCreateThreadInput } from '~/types'

export function createSerloModel({
  environment,
}: {
  environment: Environment
}) {
  function getToken() {
    return jwt.sign({}, process.env.SERLO_ORG_SECRET, {
      expiresIn: '2h',
      audience: Service.Serlo,
      issuer: 'api.serlo.org',
    })
  }

  async function get({ path }: { path: string }): Promise<Response> {
    return await fetch(
      `http://${process.env.SERLO_ORG_DATABASE_LAYER_HOST}${path}`
    )
  }

  async function postViaDatabaseLayer({
    path,
    body,
  }: {
    path: string
    body: Record<string, unknown>
  }): Promise<Response> {
    return await fetch(
      `http://${process.env.SERLO_ORG_DATABASE_LAYER_HOST}${path}`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  async function postViaLegacySerlo({
    path,
    instance = Instance.De,
    body,
  }: {
    path: string
    instance?: Instance
    body: Record<string, unknown>
  }): Promise<Response> {
    const response = await fetch(
      `http://${instance}.${process.env.SERLO_ORG_HOST}${path}`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          Authorization: `Serlo Service=${getToken()}`,
          'Content-Type': 'application/json',
        },
      }
    )
    if (response.status === 403) {
      throw new ForbiddenError(
        'You are not allowed to set the notification state'
      )
    }
    return response
  }

  const getUuid = createQuery<{ id: number }, AbstractUuidPayload | null>(
    {
      enableSwr: true,
      getCurrentValue: async ({ id }) => {
        const response = await get({
          path: `/uuid/${id}`,
        })
        if (response.status !== 200 && response.status !== 404) {
          throw new Error(`${response.status}: ${response.statusText}`)
        }
        const uuid = (await response.json()) as AbstractUuidPayload | null
        return uuid === null || isUnsupportedUuid(uuid) ? null : uuid
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

  const setUuidState = createMutation<
    {
      ids: number[]
      userId: number
      trashed: boolean
    },
    {
      success: true
    }
  >({
    mutate: async ({ ids, userId, trashed }) => {
      const response = await postViaDatabaseLayer({
        path: `/set-uuid-state`,
        body: { ids, userId, trashed },
      })
      if (response.status !== 200) {
        throw new Error(`${response.status}: ${response.statusText}`)
      }
      await getUuid._querySpec.setCache({
        payloads: ids.map((id) => {
          return { id }
        }),
        // eslint-disable-next-line @typescript-eslint/require-await
        async getValue(current) {
          if (!current || current.trashed === trashed) {
            return
          }
          return { ...current, trashed }
        },
      })
      return {
        success: true,
      }
    },
  })

  const getActiveAuthorIds = createQuery<undefined, number[]>(
    {
      enableSwr: true,
      getCurrentValue: async () => {
        const response = await get({
          path: '/user/active-authors',
        })
        if (response.status !== 200) {
          throw new Error(`${response.status}: ${response.statusText}`)
        }
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

  const getActiveReviewerIds = createQuery<undefined, number[]>(
    {
      enableSwr: true,
      getCurrentValue: async () => {
        const response = await get({
          path: '/user/active-reviewers',
        })
        if (response.status !== 200) {
          throw new Error(`${response.status}: ${response.statusText}`)
        }
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
  const getNavigationPayload = createQuery<
    { instance: Instance },
    NavigationPayload
  >(
    {
      enableSwr: true,
      getCurrentValue: async ({ instance }) => {
        const response = await get({
          path: `/navigation/${instance}`,
        })
        if (response.status !== 200) {
          throw new Error(`${response.status}: ${response.statusText}`)
        }
        return (await response.json()) as NavigationPayload
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

  const getNavigation = createHelper<
    { instance: Instance; id: number },
    Navigation | null
  >({
    helper: async ({ instance, id }) => {
      const payload = await getNavigationPayload({ instance })
      const { data } = payload

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
        const uuid = nodeData.id
          ? ((await getUuid({
              id: nodeData.id,
            })) as EntityPayload)
          : null
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

  const getAlias = createQuery<
    { path: string; instance: Instance },
    AliasPayload | null
  >(
    {
      enableSwr: true,
      getCurrentValue: async ({ path, instance }) => {
        const response = await get({ path: `/alias/${instance}${path}` })
        if (response.status !== 200 && response.status !== 404) {
          throw new Error(`${response.status}: ${response.statusText}`)
        }
        return (await response.json()) as AliasPayload | null
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

  const getLicense = createQuery<{ id: number }, License>(
    {
      enableSwr: true,
      getCurrentValue: async ({ id }) => {
        const response = await get({
          path: `/license/${id}`,
        })
        if (response.status !== 200 && response.status !== 404) {
          throw new Error(`${response.status}: ${response.statusText}`)
        }
        return (await response.json()) as License
      },
      maxAge: { day: 1 },
      getKey: ({ id }) => {
        return `de.serlo.org/api/license/${id}`
      },
      getPayload: (key) => {
        const prefix = 'de.serlo.org/api/license/'
        return key.startsWith(prefix)
          ? O.some({ id: parseInt(key.replace(prefix, ''), 10) })
          : O.none
      },
    },
    environment
  )

  const getNotificationEvent = createQuery<
    { id: number },
    AbstractNotificationEventPayload | null
  >(
    {
      enableSwr: true,
      getCurrentValue: async ({ id }) => {
        const response = await get({
          path: `/event/${id}`,
        })
        if (response.status !== 200 && response.status !== 404) {
          throw new Error(`${response.status}: ${response.statusText}`)
        }
        const notificationEvent = (await response.json()) as AbstractNotificationEventPayload
        return isUnsupportedNotificationEvent(notificationEvent)
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

  const getNotifications = createQuery<{ id: number }, NotificationsPayload>(
    {
      enableSwr: true,
      getCurrentValue: async ({ id }) => {
        const response = await get({
          path: `/notifications/${id}`,
        })
        if (response.status !== 200) {
          throw new Error(`${response.status}: ${response.statusText}`)
        }
        return (await response.json()) as NotificationsPayload
      },
      maxAge: { hour: 1 },
      getKey: ({ id }) => {
        return `de.serlo.org/api/notifications/${id}`
      },
      getPayload: (key) => {
        const prefix = 'de.serlo.org/api/notifications/'
        return key.startsWith(prefix)
          ? O.some({ id: parseInt(key.replace(prefix, ''), 10) })
          : O.none
      },
    },
    environment
  )

  const setNotificationState = createMutation<
    {
      ids: number[]
      userId: number
      unread: boolean
    },
    NotificationsPayload[]
  >({
    mutate: async ({ ids, userId, unread }) => {
      return await Promise.all(
        //TODO: rewrite legacy endpoint so that it accepts an array directly
        ids.map(
          async (id): Promise<NotificationsPayload> => {
            const response = await postViaLegacySerlo({
              path: `/api/set-notification-state`,
              body: { id, userId, unread },
            })
            if (response.status !== 200) {
              throw new Error(`${response.status}: ${response.statusText}`)
            }
            const value = (await response.json()) as NotificationsPayload
            await getNotifications._querySpec.setCache({
              payload: { id: userId },
              value,
            })
            return value
          }
        )
      )
    },
  })

  const getSubscriptions = createQuery<{ id: number }, SubscriptionsPayload>(
    {
      enableSwr: true,
      getCurrentValue: async ({ id }) => {
        const response = await get({
          path: `/subscriptions/${id}`,
        })
        if (response.status !== 200) {
          throw new Error(`${response.status}: ${response.statusText}`)
        }
        return (await response.json()) as SubscriptionsPayload
      },
      maxAge: { hour: 1 },
      getKey: ({ id }) => {
        return `de.serlo.org/api/subscriptions/${id}`
      },
      getPayload: (key) => {
        const prefix = 'de.serlo.org/api/subscriptions/'
        return key.startsWith(prefix)
          ? O.some({ id: parseInt(key.replace(prefix, ''), 10) })
          : O.none
      },
    },
    environment
  )

  const getThreadIds = createQuery<{ id: number }, ThreadsPayload>(
    {
      enableSwr: true,
      getCurrentValue: async ({ id }) => {
        const response = await get({
          path: `/threads/${id}`,
        })
        if (response.status !== 200) {
          throw new Error(`${response.status}: ${response.statusText}`)
        }
        return (await response.json()) as ThreadsPayload
      },
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

  const createThread = createMutation<
    ThreadCreateThreadInput & { userId: number },
    CommentPayload | null
  >({
    mutate: async (payload) => {
      const response = await postViaLegacySerlo({
        path: `/api/thread/start-thread`,
        body: payload,
      })
      if (response.status !== 200) {
        throw new Error(`${response.status}: ${response.statusText}`)
      }
      const value = (await response.json()) as CommentPayload | null

      if (value !== null) {
        await getThreadIds._querySpec.setCache({
          payload: { id: payload.objectId },
          // eslint-disable-next-line @typescript-eslint/require-await
          async getValue(current) {
            if (current === undefined) return

            current.firstCommentIds.push(value.id)
            return current
          },
        })
        await getUuid._querySpec.setCache({
          payload: { id: value.id },
          value,
        })
      }
      return value
    },
  })

  const createComment = createMutation<
    { content: string; threadId: number; userId: number },
    CommentPayload | null
  >({
    mutate: async (payload) => {
      const response = await postViaLegacySerlo({
        path: `/api/thread/comment-thread`,
        body: payload,
      })
      if (response.status !== 200) {
        throw new Error(`${response.status}: ${response.statusText}`)
      }
      const value = (await response.json()) as CommentPayload | null
      if (value !== null) {
        await getUuid._querySpec.setCache({
          payload: { id: value.id },
          value,
        })
        await getUuid._querySpec.setCache({
          payload: { id: payload.threadId },
          // eslint-disable-next-line @typescript-eslint/require-await
          async getValue(current) {
            if (!current || !isCommentPayload(current)) return
            current.childrenIds.push(value.id)
            return current
          },
        })
      }
      return value
    },
  })

  const archiveThread = createMutation<
    { id: number; archived: boolean; userId: number },
    CommentPayload | null
  >({
    mutate: async (payload) => {
      const response = await postViaLegacySerlo({
        path: '/api/thread/set-archive',
        body: payload,
      })
      if (response.status !== 200) {
        throw new Error(`${response.status}: ${response.statusText}`)
      }
      const value = (await response.json()) as CommentPayload | null
      if (value !== null) {
        await getUuid._querySpec.setCache({
          payload: { id: value.id },
          value,
        })
      }
      return value
    },
  })

  const setCacheValue = createMutation<{ key: string; value: unknown }>({
    mutate: async ({ key, value }) => {
      await environment.cache.set({ key, value })
    },
  })

  const removeCacheValue = createMutation<{ key: string }>({
    mutate: async ({ key }) => {
      await environment.cache.remove({ key })
    },
  })

  return {
    createThread,
    archiveThread,
    createComment,
    getActiveAuthorIds,
    getActiveReviewerIds,
    getAlias,
    getLicense,
    getNavigationPayload,
    getNavigation,
    getNotificationEvent,
    getNotifications,
    getSubscriptions,
    getThreadIds,
    getUuid,
    setUuidState,
    removeCacheValue,
    setCacheValue,
    setNotificationState,
  }
}

function getInstanceFromKey(key: string): Instance | null {
  const instance = key.slice(0, 2)
  return key.startsWith(`${instance}.serlo.org`) && isInstance(instance)
    ? instance
    : null
}

function isCommentPayload(value: unknown): value is CommentPayload {
  return (
    typeof value === 'object' &&
    (value as AbstractUuidPayload).__typename === DiscriminatorType.Comment
  )
}
