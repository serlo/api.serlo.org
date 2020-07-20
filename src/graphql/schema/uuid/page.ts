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
import { Instance, License, Scalars } from '../../../types'
import { Context } from '../types'
import { requestsOnlyFields, Schema } from '../utils'
import {
  DiscriminatorType,
  AbstractUuidPreResolver,
  AbstractUuidPayload,
} from './abstract-uuid'
import { encodePath } from './alias'
import typeDefs from './page.graphql'
import { resolveUser, UserPreResolver, UserPayload } from './user'

export const pageSchema = new Schema({}, [typeDefs])

/**
 * type Page
 */
export class Page implements AbstractUuidPreResolver {
  public __typename = DiscriminatorType.Page
  public id: number
  public trashed: boolean
  public instance: Instance
  public alias: string | null
  public currentRevisionId: number | null
  public licenseId: number

  public constructor(payload: PagePayload) {
    this.id = payload.id
    this.trashed = payload.trashed
    this.instance = payload.instance
    this.alias = payload.alias ? encodePath(payload.alias) : null
    this.currentRevisionId = payload.currentRevisionId
    this.licenseId = payload.licenseId
  }

  public async navigation(_args: undefined, { dataSources }: Context) {
    return await dataSources.serlo.getNavigation({
      instance: this.instance,
      id: this.id,
    })
  }
}
pageSchema.addResolver<Page, unknown, Partial<PageRevision> | null>(
  'Page',
  'currentRevision',
  async (page, _args, { dataSources }, info) => {
    if (!page.currentRevisionId) return null
    const partialCurrentRevision = { id: page.currentRevisionId }
    if (requestsOnlyFields('PageRevision', ['id'], info)) {
      return partialCurrentRevision
    }
    const data = await dataSources.serlo.getUuid<PageRevisionPayload>(
      partialCurrentRevision
    )
    return new PageRevision(data)
  }
)
pageSchema.addResolver<Page, unknown, Partial<License>>(
  'Page',
  'license',
  async (page, _args, { dataSources }, info) => {
    const partialLicense = { id: page.licenseId }
    if (requestsOnlyFields('License', ['id'], info)) {
      return partialLicense
    }
    return dataSources.serlo.getLicense(partialLicense)
  }
)

/**
 * type PageRevision
 */
export class PageRevision implements AbstractUuidPreResolver {
  public __typename = DiscriminatorType.PageRevision
  public id: number
  public trashed: boolean
  public title: string
  public content: string
  public date: Scalars['DateTime']
  public authorId: number
  public repositoryId: number

  public constructor(payload: PageRevisionPayload) {
    this.id = payload.id
    this.trashed = payload.trashed
    this.title = payload.title
    this.content = payload.content
    this.date = payload.date
    this.authorId = payload.authorId
    this.repositoryId = payload.repositoryId
  }
}
pageSchema.addResolver<PageRevision, unknown, Partial<UserPreResolver>>(
  'PageRevision',
  'author',
  async (pageRevision, _args, { dataSources }, info) => {
    const partialUser = { id: pageRevision.authorId }
    if (requestsOnlyFields('User', ['id'], info)) {
      return partialUser
    }
    const data = await dataSources.serlo.getUuid<UserPayload>(partialUser)
    return resolveUser(data)
  }
)
pageSchema.addResolver<PageRevision, unknown, Partial<Page>>(
  'PageRevision',
  'page',
  async (pageRevision, _args, { dataSources }, info) => {
    const partialPage = { id: pageRevision.repositoryId }
    if (requestsOnlyFields('Page', ['id'], info)) {
      return partialPage
    }
    const data = await dataSources.serlo.getUuid<PagePayload>(partialPage)
    return new Page(data)
  }
)

export interface PagePayload extends AbstractUuidPayload {
  __typename: DiscriminatorType.Page
  instance: Instance
  alias: string | null
  currentRevisionId: number | null
  licenseId: number
}

export interface PageRevisionPayload extends AbstractUuidPayload {
  __typename: DiscriminatorType.PageRevision
  title: string
  content: string
  date: Scalars['DateTime']
  authorId: number
  repositoryId: number
}
