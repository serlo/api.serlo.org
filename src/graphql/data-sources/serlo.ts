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
import jwt from 'jsonwebtoken'
import * as R from 'ramda'

import { Environment } from '../environment'
import { Instance } from '../schema/instance'
import { License } from '../schema/license'
import { Service } from '../schema/types'
import {
  AliasPayload,
  ArticlePayload,
  ArticleRevisionPayload,
  ExercisePayload,
  ExerciseRevisionPayload,
  ExerciseGroupPayload,
  ExerciseGroupRevisionPayload,
  GroupedExercisePayload,
  GroupedExerciseRevisionPayload,
  SolutionPayload,
  SolutionRevisionPayload,
  PagePayload,
  PageRevisionPayload,
  TaxonomyTermPayload,
  UserPayload,
  AppletPayload,
  AppletRevisionPayload,
  EventPayload,
  EventRevisionPayload,
  VideoPayload,
  VideoRevisionPayload,
  CoursePayload,
  CourseRevisionPayload,
  CoursePagePayload,
  CoursePageRevisionPayload,
  UuidPayload,
} from '../schema/uuid'
import { Navigation, NavigationPayload } from '../schema/uuid/navigation'

export class SerloDataSource extends RESTDataSource {
  public constructor(private environment: Environment) {
    super()
  }

  public async getAlias({
    path,
    instance,
    bypassCache = false,
  }: {
    path: string
    instance: Instance
    bypassCache?: boolean
  }) {
    return this.cacheAwareGet({
      path: `/api/alias${path}`,
      instance,
      bypassCache,
      setter: 'setAlias',
    })
  }

  public async setAlias(alias: AliasPayload) {
    const cacheKey = this.getCacheKey(`/api/alias${alias.path}`, alias.instance)
    await this.environment.cache.set(cacheKey, JSON.stringify(alias))
    return alias
  }

