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
import { RESTDataSource } from 'apollo-datasource-rest'
import { isSome } from 'fp-ts/lib/Option'
import jwt from 'jsonwebtoken'
import * as R from 'ramda'

import { Instance, License } from '../../types'
import { Environment } from '../environment'
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
} from '../schema'
import { Service } from '../schema/types'

export class SerloDataSource extends RESTDataSource {
  public constructor(private environment: Environment) {
    super()
  }

  public async getActiveAuthorIds(): Promise<number[]> {
    return await this.cacheAwareGet<number[]>({
      path: '/api/user/active-authors',
      ttl: 60 * 60 * 24,
    })
  }

  public async getActiveReviewerIds(): Promise<number[]> {
    return await this.cacheAwareGet<number[]>({
      path: '/api/user/active-reviewers',
      ttl: 60 * 60 * 24,
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
    })
    const { data } = payload

    const leafs: Record<string, number> = {}

    const findLeafs = (node: NodeData): number[] => {
      return [
        ...(node.id ? [node.id] : []),
        ...R.flatten(R.map(findLeafs, node.children || [])),
      ]
    }

    for (let i = 0; i < data.length; i++) {
      findLeafs(data[i]).forEach((id) => {
        leafs[id] = i
      })
    }

    const treeIndex = leafs[id]

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
    return this.cacheAwareGet({ path: `/api/license/${id}` })
  }

  public async getUuid<T extends AbstractUuidPayload>({
    id,
  }: {
    id: number
  }): Promise<T | null> {
    const uuid = await this.cacheAwareGet<T>({ path: `/api/uuid/${id}` })
    return isUnsupportedUuid(uuid) ? null : uuid
  }

  public async getNotificationEvent<
    T extends AbstractNotificationEventPayload
  >({ id }: { id: number }): Promise<T | null> {
    const notificationEvent = await this.cacheAwareGet<T>({
      path: `/api/event/${id}`,
    })
    return isUnsupportedNotificationEvent(notificationEvent)
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
    })
    return {
      ...response,
      // Sometimes, Zend serializes an array as an object... This line ensures that we have an array.
      notifications: Object.values(response.notifications),
    }
  }

  public async setNotificationState(notificationState: {
    id: number
    userId: number
    unread: boolean
  }) {
    const response = await this.customPost<NotificationsPayload>({
      path: `/api/set-notification-state/${notificationState.id}`,
      body: {
        userId: notificationState.userId,
        unread: notificationState.unread,
      },
    })
    const cacheKey = this.getCacheKey(
      `/api/notifications/${notificationState.userId}`
    )
    await this.environment.cache.set(cacheKey, response)
  }

  private async customPost<
    T,
    K extends keyof SerloDataSource = keyof SerloDataSource
  >({
    path,
    instance = Instance.De,
    body,
  }: {
    path: string
    instance?: Instance
    // eslint-disable-next-line @typescript-eslint/ban-types
    body: object
  }): Promise<T> {
    const token = jwt.sign({}, process.env.SERLO_ORG_SECRET, {
      expiresIn: '2h',
      audience: Service.Serlo,
      issuer: 'api.serlo.org',
    })
    return await super.post(
      `http://${instance}.${process.env.SERLO_ORG_HOST}${path}`,
      body,
      {
        headers: {
          Authorization: `Serlo Service=${token}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
      }
    )
  }

  private async cacheAwareGet<
    T,
    K extends keyof SerloDataSource = keyof SerloDataSource
  >({
    path,
    instance = Instance.De,
    ttl,
  }: {
    path: string
    instance?: Instance
    ttl?: number
  }): Promise<T> {
    const cacheKey = this.getCacheKey(path, instance)
    const cache = await this.environment.cache.get<T>(cacheKey)
    if (isSome(cache)) return cache.value

    return this.updateCache({ path, instance, cacheKey, ttl })
  }

  private getCacheKey(path: string, instance: Instance = Instance.De) {
    return `${instance}.serlo.org${path}`
  }

  public async getAllCacheKeys(): Promise<string[]> {
    return this.cacheAwareGet<string[]>({ path: '/api/cache-keys' })
  }

  public async setCache<T>(key: string, value: T, options?: { ttl?: number }) {
    await this.environment.cache.set(key, value, options)
    return value
  }

  public async removeCache(key: string) {
    await this.environment.cache.remove(key)
  }

  public async updateCache<T>({
    path,
    instance,
    cacheKey,
    ttl,
  }: {
    path: string
    instance: string
    cacheKey: string
    ttl?: number
  }) {
    const token = jwt.sign({}, process.env.SERLO_ORG_SECRET, {
      expiresIn: '2h',
      audience: Service.Serlo,
      issuer: 'api.serlo.org',
    })
    const data = await super.get<T>(
      `http://${instance}.${process.env.SERLO_ORG_HOST}${path}`,
      {},
      {
        headers: {
          Authorization: `Serlo Service=${token}`,
        },
      }
    )
    return this.setCache(cacheKey, data, { ttl })
  }
}
