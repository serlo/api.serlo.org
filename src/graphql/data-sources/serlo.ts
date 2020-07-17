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

import {
  Instance,
  License,
  Mutation_SetNotificationEventArgs,
  Mutation_SetNotificationsArgs,
  Mutation_SetTaxonomyTermArgs,
  Mutation_SetUserArgs,
} from '../../types'
import { Environment } from '../environment'
import {
  NotificationEventPayload,
  NotificationsPayload,
} from '../schema/notification'
import { Service } from '../schema/types'
import {
  AbstractUuidPayload,
  AliasPayload,
  AppletPayload,
  AppletRevisionPayload,
  ArticlePayload,
  ArticleRevisionPayload,
  CoursePagePayload,
  CoursePageRevisionPayload,
  CoursePayload,
  CourseRevisionPayload,
  decodePath,
  DiscriminatorType,
  encodePath,
  EntityPayload,
  EntityRevisionType,
  EntityType,
  EventPayload,
  EventRevisionPayload,
  ExerciseGroupPayload,
  ExerciseGroupRevisionPayload,
  ExercisePayload,
  ExerciseRevisionPayload,
  GroupedExercisePayload,
  GroupedExerciseRevisionPayload,
  PagePayload,
  PageRevisionPayload,
  SolutionPayload,
  SolutionRevisionPayload,
  VideoPayload,
  VideoRevisionPayload,
} from '../schema/uuid'
import { Navigation, NavigationPayload } from '../schema/uuid/navigation'

