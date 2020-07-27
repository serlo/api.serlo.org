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
import { License, Page, PageRevision } from '../../../../types'
import { Resolver } from '../../types'
import { NavigationChildResolvers } from '../abstract-navigation-child'
import { DiscriminatorType } from '../abstract-uuid'
import { UserPreResolver } from '../user'

export interface PagePreResolver
  extends Omit<Page, keyof PageResolvers['Page']> {
  __typename: DiscriminatorType.Page
  alias: string | null
  currentRevisionId: number | null
  licenseId: number
}

export type PagePayload = PagePreResolver

export interface PageRevisionPreResolver
  extends Omit<PageRevision, keyof PageResolvers['PageRevision']> {
  __typename: DiscriminatorType.PageRevision
  authorId: number
  repositoryId: number
}

export type PageRevisionPayload = PageRevisionPreResolver

export interface PageResolvers {
  Page: {
    alias: Resolver<PagePreResolver, never, string | null>
    currentRevision: Resolver<
      PagePreResolver,
      never,
      Partial<PageRevisionPreResolver> | null
    >
    license: Resolver<PagePreResolver, never, Partial<License>>
  } & NavigationChildResolvers<PagePreResolver>
  PageRevision: {
    author: Resolver<PageRevisionPreResolver, never, Partial<UserPreResolver>>
    page: Resolver<PageRevisionPreResolver, never, Partial<PagePreResolver>>
  }
}