  public async getNavigation({
    instance,
    id,
  }: {
    instance: Instance
    id: number
  }): Promise<Navigation | null> {
    const foo = await this.cacheAwareGet({
      path: `/api/navigation`,
      instance,
      setter: 'setNavigation',
    })
    const { data, leafs } = foo

    const treeIndex = leafs[id]

    if (treeIndex === undefined) return null

    const nodes = findPathToLeaf(data[treeIndex], id)
    const path = []

    for (let i = 0; i < nodes.length; i++) {
      const nodeData = nodes[i]
      const uuid = nodeData.id ? await this.getUuid({ id: nodeData.id }) : null
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

    interface NodeData {
      label: string
      id?: number
      url?: string
      children?: NodeData[]
    }

    function findPathToLeaf(node: NodeData, leaf: number): NodeData[] {
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
  }

  public async setNavigation(payload: NavigationPayload) {
    const data: N[] = JSON.parse(payload.data)

    const leafs: Record<string, number> = {}
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
    await this.environment.cache.set(cacheKey, JSON.stringify(value))
    return value

    function findLeafs(node: N): number[] {
      return [
        ...(node.id ? [node.id] : []),
        ...R.flatten(R.map(findLeafs, node.children || [])),
      ]
    }

    interface N {
      label: string
      id?: number
      url?: string
      children?: N[]
    }
  }

  public async getLicense({
    id,
    bypassCache = false,
  }: {
    id: number
    bypassCache?: boolean
  }) {
    return this.cacheAwareGet({
      path: `/api/license/${id}`,
      bypassCache,
      setter: 'setLicense',
    })
  }

  public async setLicense(license: License) {
    const cacheKey = this.getCacheKey(`/api/license/${license.id}`)
    await this.environment.cache.set(cacheKey, JSON.stringify(license))
    return license
  }

  public async removeLicense({ id }: { id: number }) {
    const cacheKey = this.getCacheKey(`/api/license/${id}`)
    await this.environment.cache.set(cacheKey, JSON.stringify(null))
  }

  public async getUuid({
    id,
    bypassCache = false,
  }: {
    id: number
    bypassCache?: boolean
  }) {
    return this.cacheAwareGet({
      path: `/api/uuid/${id}`,
      bypassCache,
      setter: 'setUuid',
    })
  }

  public async setUuid<T extends UuidPayload>(payload: T) {
    const cacheKey = this.getCacheKey(`/api/uuid/${payload.id}`)
    await this.environment.cache.set(cacheKey, JSON.stringify(payload))
    return payload
  }

  public async removeUuid({ id }: { id: number }) {
    const cacheKey = this.getCacheKey(`/api/uuid/${id}`)
    await this.environment.cache.set(cacheKey, JSON.stringify(null))
  }

  public async setApplet(applet: AppletPayload) {
    return this.setUuid({ ...applet, discriminator: 'entity', type: 'applet' })
  }

  public async setAppletRevision(appletRevision: AppletRevisionPayload) {
    return this.setUuid({
      ...appletRevision,
      discriminator: 'entityRevision',
      type: 'applet',
    })
  }

  public async setArticle(article: ArticlePayload) {
    return this.setUuid({
      ...article,
      discriminator: 'entity',
      type: 'article',
    })
  }

  public async setArticleRevision(articleRevision: ArticleRevisionPayload) {
    return this.setUuid({
      ...articleRevision,
      discriminator: 'entityRevision',
      type: 'article',
    })
  }

  public async setCourse(course: CoursePayload) {
    return this.setUuid({ ...course, discriminator: 'entity', type: 'course' })
  }

  public async setCourseRevision(courseRevision: CourseRevisionPayload) {
    return this.setUuid({
      ...courseRevision,
      discriminator: 'entityRevision',
      type: 'course',
    })
  }

  public async setCoursePage(coursePage: CoursePagePayload) {
    return this.setUuid({
      ...coursePage,
      discriminator: 'entity',
      type: 'coursePage',
    })
  }

  public async setCoursePageRevision(
    coursePageRevision: CoursePageRevisionPayload
  ) {
    return this.setUuid({
      ...coursePageRevision,
      discriminator: 'entityRevision',
      type: 'coursePage',
    })
  }

  public async setEvent(event: EventPayload) {
    return this.setUuid({ ...event, discriminator: 'entity', type: 'event' })
  }

  public async setEventRevision(eventRevision: EventRevisionPayload) {
    return this.setUuid({
      ...eventRevision,
      discriminator: 'entityRevision',
      type: 'event',
    })
  }

  public async setExercise(exercise: ExercisePayload) {
    return this.setUuid({
      ...exercise,
      discriminator: 'entity',
      type: 'exercise',
    })
  }

  public async setExerciseRevision(exerciseRevision: ExerciseRevisionPayload) {
    return this.setUuid({
      ...exerciseRevision,
      discriminator: 'entityRevision',
      type: 'exercise',
    })
  }

  public async setExerciseGroup(exerciseGroup: ExerciseGroupPayload) {
    return this.setUuid({
      ...exerciseGroup,
      discriminator: 'entity',
      type: 'exerciseGroup',
    })
  }

  public async setExerciseGroupRevision(
    exerciseGroupRevision: ExerciseGroupRevisionPayload
  ) {
    return this.setUuid({
      ...exerciseGroupRevision,
      discriminator: 'entityRevision',
      type: 'exerciseGroup',
    })
  }

  public async setGroupedExercise(groupedExercise: GroupedExercisePayload) {
    return this.setUuid({
      ...groupedExercise,
      discriminator: 'entity',
      type: 'groupedExercise',
    })
  }

  public async setGroupedExerciseRevision(
    groupedExerciseRevision: GroupedExerciseRevisionPayload
  ) {
    return this.setUuid({
      ...groupedExerciseRevision,
      discriminator: 'entityRevision',
      type: 'groupedExercise',
    })
  }

  public async setPage(page: PagePayload) {
    return this.setUuid({ ...page, discriminator: 'page' })
  }

  public async setPageRevision(pageRevision: PageRevisionPayload) {
    return this.setUuid({ ...pageRevision, discriminator: 'pageRevision' })
  }

  public async setSolution(solution: SolutionPayload) {
    return this.setUuid({
      ...solution,
      discriminator: 'entity',
      type: 'solution',
    })
  }

  public async setSolutionRevision(solutionRevision: SolutionRevisionPayload) {
    return this.setUuid({
      ...solutionRevision,
      discriminator: 'entityRevision',
      type: 'solution',
    })
  }

  public async setTaxonomyTerm(taxonomyTerm: TaxonomyTermPayload) {
    return this.setUuid({ ...taxonomyTerm, discriminator: 'taxonomyTerm' })
  }

  public async setUser(user: UserPayload) {
    return this.setUuid({ ...user, discriminator: 'user' })
  }

  public async setVideo(video: VideoPayload) {
    return this.setUuid({ ...video, discriminator: 'entity', type: 'video' })
  }

  public async setVideoRevision(videoRevision: VideoRevisionPayload) {
    return this.setUuid({
      ...videoRevision,
      discriminator: 'entityRevision',
      type: 'video',
    })
  }

  private async cacheAwareGet<K extends keyof SerloDataSource>({
    path,
    instance = Instance.De,
    bypassCache = false,
    setter,
  }: {
    path: string
    instance?: Instance
    bypassCache?: boolean
    setter: SerloDataSource[K]
  }) {
    const cacheKey = this.getCacheKey(path, instance)
    if (!bypassCache) {
      const cache = await this.environment.cache.get(cacheKey)
      if (cache) return JSON.parse(cache)
    }

    const token = jwt.sign({}, process.env.SERLO_ORG_SECRET!, {
      expiresIn: '2h',
      audience: Service.Serlo,
      issuer: 'api.serlo.org',
    })

    const data = await (process.env.NODE_ENV === 'test'
      ? super.get(`http://localhost:9009${path}`)
      : super.get(
          `http://${instance}.${process.env.SERLO_ORG_HOST}${path}`,
          {},
          {
            headers: {
              Authorization: `Serlo Service=${token}`,
            },
          }
        ))

    return await this[setter](data)
  }

  private getCacheKey(path: string, instance: Instance = Instance.De) {
    return `${instance}.serlo.org${path}`
  }
}
