import { ForbiddenError, gql } from 'apollo-server'

import { resolveAbstractUuid } from '.'
import { Instance } from '../instance'
import { Service } from '../types'
import { requestsOnlyFields, Schema } from '../utils'
import { DiscriminatorType, Uuid } from './abstract-uuid'

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
  public description?: string
  public weight: number
  public parentId: number | null
  public childrenIds: number[]

  public constructor(payload: {
    id: number
    type: TaxonomyTermType
    trashed: boolean
    instance: Instance
    alias: string | null
    name: string
    description?: string
    weight: number
    parentId: number | null
    childrenIds: number[]
  }) {
    super(payload)
    this.type = payload.type
    this.instance = payload.instance
    this.alias = payload.alias
    this.name = payload.name
    this.description = payload.description
    this.weight = payload.weight
    this.parentId = payload.parentId
    this.childrenIds = payload.childrenIds
  }
}
taxonomyTermSchema.addResolver<
  TaxonomyTerm,
  undefined,
  Partial<TaxonomyTerm> | null
>(
  'TaxonomyTerm',
  'parent',
  async (taxonomyTerm, _args, { dataSources }, info) => {
    if (!taxonomyTerm.parentId) return null
    const partialParent = { id: taxonomyTerm.parentId }
    if (requestsOnlyFields('TaxonomyTerm', ['id'], info)) {
      return partialParent
    }
    const data = await dataSources.serlo.getUuid(partialParent)
    return new TaxonomyTerm(data)
  }
)
taxonomyTermSchema.addResolver<TaxonomyTerm, undefined, Uuid[]>(
  'TaxonomyTerm',
  'children',
  (taxonomyTerm, _args, { dataSources }) => {
    return Promise.all(
      taxonomyTerm.childrenIds.map((id) => {
        return dataSources.serlo.getUuid({ id }).then((data) => {
          return resolveAbstractUuid(data) as Uuid
        })
      })
    )
  }
)
taxonomyTermSchema.addResolver<TaxonomyTerm, undefined, TaxonomyTerm[]>(
  'TaxonomyTerm',
  'path',
  async (taxonomyTerm, _args, { dataSources }) => {
    const path = [taxonomyTerm]
    let current = taxonomyTerm

    while (current.parentId !== null) {
      const data = await dataSources.serlo.getUuid({
        id: current.parentId,
      })
      current = new TaxonomyTerm(data)
      path.unshift(current)
    }

    return path
  }
)
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
    """
    The complete path from root to the taxonomy term
    """
    path: [TaxonomyTerm]!
  }
`)

/**
 * mutation _setTaxonomyTerm
 */
taxonomyTermSchema.addMutation<unknown, TaxonomyTermPayload, null>(
  '_setTaxonomyTerm',
  (_parent, payload, { dataSources, service }) => {
    if (service !== Service.Serlo) {
      throw new ForbiddenError(
        `You do not have the permissions to set a taxonomy term`
      )
    }
    return dataSources.serlo.setTaxonomyTerm(payload)
  }
)
export interface TaxonomyTermPayload {
  id: number
  trashed: boolean
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
