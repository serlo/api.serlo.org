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
import { gql } from 'apollo-server'

import { DateTime } from './date-time'
import { Instance } from './instance'
import { License, licenseResolvers } from './license'
import { Context, Resolver } from './types'
import { requestsOnlyFields } from './utils'

export const uuidTypeDefs = gql`
  extend type Query {
    uuid(alias: AliasInput, id: Int): Uuid
  }

  interface Uuid {
    id: Int!
    trashed: Boolean!
  }

  interface Entity {
    date: DateTime!
    instance: Instance!
    license: License!
    taxonomyTerms: [TaxonomyTerm]!
  }

  type Article implements Uuid & Entity {
    id: Int!
    trashed: Boolean!
    instance: Instance!
    date: DateTime!
    license: License!
    taxonomyTerms: [TaxonomyTerm]!
    currentRevision: ArticleRevision
  }

  interface EntityRevision {
    author: User!
    date: DateTime!
  }

  type ArticleRevision implements Uuid & EntityRevision {
    id: Int!
    author: User!
    trashed: Boolean!
    date: DateTime!
    title: String!
    content: String!
    changes: String!
    article: Article!
  }

  type Page implements Uuid {
    id: Int!
    trashed: Boolean!
    taxonomyTerms: [TaxonomyTerm]!
    currentRevision: PageRevision
  }

  type PageRevision implements Uuid {
    id: Int!
    author: User!
    trashed: Boolean!
    date: DateTime!
    title: String!
    content: String!
    page: Page!
  }

  type User implements Uuid {
    id: Int!
    trashed: Boolean!
    username: String!
    date: DateTime!
    lastLogin: DateTime
    description: String
  }

  type TaxonomyTerm implements Uuid {
    id: Int!
    trashed: Boolean!
    type: TaxonomyTermType!
    instance: Instance!
    name: String!
    description: String
    weight: Int!
    parent: TaxonomyTerm
    children: [Uuid]!
    path: [TaxonomyTerm]!
  }

  enum TaxonomyTermType {
    blog
    curriculum
    curriculumTopic
    curriculumTopicFolder
    forum
    forumCategory
    locale
    root
    subject
    topic
    topicFolder
  }

  input AliasInput {
    instance: Instance!
    path: String!
  }
`

