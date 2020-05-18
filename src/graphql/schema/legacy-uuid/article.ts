import { Schema } from '../utils'
import {
  EntityPayload,
  EntityType,
  EntityRevision,
  EntityRevisionPayload,
  EntityRevisionType,
} from './abstract-entity'
import {
  addTaxonomyTermChildResolvers,
  TaxonomyTermChild,
} from './abstract-taxonomy-term-child'

export const articleSchema = new Schema()

export class Article extends TaxonomyTermChild {
  public __typename = EntityType.Article
}
export interface ArticlePayload extends EntityPayload {
  taxonomyTermIds: number[]
}

export class ArticleRevision extends EntityRevision {
  public __typename = EntityRevisionType.ArticleRevision
  public title: string
  public content: string
  public changes: string
  public metaTitle: string
  public metaDescription: string

  public constructor(payload: ArticleRevisionPayload) {
    super(payload)
    this.title = payload.title
    this.content = payload.content
    this.changes = payload.changes
    this.metaTitle = payload.metaTitle
    this.metaDescription = payload.metaDescription
  }
}

export interface ArticleRevisionPayload extends EntityRevisionPayload {
  title: string
  content: string
  changes: string
  metaTitle: string
  metaDescription: string
}

addTaxonomyTermChildResolvers({
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
    metaTitle: String!
    metaDescription: String!
  `,
  entitySetter: 'setArticle',
  entityRevisionSetter: 'setArticleRevision',
})
