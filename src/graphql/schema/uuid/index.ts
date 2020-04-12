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
import { DocumentNode } from 'graphql'

import { combineResolvers } from '../utils'
import {
  abstractEntityResolvers,
  abstractEntityTypeDefs,
} from './abstract-entity'
import {
  abstractEntityRevisionResolvers,
  abstractEntityRevisionTypeDefs,
} from './abstract-entity-revision'
import {
  abstractUuidTypeDefs,
  abstractUuidResolvers,
  UnsupportedUuid,
} from './abstract-uuid'
import { aliasResolvers, aliasTypeDefs } from './alias'
import {
  Article,
  articleResolvers,
  ArticleRevision,
  articleTypeDefs,
} from './article'
import { Page, pageResolvers, PageRevision, pageTypeDefs } from './page'
import {
  TaxonomyTerm,
  taxonomyTermResolvers,
  taxonomyTermTypeDefs,
} from './taxonomy-term'
import { User, userResolvers, userTypeDefs } from './user'

export * from './abstract-entity'
export * from './abstract-entity-revision'
export * from './abstract-uuid'
export * from './alias'
export * from './article'
export * from './page'
export * from './taxonomy-term'
export * from './user'

export const uuidTypeDefs: DocumentNode[] = [
  ...abstractEntityTypeDefs.typeDefs,
  ...abstractEntityRevisionTypeDefs.typeDefs,
  ...abstractUuidTypeDefs.typeDefs,
  ...aliasTypeDefs.typeDefs,
  ...articleTypeDefs.typeDefs,
  ...pageTypeDefs.typeDefs,
  ...taxonomyTermTypeDefs.typeDefs,
  ...userTypeDefs.typeDefs,
]

export const uuidResolvers = combineResolvers(
  abstractEntityResolvers.resolvers,
  abstractEntityRevisionResolvers.resolvers,
  abstractUuidResolvers.resolvers,
  aliasResolvers.resolvers,
  articleResolvers.resolvers,
  pageResolvers.resolvers,
  taxonomyTermResolvers.resolvers,
  userResolvers.resolvers
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveAbstractUuid(data?: any) {
  if (!data) return null

  switch (data.discriminator) {
    case 'entity':
      switch (data.type) {
        case 'article':
          return new Article(data)
        default:
          return new UnsupportedUuid(data)
      }
    case 'entityRevision':
      switch (data.type) {
        case 'article':
          return new ArticleRevision(data)
        default:
          return new UnsupportedUuid(data)
      }
    case 'page':
      return new Page(data)
    case 'pageRevision':
      return new PageRevision(data)
    case 'user':
      return new User(data)
    case 'taxonomyTerm':
      return new TaxonomyTerm(data)
    default:
      return new UnsupportedUuid(data)
  }
}