export const uuidResolvers: {
  Query: {
    uuid: Resolver<
      undefined,
      {
        alias?: AliasInput
        id?: number
      },
      Uuid
    >
  }
  Uuid: {
    __resolveType(uuid: Uuid): UuidType
  }
  Entity: {
    __resolveType(entity: Entity): EntityType
  }
  Article: {
    currentRevision: Resolver<Article, {}, Partial<ArticleRevision> | null>
    license: Resolver<Entity, {}, Partial<License>>
    taxonomyTerms: Resolver<Article, {}, TaxonomyTerm[]>
  }
  EntityRevision: {
    __resolveType(entity: EntityRevision): EntityRevisionType
  }
  ArticleRevision: {
    author: Resolver<ArticleRevision, {}, Partial<User>>
    article: Resolver<ArticleRevision, {}, Partial<Article>>
  }
  Page: {
    currentRevision: Resolver<Page, {}, Partial<PageRevision> | null>
    taxonomyTerms: Resolver<Page, {}, TaxonomyTerm[]>
  }
  PageRevision: {
    author: Resolver<PageRevision, {}, Partial<User>>
    page: Resolver<PageRevision, {}, Partial<Page>>
  }
  TaxonomyTerm: {
    parent: Resolver<TaxonomyTerm, {}, Partial<TaxonomyTerm> | null>
    children: Resolver<TaxonomyTerm, {}, Uuid[]>
    path: Resolver<TaxonomyTerm, {}, Partial<TaxonomyTerm>[]>
  }
} = {
  Query: {
    uuid,
  },
  Uuid: {
    __resolveType(uuid) {
      return uuid.__typename
    },
  },
  Entity: {
    __resolveType(entity) {
      return entity.__typename
    },
  },
  Article: {
    async currentRevision(entity, _args, context, info) {
      if (!entity.currentRevisionId) return null
      const partialCurrentRevision = { id: entity.currentRevisionId }
      if (requestsOnlyFields('ArticleRevision', ['id'], info)) {
        return partialCurrentRevision
      }
      return uuid(undefined, partialCurrentRevision, context)
    },
    async license(entity, _args, context, info) {
      const partialLicense = { id: entity.licenseId }
      if (requestsOnlyFields('License', ['id'], info)) {
        return partialLicense
      }
      return licenseResolvers.Query.license(
        undefined,
        partialLicense,
        context,
        info
      )
    },
    async taxonomyTerms(entity, _args, context) {
      return Promise.all(
        entity.taxonomyTermIds.map((id) => {
          return uuid(undefined, { id }, context) as Promise<TaxonomyTerm>
        })
      )
    },
  },
  EntityRevision: {
    __resolveType(entityRevision) {
      return entityRevision.__typename
    },
  },
  ArticleRevision: {
    async author(articleRevision, _args, context, info) {
      const partialUser = { id: articleRevision.authorId }
      if (requestsOnlyFields('User', ['id'], info)) {
        return partialUser
      }
      return uuid(undefined, partialUser, context)
    },
    async article(articleRevision, _args, context, info) {
      const partialArticle = { id: articleRevision.repositoryId }
      if (requestsOnlyFields('Article', ['id'], info)) {
        return partialArticle
      }
      return uuid(undefined, partialArticle, context)
    },
  },
  Page: {
    async currentRevision(page, _args, context, info) {
      if (!page.currentRevisionId) return null
      const partialCurrentRevision = { id: page.currentRevisionId }
      if (requestsOnlyFields('PageRevision', ['id'], info)) {
        return partialCurrentRevision
      }
      return uuid(undefined, partialCurrentRevision, context)
    },
    async taxonomyTerms(page, _args, context) {
      return Promise.all(
        page.taxonomyTermIds.map((id) => {
          return uuid(undefined, { id }, context) as Promise<TaxonomyTerm>
        })
      )
    },
  },
  PageRevision: {
    async author(pageRevision, _args, context, info) {
      const partialUser = { id: pageRevision.authorId }
      if (requestsOnlyFields('User', ['id'], info)) {
        return partialUser
      }
      return uuid(undefined, partialUser, context)
    },
    async page(pageRevision, _args, context, info) {
      const partialPage = { id: pageRevision.repositoryId }
      if (requestsOnlyFields('Page', ['id'], info)) {
        return partialPage
      }
      return uuid(undefined, partialPage, context)
    },
  },
  TaxonomyTerm: {
    async parent(taxonomyTerm, _args, context, info) {
      if (!taxonomyTerm.parentId) return null
      const partialParent = { id: taxonomyTerm.parentId }
      if (requestsOnlyFields('TaxonomyTerm', ['id'], info)) {
        return partialParent
      }
      return uuid(undefined, partialParent, context)
    },
    async children(taxonomyTerm, _args, context) {
      return Promise.all(
        taxonomyTerm.childrenIds.map((childrenId) => {
          return uuid(undefined, { id: childrenId }, context) as Promise<Uuid>
        })
      )
    },
    async path(taxonomyTerm, _args, context) {
      const path = [taxonomyTerm]
      let current = taxonomyTerm

      while (current.parentId !== null) {
        current = (await uuid(
          undefined,
          { id: current.parentId },
          context
        )) as TaxonomyTerm
        path.unshift(current)
      }

      return path
    },
  },
}

enum EntityType {
  Article = 'Article',
}

enum EntityRevisionType {
  ArticleRevision = 'ArticleRevision',
}

enum DiscriminatorType {
  Page = 'Page',
  PageRevision = 'PageRevision',
  User = 'User',
  TaxonomyTerm = 'TaxonomyTerm',
}

enum TaxonomyTermType {
  Blog = 'blog',
  Curriculum = 'curriculum',
  CurriculumTopic = 'curriculumTopic',
  CurriculumTopicFolder = 'curriculumTopicFolder',
  Forum = 'forum',
  ForumCategory = 'forumCategory',
  Locale = 'locale',
  Root = 'root',
  Subject = 'subject',
  Topic = 'topic',
  TopicFolder = 'topicFolder',
}

type UuidType = DiscriminatorType | EntityType | EntityRevisionType

abstract class Uuid {
  public abstract __typename: UuidType
  public id: number
  public trashed: boolean

  public constructor(payload: { id: number; trashed: boolean }) {
    this.id = payload.id
    this.trashed = payload.trashed
  }
}

abstract class Entity extends Uuid {
  public abstract __typename: EntityType
  public instance: Instance
  public date: string
  public licenseId: number
  public taxonomyTermIds: number[]
  public currentRevisionId?: number

