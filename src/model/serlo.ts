/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { option as O } from 'fp-ts'
import jwt from 'jsonwebtoken'
import * as R from 'ramda'

import { Service } from '../internals/auth'
import { Environment } from '../internals/environment'
import {
  createHelper,
  createMutation,
  createQuery,
  FetchHelpers,
} from '../internals/model'
import {
  AbstractNotificationEventPayload,
  AbstractUuidPayload,
  AliasPayload,
  decodePath,
  encodePath,
  EntityPayload,
  isUnsupportedNotificationEvent,
  isUnsupportedUuid,
  Navigation,
  NavigationPayload,
  NodeData,
  NotificationsPayload,
  SubscriptionsPayload,
  ThreadsPayload,
} from '../schema'
import { Instance, License } from '../types'

export function createSerloModel({
  environment,
  fetchHelpers,
}: {
  environment: Environment
  fetchHelpers: FetchHelpers
}) {
  function getToken() {
    return jwt.sign({}, process.env.SERLO_ORG_SECRET, {
      expiresIn: '2h',
      audience: Service.Serlo,
      issuer: 'api.serlo.org',
    })
  }

  function get<T>({
    path,
    instance = Instance.De,
  }: {
    path: string
    instance?: Instance
  }): Promise<T> {
    return fetchHelpers.get(
      `http://${instance}.${process.env.SERLO_ORG_HOST}${path}`,
      {},
      {
        headers: {
          Authorization: `Serlo Service=${getToken()}`,
        },
      }
    )
  }

  function post<T>({
    path,
    instance = Instance.De,
    body,
  }: {
    path: string
    instance?: Instance
    body: Record<string, unknown>
  }): Promise<T> {
    return fetchHelpers.post(
      `http://${instance}.${process.env.SERLO_ORG_HOST}${path}`,
      body,
      {
        headers: {
          Authorization: `Serlo Service=${getToken()}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
      }
    )
  }

  const getUuid = createQuery<{ id: number }, AbstractUuidPayload | null>(
    {
      getCurrentValue: async ({ id }) => {
        const uuid = await get<AbstractUuidPayload | null>({
          path: `/api/uuid/${id}`,
        })
        return uuid === null || isUnsupportedUuid(uuid) ? null : uuid
      },
      maxAge: { minutes: 5 },
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

  const getActiveAuthorIds = createQuery<undefined, number[]>(
    {
      getCurrentValue: async () => {
        return await get<number[]>({
          path: '/api/user/active-authors',
        })
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
      getCurrentValue: async () => {
        return await get<number[]>({
          path: '/api/user/active-reviewers',
        })
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
      getCurrentValue: async ({ instance }) => {
        return await get<NavigationPayload>({
          path: '/api/navigation',
          instance,
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
    AliasPayload
  >(
    {
      getCurrentValue: async ({ path, instance }) => {
        const cleanPath = encodePath(decodePath(path))
        return get({ path: `/api/alias${cleanPath}`, instance })
      },
      maxAge: { minutes: 5 },
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
      getCurrentValue: async ({ id }) => {
        return get({ path: `/api/license/${id}` })
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
      getCurrentValue: async ({ id }) => {
        const notificationEvent = await get<AbstractNotificationEventPayload>({
          path: `/api/event/${id}`,
        })
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
      getCurrentValue: async ({ id }) => {
        const payload = await get<NotificationsPayload>({
          path: `/api/notifications/${id}`,
        })
        return {
          ...payload,
          // Sometimes, Zend serializes an array as an object... This line ensures that we have an array.
          notifications: Object.values(payload.notifications),
        }
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

  const setNotificationState = createMutation<{
    id: number
    userId: number
    unread: boolean
  }>({
    mutate: async (notificationState: {
      id: number
      userId: number
      unread: boolean
    }) => {
      const value = await post<NotificationsPayload>({
        path: `/api/set-notification-state/${notificationState.id}`,
        body: {
          userId: notificationState.userId,
          unread: notificationState.unread,
        },
      })
      await environment.cache.set({
        key: `de.serlo.org/api/notifications/${notificationState.userId}`,
        value,
      })
    },
  })

  const getSubscriptions = createQuery<{ id: number }, SubscriptionsPayload>(
    {
      getCurrentValue: async ({ id }) => {
        return get({
          path: `/api/subscriptions/${id}`,
        })
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
      getCurrentValue: async ({ id }) => {
        return get({
          path: `/api/threads/${id}`,
        })
      },
      maxAge: { minutes: 5 },
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

  const getAllCacheKeys = createQuery<undefined, string[]>(
    {
      getCurrentValue: async () => {
        return get({
          path: `/api/cache-keys`,
        })
      },
      maxAge: { hour: 1 },
      getKey: () => {
        return 'de.serlo.org/api/cache-keys'
      },
      getPayload: (key) => {
        if (key !== 'de.serlo.org/api/cache-keys') return O.none
        return O.some(undefined)
      },
    },
    environment
  )

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
    getActiveAuthorIds,
    getActiveReviewerIds,
    getAlias,
    getAllCacheKeys,
    getLicense,
    getNavigationPayload,
    getNavigation,
    getNotificationEvent,
    getNotifications,
    getSubscriptions,
    getThreadIds,
    getUuid,
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

function isInstance(instance: string): instance is Instance {
  return Object.values(Instance).includes(instance as Instance)
}
