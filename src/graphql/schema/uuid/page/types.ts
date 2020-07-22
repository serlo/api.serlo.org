import { License, Page, PageRevision } from '../../../../types'
import { Resolver } from '../../types'
import { DiscriminatorType } from '../abstract-uuid'
import { Navigation } from '../navigation'
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
    navigation: Resolver<PagePreResolver, never, Navigation | null>
    currentRevision: Resolver<
      PagePreResolver,
      never,
      Partial<PageRevisionPreResolver> | null
    >
    license: Resolver<PagePreResolver, never, Partial<License>>
  }
  PageRevision: {
    author: Resolver<PageRevisionPreResolver, never, Partial<UserPreResolver>>
    page: Resolver<PageRevisionPreResolver, never, Partial<PagePreResolver>>
  }
}