export class SerloDataSource extends RESTDataSource {
  public constructor(private environment: Environment) {
    super()
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
      setter: 'setAlias',
    })
  }

  public async setAlias(alias: AliasPayload) {
    const cacheKey = this.getCacheKey(`/api/alias${alias.path}`, alias.instance)
    await this.environment.cache.set(cacheKey, alias)
    return alias
  }

  public async getNavigation({
    instance,
    id,
  }: {
    instance: Instance
    id: number
  }): Promise<Navigation | null> {
    const { data, leafs } = await this.cacheAwareGet<{
      data: NodeData[]
      leafs: Record<string, number>
    }>({
      path: `/api/navigation`,
      instance,
      setter: 'setNavigation',
    })
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
      data: JSON.stringify(data[treeIndex]),
      path,
    }
  }

  public async setNavigation(
    payload: NavigationPayload
  ): Promise<{
    data: NodeData[]
    leafs: Record<string, number>
  }> {
    const data = JSON.parse(payload.data) as NodeData[]

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

    const value = {
      data,
      leafs,
    }

    const cacheKey = this.getCacheKey(`/api/navigation`, payload.instance)
    await this.environment.cache.set(cacheKey, value)
    return value
  }

  public async getLicense({ id }: { id: number }): Promise<License> {
    return this.cacheAwareGet({
      path: `/api/license/${id}`,
      setter: 'setLicense',
    })
  }

  public async setLicense(license: License) {
    const cacheKey = this.getCacheKey(`/api/license/${license.id}`)
    await this.environment.cache.set(cacheKey, license)
    return license
  }

  public async removeLicense({ id }: { id: number }) {
    const cacheKey = this.getCacheKey(`/api/license/${id}`)
    await this.environment.cache.set(cacheKey, null)
  }

  public async getUuid<T extends AbstractUuidPayload>({
    id,
  }: {
    id: number
  }): Promise<T> {
    return this.cacheAwareGet<T>({
      path: `/api/uuid/${id}`,
      setter: 'setUuid',
    })
  }

  public async setUuid<T extends AbstractUuidPayload>(payload: T): Promise<T> {
    const cacheKey = this.getCacheKey(`/api/uuid/${payload.id}`)
    await this.environment.cache.set(cacheKey, payload)
    return payload
  }

  public async removeUuid({ id }: { id: number }) {
    const cacheKey = this.getCacheKey(`/api/uuid/${id}`)
    await this.environment.cache.set(cacheKey, null)
  }

  public async setApplet(applet: AppletPayload) {
    return this.setUuid({ ...applet, __typename: EntityType.Applet })
  }

  public async setAppletRevision(appletRevision: AppletRevisionPayload) {
    return this.setUuid({
      ...appletRevision,
      __typename: EntityRevisionType.AppletRevision,
    })
  }

  public async setArticle(article: ArticlePayload) {
    return this.setUuid({
      ...article,
      __typename: EntityType.Article,
    })
  }

  public async setArticleRevision(articleRevision: ArticleRevisionPayload) {
    return this.setUuid({
      ...articleRevision,
      __typename: EntityRevisionType.ArticleRevision,
    })
  }

  public async setCourse(course: CoursePayload) {
    return this.setUuid({ ...course, __typename: EntityType.Course })
  }

  public async setCourseRevision(courseRevision: CourseRevisionPayload) {
    return this.setUuid({
      ...courseRevision,
      __typename: EntityRevisionType.CourseRevision,
    })
  }

  public async setCoursePage(coursePage: CoursePagePayload) {
    return this.setUuid({
      ...coursePage,
      __typename: EntityType.CoursePage,
    })
  }

  public async setCoursePageRevision(
    coursePageRevision: CoursePageRevisionPayload
  ) {
    return this.setUuid({
      ...coursePageRevision,
      __typename: EntityRevisionType.CoursePageRevision,
    })
  }

  public async setEvent(event: EventPayload) {
    return this.setUuid({ ...event, __typename: EntityType.Event })
  }

  public async setEventRevision(eventRevision: EventRevisionPayload) {
    return this.setUuid({
      ...eventRevision,
      __typename: EntityRevisionType.EventRevision,
    })
  }

  public async setExercise(exercise: ExercisePayload) {
    return this.setUuid({
      ...exercise,
      __typename: EntityType.Exercise,
    })
  }

  public async setExerciseRevision(exerciseRevision: ExerciseRevisionPayload) {
    return this.setUuid({
      ...exerciseRevision,
      __typename: EntityRevisionType.ExerciseRevision,
    })
  }

  public async setExerciseGroup(exerciseGroup: ExerciseGroupPayload) {
    return this.setUuid({
      ...exerciseGroup,
      __typename: EntityType.ExerciseGroup,
    })
  }

  public async setExerciseGroupRevision(
    exerciseGroupRevision: ExerciseGroupRevisionPayload
  ) {
    return this.setUuid({
      ...exerciseGroupRevision,
      __typename: EntityRevisionType.ExerciseGroupRevision,
    })
  }

  public async setGroupedExercise(groupedExercise: GroupedExercisePayload) {
    return this.setUuid({
      ...groupedExercise,
      __typename: EntityType.GroupedExercise,
    })
  }

  public async setGroupedExerciseRevision(
    groupedExerciseRevision: GroupedExerciseRevisionPayload
  ) {
    return this.setUuid({
      ...groupedExerciseRevision,
      __typename: EntityRevisionType.GroupedExerciseRevision,
    })
  }

  public async setPage(page: PagePayload) {
    return this.setUuid({ ...page, __typename: DiscriminatorType.Page })
  }

  public async setPageRevision(pageRevision: PageRevisionPayload) {
    return this.setUuid({
      ...pageRevision,
      __typename: DiscriminatorType.PageRevision,
    })
  }

  public async setSolution(solution: SolutionPayload) {
    return this.setUuid({
      ...solution,
      __typename: EntityType.Solution,
    })
  }

  public async setSolutionRevision(solutionRevision: SolutionRevisionPayload) {
    return this.setUuid({
      ...solutionRevision,
      __typename: EntityRevisionType.SolutionRevision,
    })
  }

  public async setTaxonomyTerm(taxonomyTerm: Mutation_SetTaxonomyTermArgs) {
    return this.setUuid({
      ...taxonomyTerm,
      __typename: DiscriminatorType.TaxonomyTerm,
    })
  }

  public async setUser(user: Mutation_SetUserArgs) {
    return this.setUuid({ ...user, __typename: DiscriminatorType.User })
  }

  public async setVideo(video: VideoPayload) {
    return this.setUuid({ ...video, __typename: EntityType.Video })
  }

  public async setVideoRevision(videoRevision: VideoRevisionPayload) {
    return this.setUuid({
      ...videoRevision,
      __typename: EntityRevisionType.VideoRevision,
    })
  }

  public async getNotificationEvent({
    id,
  }: {
    id: number
  }): Promise<NotificationEventPayload> {
    return this.cacheAwareGet({
      path: `/api/event/${id}`,
      setter: 'setNotificationEvent',
    })
  }

  public async setNotificationEvent(event: Mutation_SetNotificationEventArgs) {
    const cacheKey = this.getCacheKey(`/api/event/${event.id}`)
    await this.environment.cache.set(cacheKey, event)
    return event
  }

  public async getNotifications({
    id,
  }: {
    id: number
    bypassCache?: boolean
  }): Promise<NotificationsPayload> {
    const response = await this.cacheAwareGet<NotificationsPayload>({
      path: `/api/notifications/${id}`,
      setter: 'setNotifications',
    })
    return {
      ...response,
      // Sometimes, Zend serializes an array as an object... This line ensures that we have an array.
      notifications: Object.values(response.notifications),
    }
  }

  public async setNotifications(notifications: Mutation_SetNotificationsArgs) {
    const cacheKey = this.getCacheKey(
      `/api/notifications/${notifications.userId}`
    )
    await this.environment.cache.set(cacheKey, notifications)
    return notifications
  }

  public async setNotificationState(notificationState: {
    id: number
    userId: number
    unread: boolean
  }) {
    const body = {
      userId: notificationState.userId,
      unread: notificationState.unread,
    }
    await this.customPost({
      path: `/api/set-notification-state/${notificationState.id}`,
      body,
    })
    const { notifications } = await this.getNotifications({
      id: notificationState.userId,
    })
    const modifiedNotifications = notifications.map((notification) => {
      if (notification.id === notificationState.id) {
        return { ...notification, unread: notificationState.unread }
      }
      return notification
    })
    await this.setNotifications({
      notifications: modifiedNotifications,
      userId: notificationState.userId,
    })
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
    setter,
  }: {
    path: string
    instance?: Instance
    setter: SerloDataSource[K]
  }): Promise<T> {
    const cacheKey = this.getCacheKey(path, instance)
    const cache = await this.environment.cache.get<T>(cacheKey)
    if (isSome(cache)) return cache.value

    const token = jwt.sign({}, process.env.SERLO_ORG_SECRET, {
      expiresIn: '2h',
      audience: Service.Serlo,
      issuer: 'api.serlo.org',
    })
    const data = (await super.get(
      `http://${instance}.${process.env.SERLO_ORG_HOST}${path}`,
      {},
      {
        headers: {
          Authorization: `Serlo Service=${token}`,
        },
      }
    )) as unknown
    return await (this[setter] as (data: unknown) => Promise<T>)(data)
  }

  private getCacheKey(path: string, instance: Instance = Instance.De) {
    return `${instance}.serlo.org${path}`
  }

  public async setCache(key: string, value: string) {
    await this.environment.cache.set(key, value)
    return value
  }

  public async removeCache(key: string) {
    await this.environment.cache.set(key, null)
  }
}

interface NodeData {
  label: string
  id?: number
  url?: string
  children?: NodeData[]
}
