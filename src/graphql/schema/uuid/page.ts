import { ForbiddenError, gql } from 'apollo-server'

import { DateTime } from '../date-time'
import { Instance } from '../instance'
import { License, licenseSchema } from '../license'
import { Service, Context } from '../types'
import { requestsOnlyFields, Schema } from '../utils'
import { DiscriminatorType, Uuid, UuidPayload } from './abstract-uuid'
import { User } from './user'

export const pageSchema = new Schema()

/**
 * type Page
 */
export class Page extends Uuid {
  public __typename = DiscriminatorType.Page
  public instance: Instance
  public alias?: string
  public currentRevisionId?: number
  public licenseId: number

  public constructor(payload: {
    id: number
    trashed: boolean
    instance: Instance
    alias?: string
    taxonomyTermIds: number[]
    currentRevisionId?: number
    licenseId: number
  }) {
    super(payload)
    this.instance = payload.instance
    this.alias = payload.alias
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
    const data = await dataSources.serlo.getUuid(partialCurrentRevision)
    return new PageRevision(data)
  }
)
pageSchema.addResolver<Page, unknown, Partial<License>>(
  'Page',
  'license',
  async (page, _args, context, info) => {
    const partialLicense = { id: page.licenseId }
    if (requestsOnlyFields('License', ['id'], info)) {
      return partialLicense
    }
    return licenseSchema.resolvers.Query.license(
      undefined,
      partialLicense,
      context,
      info
    )
  }
)
pageSchema.addTypeDef(gql`
  """
  Represents a Serlo.org page. A \`Page\` is a repository containing \`PageRevision\`s, is tied to an \`Instance\`,
  has a \`License\`, and has an alias.
  """
  type Page implements Uuid {
    """
    The ID of the page
    """
    id: Int!
    """
    \`true\` iff the page has been trashed
    """
    trashed: Boolean!
    """
    The \`Instance\` the page is tied to
    """
    instance: Instance!
    """
    The alias of the page
    """
    alias: String
    """
    The \`License\` of the page
    """
    license: License!
    """
    The \`PageRevision\` that is currently checked out
    """
    currentRevision: PageRevision
    navigation: Navigation
  }
`)

/**
 * type PageRevision
 */
export class PageRevision extends Uuid {
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
pageSchema.addResolver<PageRevision, unknown, Partial<User>>(
  'PageRevision',
  'author',
  async (pageRevision, _args, { dataSources }, info) => {
    const partialUser = { id: pageRevision.authorId }
    if (requestsOnlyFields('User', ['id'], info)) {
      return partialUser
    }
    const data = await dataSources.serlo.getUuid(partialUser)
    return new User(data)
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
    const data = await dataSources.serlo.getUuid(partialPage)
    return new Page(data)
  }
)
pageSchema.addTypeDef(gql`
  """
  Represents a Serlo.org page revision. A \`PageRevision\` has fields title and content.
  """
  type PageRevision implements Uuid {
    """
    The ID of the page revision
    """
    id: Int!
    """
    The \`User\` that created the page revision
    """
    author: User!
    """
    \`true\` iff the page revision has been trashed
    """
    trashed: Boolean!
    """
    The \`DateTime\` the page revision has been created
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
    The \`Page\` the page revision is tied to
    """
    page: Page!
  }
`)

/**
 * mutation _setPage
 */
pageSchema.addMutation<unknown, PagePayload, null>(
  '_setPage',
  async (_parent, payload, { dataSources, service }) => {
    if (service !== Service.Serlo) {
      throw new ForbiddenError(`You do not have the permissions to set a page`)
    }
    await dataSources.serlo.setPage(payload)
  }
)
export interface PagePayload extends UuidPayload {
  instance: Instance
  alias: string | null
  currentRevisionId: number | null
  licenseId: number
}
pageSchema.addTypeDef(gql`
  extend type Mutation {
    """
    Inserts the given \`Page\` into the cache. May only be called by \`serlo.org\` when a page has been created or updated.
    """
    _setPage(
      """
      The ID of the page
      """
      id: Int!
      """
      \`true\` iff the page has been trashed
      """
      trashed: Boolean!
      """
      The \`Instance\` the page is tied to
      """
      instance: Instance!
      """
      The current alias of the page
      """
      alias: String
      """
      The ID of the current revision
      """
      currentRevisionId: Int
      """
      The ID of the license
      """
      licenseId: Int!
    ): Boolean
  }
`)
export function setPage(variables: PagePayload) {
  return {
    mutation: gql`
      mutation setPage(
        $id: Int!
        $trashed: Boolean!
        $instance: Instance!
        $alias: String
        $currentRevisionId: Int
        $licenseId: Int!
      ) {
        _setPage(
          id: $id
          trashed: $trashed
          instance: $instance
          alias: $alias
          currentRevisionId: $currentRevisionId
          licenseId: $licenseId
        )
      }
    `,
    variables,
  }
}

/**
 * mutation _setPageRevision
 */
pageSchema.addMutation<unknown, PageRevisionPayload, null>(
  '_setPageRevision',
  async (_parent, payload, { dataSources, service }) => {
    if (service !== Service.Serlo) {
      throw new ForbiddenError(
        `You do not have the permissions to set a page revision`
      )
    }
    await dataSources.serlo.setPageRevision(payload)
  }
)
export interface PageRevisionPayload extends UuidPayload {
  title: string
  content: string
  date: DateTime
  authorId: number
  repositoryId: number
}
pageSchema.addTypeDef(gql`
  extend type Mutation {
    """
    Inserts the given \`PageRevision\` into the cache. May only be called by \`serlo.org\` when a page revision has been created.
    """
    _setPageRevision(
      """
      The ID of the page revision
      """
      id: Int!
      """
      \`true\` iff the page revision has been trashed
      """
      trashed: Boolean!
      """
      The value of the title field
      """
      title: String!
      """
      The value of the content field
      """
      content: String!
      """
      The \`DateTime\` the page revision has been created
      """
      date: DateTime!
      """
      The ID of the \`User\` that created the page revision
      """
      authorId: Int!
      """
      The ID of the \`Page\`
      """
      repositoryId: Int!
    ): Boolean
  }
`)
