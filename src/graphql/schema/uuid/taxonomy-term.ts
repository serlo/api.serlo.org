import { ForbiddenError, gql } from 'apollo-server'
import { GraphQLResolveInfo } from 'graphql'

import { AbstractUuidPayload, resolveAbstractUuid, UuidPayload } from '.'
import { Instance } from '../instance'
import { Service, Context } from '../types'
import { requestsOnlyFields, Schema } from '../utils'
import { DiscriminatorType, Uuid } from './abstract-uuid'
import { encodePath } from './alias'

export const taxonomyTermSchema = new Schema()

/**
 * enum TaxonomyTermType
 */
export enum TaxonomyTermType {
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
taxonomyTermSchema.addTypeDef(gql`
  """
  Represents the type of a taxonomy term type.
  """
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
`)

/**
 * type TaxonomyTerm
 */
export class TaxonomyTerm extends Uuid {
  public __typename = DiscriminatorType.TaxonomyTerm
  public type: TaxonomyTermType
  public instance: Instance
  public alias: string | null
  public name: string
  public description: string | null
  public weight: number
  public parentId: number | null
  public childrenIds: number[]

  public constructor(payload: TaxonomyTermPayload) {
    super(payload)
    this.type = payload.type
    this.instance = payload.instance
    this.alias = payload.alias ? encodePath(payload.alias) : null
    this.name = payload.name
    this.description = payload.description
    this.weight = payload.weight
    this.parentId = payload.parentId
    this.childrenIds = payload.childrenIds
  }

  public async parent(
    _args: undefined,
    { dataSources }: Context,
    info: GraphQLResolveInfo
  ) {
    if (!this.parentId) return null
    const partialParent = { id: this.parentId }
    if (requestsOnlyFields('TaxonomyTerm', ['id'], info)) {
      return partialParent
    }
    const data = await dataSources.serlo.getUuid<TaxonomyTermPayload>(
      partialParent
    )
    return new TaxonomyTerm(data)
  }

  public async children(_args: undefined, { dataSources }: Context) {
    return Promise.all(
      this.childrenIds.map((id) => {
        return dataSources.serlo
          .getUuid<AbstractUuidPayload>({ id })
          .then((data) => {
            return resolveAbstractUuid(data) as Uuid
          })
      })
    )
  }

  public async path(_args: undefined, { dataSources }: Context) {
    const path: TaxonomyTerm[] = [this]
    let current: TaxonomyTerm = path[0]

    while (current.parentId !== null) {
      const data = await dataSources.serlo.getUuid<TaxonomyTermPayload>({
        id: current.parentId,
      })
      current = new TaxonomyTerm(data)
      path.unshift(current)
    }

    return path
  }

  public async navigation(_args: undefined, context: Context) {
    const taxonomyPath = await this.path(undefined, context)

    for (let i = 0; i < taxonomyPath.length; i++) {
      const currentIndex = taxonomyPath.length - (i + 1)
      const current = taxonomyPath[currentIndex]
      const navigation = await context.dataSources.serlo.getNavigation({
        instance: this.instance,
        id: current.id,
      })

      if (navigation !== null) {
        const { data, path } = navigation

        return {
          data,
          path: [
            ...path,
            ...taxonomyPath.slice(currentIndex + 1).map((term) => {
              return {
                label: term.name,
                url: term.alias,
                id: term.id,
              }
            }),
          ],
        }
      }
    }

    return null
  }
}
taxonomyTermSchema.addTypeDef(gql`
  """
  Represents a Serlo.org taxonomy term. The taxonomy organizes entities into a tree-like structure, either by
  topic or by curriculum. An entity can be child of multiple \`TaxonomyTerm\`s
  """
  type TaxonomyTerm implements Uuid {
    """
    The ID of the taxonomy term
    """
    id: Int!
    """
    \`true\` iff the taxonomy term has been trashed
    """
    trashed: Boolean!
    """
    The \`TaxonomyTermType\` of the taxonomy term
    """
    type: TaxonomyTermType!
    """
    The \`Instance\` the taxonomy term is tied to
    """
    instance: Instance!
    """
    The current alias of the taxonomy term
    """
    alias: String
    """
    The name of the taxonomy term
    """
    name: String!
    """
    The description of the taxonomy term
    """
    description: String
    """
    The weight of the taxonomy term compared to its siblings
    """
    weight: Int!
    """
    The parent \`TaxonomyTerm\` of the taxonomy term
    """
    parent: TaxonomyTerm
    """
    The children of the taxonomy term
    """
    children: [Uuid!]!
    navigation: Navigation
  }
`)

/**
 * mutation _setTaxonomyTerm
 */
taxonomyTermSchema.addMutation<unknown, TaxonomyTermPayload, null>(
  '_setTaxonomyTerm',
  async (_parent, payload, { dataSources, service }) => {
    if (service !== Service.Serlo) {
      throw new ForbiddenError(
        `You do not have the permissions to set a taxonomy term`
      )
    }
    await dataSources.serlo.setTaxonomyTerm(payload)
  }
)
export interface TaxonomyTermPayload extends UuidPayload {
  alias: string | null
  type: TaxonomyTermType
  instance: Instance
  name: string
  description: string | null
  weight: number
  parentId: number | null
  childrenIds: number[]
}

taxonomyTermSchema.addTypeDef(gql`
  extend type Mutation {
    """
    Inserts the given \`TaxonomyTerm\` into the cache. May only be called by \`serlo.org\` when a taxonomy term has been created or updated.
    """
    _setTaxonomyTerm(
      """
      The ID of the taxonomy term
      """
      id: Int!
      """
      \`true\` iff the taxonomy term has been trashed
      """
      trashed: Boolean!
      """
      The current alias of the taxonomy term
      """
      alias: String
      """
      The \`TaxonomyTermType\` of the taxonomy term
      """
      type: TaxonomyTermType!
      """
      The \`Instance\` the taxonomy term is tied to
      """
      instance: Instance!
      """
      The name of the taxonomy term
      """
      name: String!
      """
      The description of the taxonomy term
      """
      description: String
      """
      The weight of the taxonomy term compared to its siblings
      """
      weight: Int!
      """
      The ID of the parent of the taxonomy term
      """
      parentId: Int
      """
      The IDs of \`Uuid\`s that the taxonomy term contains
      """
      childrenIds: [Int!]!
    ): Boolean
  }
`)
export function setTaxonomyTerm(variables: TaxonomyTermPayload) {
  return {
    mutation: gql`
      mutation setTaxonomyTerm(
        $id: Int!
        $trashed: Boolean!
        $alias: String
        $type: TaxonomyTermType!
        $instance: Instance!
        $name: String!
        $description: String
        $weight: Int!
        $parentId: Int
        $childrenIds: [Int!]!
      ) {
        _setTaxonomyTerm(
          id: $id
          trashed: $trashed
          alias: $alias
          type: $type
          instance: $instance
          name: $name
          description: $description
          weight: $weight
          parentId: $parentId
          childrenIds: $childrenIds
        )
      }
    `,
    variables,
  }
}
