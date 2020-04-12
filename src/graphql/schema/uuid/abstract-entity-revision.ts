import { gql } from 'apollo-server'

import { DateTime } from '../date-time'
import { Resolvers, TypeDefs } from '../utils'
import { abstractEntityTypeDefs } from './abstract-entity'
import { Uuid } from './abstract-uuid'

export const abstractEntityRevisionResolvers = new Resolvers()
export const abstractEntityRevisionTypeDefs = new TypeDefs()

export enum EntityRevisionType {
  ArticleRevision = 'ArticleRevision',
}

export abstract class EntityRevision extends Uuid {
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
abstractEntityRevisionResolvers.addTypeResolver<EntityRevision>(
  'EntityRevision',
  (revision) => {
    return revision.__typename
  }
)
abstractEntityTypeDefs.add(gql`
  """
  Represents a Serlo.org entity revision (e.g. a revision of an article). An \`EntityRevision\` is tied to an \`Entity\` and has an author.
  """
  interface EntityRevision {
    """
    The \`User\` that created the entity revision
    """
    author: User!
    """
    The \`DateTime\` the entity revision has been created
    """
    date: DateTime!
  }
`)
