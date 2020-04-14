import { Schema } from '../utils'
import {
  addEntityResolvers,
  EntityPayload,
  EntityType,
  EntityRevision,
  EntityRevisionPayload,
  EntityRevisionType,
} from './abstract-entity'
import { TaxonomyTermChild } from './abstract-taxonomy-term-child'
import { TaxonomyTerm } from './taxonomy-term'

export const articleSchema = new Schema()

/**
 * type Article
 */
export class Article extends TaxonomyTermChild {
  public __typename = EntityType.Article
}
export interface ArticlePayload extends EntityPayload {
  taxonomyTermIds: number[]
}
articleSchema.addResolver<Article, unknown, TaxonomyTerm[]>(
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

export class ArticleRevision extends EntityRevision {
  public __typename = EntityRevisionType.ArticleRevision
  public title: string
  public content: string
  public changes: string

  public constructor(payload: ArticleRevisionPayload) {
    super(payload)
    this.title = payload.title
    this.content = payload.content
    this.changes = payload.changes
  }
}

export interface ArticleRevisionPayload extends EntityRevisionPayload {
  title: string
  content: string
  changes: string
}

addEntityResolvers({
  schema: articleSchema,
  entityType: EntityType.Article,
  entityRevisionType: EntityRevisionType.ArticleRevision,
  repository: 'article',
  Entity: Article,
  EntityRevision: ArticleRevision,
  entityFields: `
    taxonomyTerms: [TaxonomyTerm!]!
  `,
  entityPayloadFields: `
    taxonomyTermIds: [Int!]!
  `,
  entityRevisionFields: `
    title: String!
    content: String!
    changes: String!
  `,
  entitySetter: 'setArticle',
  entityRevisionSetter: 'setArticleRevision',
})
