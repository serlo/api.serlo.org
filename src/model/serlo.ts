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
import { option as O } from 'fp-ts'
import jwt from 'jsonwebtoken'
import * as R from 'ramda'

import { Service } from '~/internals/auth'
import { Environment } from '~/internals/environment'
import {
  createHelper,
  createMutation,
  createQuery,
  FetchHelpers,
} from '~/internals/model'
import { isInstance } from '~/schema/instance'
import {
  AbstractNotificationEventPayload,
  isUnsupportedNotificationEvent,
  NotificationsPayload,
} from '~/schema/notification'
import { SubscriptionsPayload } from '~/schema/subscription'
import {
  AbstractUuidPayload,
  AliasPayload,
  CommentPayload,
  decodePath,
  encodePath,
  EntityPayload,
  isUnsupportedUuid,
  Navigation,
  NavigationPayload,
  NodeData,
  ThreadsPayload,
} from '~/schema/uuid'
import { Instance, License, ThreadCreateThreadInput } from '~/types'

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

  function getViaLegacySerlo<T>({
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

  function getViaDatabaseLayer<T>({ path }: { path: string }): Promise<T> {
    return fetchHelpers.get(
      `http://${process.env.SERLO_ORG_DATABASE_LAYER_HOST}${path.replace(
        '/api',
        ''
      )}`
    )
  }

  function postViaDatabaseLayer<T>({
    path,
    body,
  }: {
    path: string
    body: Record<string, unknown>
  }): Promise<T> {
    return fetchHelpers.post(
      `http://${process.env.SERLO_ORG_DATABASE_LAYER_HOST}${path}`,
      body
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
      enableSwr: true,
      getCurrentValue: async ({ id }) => {
        const uuid = await getViaDatabaseLayer<AbstractUuidPayload | null>({
          path: `/uuid/${id}`,
        })
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
    (AbstractUuidPayload | null)[]
  >({
    mutate: async ({ ids, userId, trashed }) => {
      //looping should be fine here, since trashing/restoring multiple items will not happen very often
      return await Promise.all(
        ids.map(
          async (id): Promise<AbstractUuidPayload | null> => {
            const value = await postViaDatabaseLayer<AbstractUuidPayload | null>(
              {
                path: `/set-uuid-state`,
                body: { id, userId, trashed },
              }
            )
            await environment.cache.set({
              key: getUuid._querySpec.getKey({ id }),
              value,
            })
            return value
          }
        )
      )
    },
  })

  const getActiveAuthorIds = createQuery<undefined, number[]>(
    {
      enableSwr: true,
      getCurrentValue: async () => {
        return await getViaDatabaseLayer<number[]>({
          path: '/user/active-authors',
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
      enableSwr: true,
      getCurrentValue: async () => {
        return await getViaDatabaseLayer<number[]>({
          path: '/user/active-reviewers',
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
      enableSwr: true,
      getCurrentValue: async ({ instance }) => {
        return await getViaDatabaseLayer<NavigationPayload>({
          path: `/navigation/${instance}`,
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
    AliasPayload | null
  >(
    {
      enableSwr: true,
      getCurrentValue: async ({ path, instance }) => {
        return getViaDatabaseLayer({ path: `/alias/${instance}${path}` })
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
        return getViaDatabaseLayer({ path: `/license/${id}` })
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
        const notificationEvent = await getViaDatabaseLayer<AbstractNotificationEventPayload>(
          {
            path: `/event/${id}`,
          }
        )
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
        const payload = await getViaDatabaseLayer<NotificationsPayload>({
          path: `/notifications/${id}`,
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
            const value = await post<NotificationsPayload>({
              path: `/api/set-notification-state`,
              body: { id, userId, unread },
            })
            await environment.cache.set({
              key: getNotifications._querySpec.getKey({ id: userId }),
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
        return getViaDatabaseLayer({
          path: `/subscriptions/${id}`,
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
      enableSwr: true,
      getCurrentValue: async ({ id }) => {
        return getViaDatabaseLayer({ path: `/threads/${id}` })
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
      const value = await post<CommentPayload | null>({
        path: `/api/thread/start-thread`,
        body: payload,
      })

      if (value !== null) {
        await environment.cache.set<ThreadsPayload>({
          key: getThreadIds._querySpec.getKey({ id: payload.objectId }),
          getValue(current) {
            if (current === undefined) return Promise.resolve(undefined)

            current.firstCommentIds.push(value.id)
            current.firstCommentIds.sort()

            return Promise.resolve(current)
          },
        })

        await environment.cache.set({
          key: getUuid._querySpec.getKey({ id: value.id }),
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
      const value = await post<CommentPayload | null>({
        path: `/api/thread/comment-thread`,
        body: payload,
      })
      if (value !== null) {
        await environment.cache.set({
          key: getUuid._querySpec.getKey({ id: value.id }),
          value,
        })

        await environment.cache.set<CommentPayload>({
          key: getUuid._querySpec.getKey({ id: payload.threadId }),
          getValue(current) {
            if (current === undefined) return Promise.resolve(undefined)

            current.childrenIds.push(value.id)
            current.childrenIds.sort()

            return Promise.resolve(current)
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
      const value = await post<CommentPayload | null>({
        path: '/api/thread/set-archive',
        body: payload,
      })
      if (value !== null)
        await environment.cache.set({
          key: getUuid._querySpec.getKey({ id: value.id }),
          value,
        })

      return value
    },
  })

  const getAllCacheKeys = createQuery<undefined, string[]>(
    {
      enableSwr: false,
      getCurrentValue: async () => {
        return getViaLegacySerlo({
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
    createThread,
    archiveThread,
    createComment,
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
