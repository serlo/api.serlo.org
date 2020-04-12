import { ForbiddenError, gql } from 'apollo-server'

import { DateTime } from '../date-time'
import { Instance } from '../instance'
import { License, licenseResolvers } from '../license'
import { Service } from '../types'
import { requestsOnlyFields, Resolvers, TypeDefs } from '../utils'
import { Entity, EntityType } from './abstract-entity'
import { EntityRevision, EntityRevisionType } from './abstract-entity-revision'
import { TaxonomyTerm } from './taxonomy-term'
import { User } from './user'

export const articleResolvers = new Resolvers()
export const articleTypeDefs = new TypeDefs()

/**
 * type Article
 */
export class Article extends Entity {
  public __typename = EntityType.Article
}
articleResolvers.add<Article, unknown, Partial<ArticleRevision> | null>(
  'Article',
  'currentRevision',
  async (article, _args, { dataSources }, info) => {
    if (!article.currentRevisionId) return null
    const partialCurrentRevision = { id: article.currentRevisionId }
    if (requestsOnlyFields('ArticleRevision', ['id'], info)) {
      return partialCurrentRevision
    }
    const data = await dataSources.serlo.getUuid(partialCurrentRevision)
    return new ArticleRevision(data)
  }
)
articleResolvers.add<Article, unknown, Partial<License>>(
  'Article',
  'license',
  async (article, _args, context, info) => {
    const partialLicense = { id: article.licenseId }
    if (requestsOnlyFields('License', ['id'], info)) {
      return partialLicense
    }
    return licenseResolvers.resolvers.Query.license(
      undefined,
      partialLicense,
      context,
      info
    )
  }
)
articleResolvers.add<Article, unknown, TaxonomyTerm[]>(
  'Article',
  'taxonomyTerms',
  (entity, _args, { dataSources }) => {
    return Promise.all(
      entity.taxonomyTermIds.map((id: number) => {
        return dataSources.serlo.getUuid({ id }).then((data) => {
          return new TaxonomyTerm(data)
        })
      })
    )
  }
)
articleTypeDefs.add(gql`
  """
  Represents a Serlo.org article. An \`Article\` is a repository containing \`ArticleRevision\`s.
  """
  type Article implements Uuid & Entity {
    """
    The ID of the article
    """
    id: Int!
    """
    \`true\` iff the article has been trashed
    """
    trashed: Boolean!
    """
    The \`Instance\` the article is tied to
    """
    instance: Instance!
    """
    The current alias of the article
    """
    alias: String
    """
    The \`DateTime\` the article has been created
    """
    date: DateTime!
    """
    The \`License\` of the article
    """
    license: License!
    """
    The \`TaxonomyTerm\`s that the article has been associated with
    """
    taxonomyTerms: [TaxonomyTerm!]!
    """
    The \`ArticleRevision\` that is currently checked out
    """
    currentRevision: ArticleRevision
  }
`)

/**
 * type ArticleRevision
 */
export class ArticleRevision extends EntityRevision {
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
articleResolvers.add<ArticleRevision, unknown, Partial<User>>(
  'ArticleRevision',
  'author',
  async (articleRevision, _args, { dataSources }, info) => {
    const partialUser = { id: articleRevision.authorId }
    if (requestsOnlyFields('User', ['id'], info)) {
      return partialUser
    }
    const data = await dataSources.serlo.getUuid(partialUser)
    return new User(data)
  }
)
articleResolvers.add<ArticleRevision, unknown, Partial<Article>>(
  'ArticleRevision',
  'article',
  async (articleRevision, _args, { dataSources }, info) => {
    const partialArticle = { id: articleRevision.repositoryId }
    if (requestsOnlyFields('Article', ['id'], info)) {
      return partialArticle
    }
    const data = await dataSources.serlo.getUuid(partialArticle)
    return new Article(data)
  }
)
articleTypeDefs.add(gql`
  """
  Represents a Serlo.org article revision. An \`ArticleRevision\` has fields title, content and changes.
  """
  type ArticleRevision implements Uuid & EntityRevision {
    """
    The ID of the article revision
    """
    id: Int!
    """
    The \`User\` that created the entity revision
    """
    author: User!
    """
    \`true\` iff the article revision has been trashed
    """
    trashed: Boolean!
    """
    The \`DateTime\` the article revision has been created
    """
    date: DateTime!
    """
    The heading
    """
    title: String!
    """
    The content
    """
    content: String!
    """
    The changes submitted by the author
    """
    changes: String!
    """
    The \`Article\` the article revision is tied to
    """
    article: Article!
  }
`)

/**
 * mutation _setArticle
 */
articleResolvers.addMutation<unknown, ArticlePayload, null>(
  '_setArticle',
  (_parent, payload, { dataSources, service }) => {
    if (service !== Service.Serlo) {
      throw new ForbiddenError(
        `You do not have the permissions to set an article`
      )
    }
    return dataSources.serlo.setArticle(payload)
  }
)
export interface ArticlePayload {
  id: number
  trashed: boolean
  instance: Instance
  alias: string | null
  date: DateTime
  currentRevisionId: number | null
  licenseId: number
  taxonomyTermIds: number[]
}
articleTypeDefs.add(gql`
  extend type Mutation {
    """
    Inserts the given \`Article\` into the cache. May only be called by \`serlo.org\` when an article has been created or updated.
    """
    _setArticle(
      """
      The ID of the article
      """
      id: Int!
      """
      \`true\` iff the article has been trashed
      """
      trashed: Boolean!
      """
      The \`Instance\` the article is tied to
      """
      instance: Instance!
      """
      The current alias of the article
      """
      alias: String
      """
      The \`DateTime\` the article has been created
      """
      date: DateTime!
      """
      The ID of the current revision
      """
      currentRevisionId: Int
      """
      The ID of the license
      """
      licenseId: Int!
      """
      The IDs of \`TaxonomyTerm\`s that contain the article
      """
      taxonomyTermIds: [Int!]!
    ): Boolean
  }
`)

/**
 * mutation _setArticleRevision
 */
articleResolvers.addMutation<unknown, ArticleRevisionPayload, null>(
  '_setArticleRevision',
  (_parent, payload, { dataSources, service }) => {
    if (service !== Service.Serlo) {
      throw new ForbiddenError(
        `You do not have the permissions to set an article revision`
      )
    }
    return dataSources.serlo.setArticleRevision(payload)
  }
)
export interface ArticleRevisionPayload {
  id: number
  trashed: boolean
  date: DateTime
  authorId: number
  repositoryId: number
  title: string
  content: string
  changes: string
}
articleTypeDefs.add(gql`
  extend type Mutation {
    """
    Inserts the given \`ArticleRevision\` into the cache. May only be called by \`serlo.org\` when an article revision has been created.
    """
    _setArticleRevision(
      """
      The ID of the article revision
      """
      id: Int!
      """
      \`true\` iff the article revision has been trashed
      """
      trashed: Boolean!
      """
      The \`DateTime\` the article revision has been created
      """
      date: DateTime!
      """
      The ID of the \`User\` that created the revision
      """
      authorId: Int!
      """
      The ID of the \`Article\`
      """
      repositoryId: Int!
      """
      The value of the title field
      """
      title: String!
      """
      The value of the content field
      """
      content: String!
      """
      The value of the changes field
      """
      changes: String!
    ): Boolean
  }
`)
