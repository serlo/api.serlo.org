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
import jwt from 'jsonwebtoken'
import * as R from 'ramda'

import { Instance, License } from '../../types'
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
  ThreadsPayload,
} from '../schema'
import { SubscriptionsPayload } from '../schema/subscription'
import { Service } from '../schema/types'
import { CacheableDataSource, DAY, HOUR, MINUTE } from './cacheable-data-source'

export class SerloDataSource extends CacheableDataSource {
  public async getActiveAuthorIds(): Promise<number[]> {
    return await this.cacheAwareGet<number[]>({
      path: '/api/user/active-authors',
      maxAge: 1 * HOUR,
    })
  }

  public async getActiveReviewerIds(): Promise<number[]> {
    return await this.cacheAwareGet<number[]>({
      path: '/api/user/active-reviewers',
      maxAge: 1 * HOUR,
    })
  }

  public async getAlias({
    path,
    instance,
  }: {
    path: string
    instance: Instance
  }) {
    const cleanPath = encodePath(decodePath(path))
    return this.cacheAwareGet<AliasPayload>({
      path: `/api/alias${cleanPath}`,
      instance,
      maxAge: 5 * MINUTE,
    })
  }

  public async getNavigation({
    instance,
    id,
  }: {
    instance: Instance
    id: number
  }): Promise<Navigation | null> {
    const payload = await this.cacheAwareGet<NavigationPayload>({
      path: '/api/navigation',
      instance,
      maxAge: 1 * HOUR,
    })
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
        ? await this.getUuid<EntityPayload>({
            id: nodeData.id,
          })
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
  }

  public async getLicense({ id }: { id: number }): Promise<License> {
    return this.cacheAwareGet({
      path: `/api/license/${id}`,
      maxAge: 1 * DAY,
    })
  }

  public async getUuid<T extends AbstractUuidPayload>({
    id,
  }: {
    id: number
  }): Promise<T | null> {
    const uuid = await this.cacheAwareGet<T | null>({
      path: `/api/uuid/${id}`,
      maxAge: 5 * MINUTE,
    })
    return uuid === null || isUnsupportedUuid(uuid) ? null : uuid
  }

  public async getNotificationEvent<
    T extends AbstractNotificationEventPayload
  >({ id }: { id: number }): Promise<T | null> {
    const notificationEvent = await this.cacheAwareGet<T>({
      path: `/api/event/${id}`,
      maxAge: 1 * DAY,
    })
    return notificationEvent === null ||
      isUnsupportedNotificationEvent(notificationEvent)
      ? null
      : notificationEvent
  }

  public async getNotifications({
    id,
  }: {
    id: number
    bypassCache?: boolean
  }): Promise<NotificationsPayload> {
    const response = await this.cacheAwareGet<NotificationsPayload>({
      path: `/api/notifications/${id}`,
      maxAge: 1 * HOUR,
    })
    return {
      ...response,
      // Sometimes, Zend serializes an array as an object... This line ensures that we have an array.
      notifications: Object.values(response.notifications),
    }
  }

  public async setNotificationsState(notificationState: {
    ids: number[]
    userId: number
    unread: boolean
  }) {
    const values: boolean[] = await Promise.all(
      //TODO: rewrite legacy endpoint so that it accepts an array directly
      notificationState.ids.map(
        async (notificationId): Promise<boolean> => {
          const value = await this.customPost<NotificationsPayload>({
            path: `/api/set-notification-state/${notificationId}`,
            body: {
              userId: notificationState.userId,
              unread: notificationState.unread,
            },
          })
          await this.setCacheValue({
            key: this.getCacheKey(
              `/api/notifications/${notificationState.userId}`
            ),
            update: () => Promise.resolve(value),
          })
          //TODO: check what /api/set-… returns if it's not successful
          return !!value
        }
      )
    )
    return values.every(Boolean)
  }

  public async getSubscriptions({
    id,
  }: {
    id: number
  }): Promise<SubscriptionsPayload> {
    return this.cacheAwareGet({
      path: `/api/subscriptions/${id}`,
      maxAge: 1 * HOUR,
    })
  }

  private async customPost<T>({
    path,
    instance = Instance.De,
    body,
  }: {
    path: string
    instance?: Instance
    body: Record<string, unknown>
  }): Promise<T> {
    return await super.post(
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

  public async getThreadIds({ id }: { id: number }): Promise<ThreadsPayload> {
    return this.cacheAwareGet({
      path: `/api/threads/${id}`,
      maxAge: 5 * MINUTE,
    })
  }

  private async cacheAwareGet<T>({
    path,
    instance,
    maxAge,
  }: {
    path: string
    instance?: Instance
    maxAge?: number
  }): Promise<T> {
    return this.getCacheValue({
      key: this.getCacheKey(path, instance),
      update: () => this.getFromSerlo({ path, instance }),
      maxAge,
    })
  }

  private async getFromSerlo<T>({
    path,
    instance = Instance.De,
  }: {
    path: string
    instance?: Instance
  }): Promise<T> {
    return await super.get<T>(
      `http://${instance}.${process.env.SERLO_ORG_HOST}${path}`,
      {},
      {
        headers: {
          Authorization: `Serlo Service=${getToken()}`,
        },
      }
    )
  }

  private getCacheKey(path: string, instance: Instance = Instance.De) {
    return `${instance}.serlo.org${path}`
  }

  public async getAllCacheKeys(): Promise<string[]> {
    return this.cacheAwareGet<string[]>({
      path: '/api/cache-keys',
      maxAge: 1 * HOUR,
    })
  }

  public async removeCache(key: string) {
    await this.environment.cache.remove(key)
  }
}

function getToken() {
  return jwt.sign({}, process.env.SERLO_ORG_SECRET, {
    expiresIn: '2h',
    audience: Service.Serlo,
    issuer: 'api.serlo.org',
  })
}
