import {
  AbstractEntityRevisionPreResolver,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'
import { AbstractTaxonomyTermChildPreResolver } from '../abstract-taxonomy-term-child'

export interface ArticlePreResolver
  extends AbstractTaxonomyTermChildPreResolver {
  __typename: EntityType.Article
}

export type ArticlePayload = ArticlePreResolver

export interface ArticleRevisionPreResolver
  extends AbstractEntityRevisionPreResolver {
  __typename: EntityRevisionType.ArticleRevision
  title: string
  content: string
  changes: string
  metaTitle: string
  metaDescription: string
}

export type ArticleRevisionPayload = ArticleRevisionPreResolver