  public constructor(payload: {
    id: number
    trashed: boolean
    date: DateTime
    instance: Instance
    licenseId: number
    taxonomyTermIds: number[]
    currentRevisionId?: number
  }) {
    super(payload)
    this.instance = payload.instance
    this.date = payload.date
    this.licenseId = payload.licenseId
    this.taxonomyTermIds = payload.taxonomyTermIds
    this.currentRevisionId = payload.currentRevisionId
  }
}

class Article extends Entity {
  public __typename = EntityType.Article
}

abstract class EntityRevision extends Uuid {
  public abstract __typename: EntityRevisionType
  public date: string
  public authorId: number
  public repositoryId: number

  public constructor(payload: {
    id: number
    date: DateTime
    trashed: boolean
    authorId: number
    repositoryId: number
  }) {
    super(payload)
    this.date = payload.date
    this.authorId = payload.authorId
    this.repositoryId = payload.repositoryId
  }
}

class ArticleRevision extends EntityRevision {
  public __typename = EntityRevisionType.ArticleRevision
  public title: string
  public content: string
  public changes: string

  public constructor(payload: {
    id: number
    date: DateTime
    trashed: boolean
    authorId: number
    repositoryId: number
    title: string
    content: string
    changes: string
  }) {
    super(payload)
    this.title = payload.title
    this.content = payload.content
    this.changes = payload.changes
  }
}

class Page extends Uuid {
  public __typename = DiscriminatorType.Page
  public taxonomyTermIds: number[]
  public currentRevisionId?: number

  public constructor(payload: {
    id: number
    trashed: boolean
    taxonomyTermIds: number[]
    currentRevisionId?: number
  }) {
    super(payload)
    this.taxonomyTermIds = payload.taxonomyTermIds
    this.currentRevisionId = payload.currentRevisionId
  }
}

class PageRevision extends Uuid {
  public __typename = DiscriminatorType.PageRevision
  public title: string
  public content: string
  public date: DateTime
  public authorId: number
  public repositoryId: number

  public constructor(payload: {
    id: number
    trashed: boolean
    date: DateTime
    title: string
    content: string
    authorId: number
    repositoryId: number
  }) {
    super(payload)
    this.title = payload.title
    this.content = payload.content
    this.date = payload.date
    this.authorId = payload.authorId
    this.repositoryId = payload.repositoryId
  }
}

class User extends Uuid {
  public __typename = DiscriminatorType.User
  public username: string
  public date: DateTime
  public lastLogin?: DateTime
  public description?: string

  public constructor(payload: {
    id: number
    trashed: boolean
    username: string
    date: DateTime
    lastLogin?: DateTime
    description?: string
  }) {
    super(payload)
    this.username = payload.username
    this.date = payload.date
    this.lastLogin = payload.lastLogin
    this.description = payload.description
  }
}

class TaxonomyTerm extends Uuid {
  public __typename = DiscriminatorType.TaxonomyTerm
  public type: TaxonomyTermType
  public instance: Instance
  public name: string
  public description?: string
  public weight: number
  public parentId?: number
  public childrenIds: number[]

  public constructor(payload: {
    id: number
    type: string
    trashed: boolean
    instance: Instance
    name: string
    description?: string
    weight: number
    parentId?: number
    childrenIds: number[]
  }) {
    super(payload)
    this.type = toCamelCase(payload.type)
    this.instance = payload.instance
    this.name = payload.name
    this.description = payload.description
    this.weight = payload.weight
    this.parentId = payload.parentId
    this.childrenIds = payload.childrenIds

    function toCamelCase(type: string) {
      const segments = type.split('-')
      const [firstSegment, ...remainingSegments] = segments
      return [
        firstSegment,
        remainingSegments.map((segment) => {
          return `${segment[0].toUpperCase()}${segment.substr(1)}`
        }),
      ].join('') as TaxonomyTermType
    }
  }
}

interface AliasInput {
  instance: Instance
  path: string
}

async function uuid(
  _parent: unknown,
  args: { id?: number; alias?: AliasInput },
  { dataSources }: Context
) {
  const id = args.alias
    ? (await dataSources.serlo.getAlias(args.alias)).id
    : (args.id as number)
  const data = await dataSources.serlo.getUuid(id)

  switch (data.discriminator) {
    case 'entity':
      switch (data.type) {
        case 'article':
          return new Article(data)
      }
      break
    case 'entityRevision':
      switch (data.type) {
        case 'article':
          return new ArticleRevision({ ...data, ...data.fields })
      }
      break
    case 'page':
      return new Page(data)
    case 'pageRevision':
      return new PageRevision(data)
    case 'user':
      return new User(data)
    case 'taxonomyTerm':
      return new TaxonomyTerm(data)
  }
}
