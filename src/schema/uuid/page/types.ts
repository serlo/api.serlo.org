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
import { Page, PageRevision } from '../../../types'
import { NavigationChildResolvers } from '~/schema/uuid/abstract-navigation-child/utils'
import {
  RepositoryResolvers,
  RevisionResolvers,
} from '~/schema/uuid/abstract-repository/types'
import {
  DiscriminatorType,
  UuidResolvers,
} from '~/schema/uuid/abstract-uuid/types'

export interface PagePayload extends Omit<Page, keyof PageResolvers['Page']> {
  __typename: DiscriminatorType.Page
  alias: string
  currentRevisionId: number | null
  revisionIds: number[]
  licenseId: number
}

export interface PageRevisionPayload
  extends Omit<PageRevision, keyof PageResolvers['PageRevision']> {
  __typename: DiscriminatorType.PageRevision
  alias: string
  authorId: number
  repositoryId: number
}

export interface PageResolvers {
  Page: RepositoryResolvers<PagePayload, PageRevisionPayload> &
    NavigationChildResolvers<PagePayload> &
    UuidResolvers
  PageRevision: RevisionResolvers<PagePayload, PageRevisionPayload> &
    UuidResolvers
}
