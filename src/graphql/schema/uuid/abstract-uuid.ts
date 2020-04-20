import { ForbiddenError, gql } from 'apollo-server'

import { resolveAbstractUuid } from '.'
import { Service } from '../types'
import { Schema } from '../utils'
import { EntityType, EntityRevisionType } from './abstract-entity'
import { AliasInput } from './alias'

export const abstractUuidSchema = new Schema()

export enum DiscriminatorType {
  Page = 'Page',
  PageRevision = 'PageRevision',
  User = 'User',
  TaxonomyTerm = 'TaxonomyTerm',
}

export type UuidType =
  | DiscriminatorType
  | EntityType
  | EntityRevisionType
  | 'UnsupportedUuid'

/**
 * interface Uuid
 */
export abstract class Uuid {
  public abstract __typename: UuidType
  public id: number
  public trashed: boolean

  public constructor(payload: UuidPayload) {
    this.id = payload.id
    this.trashed = payload.trashed
  }
}
export interface UuidPayload {
  id: number
  trashed: boolean
}
abstractUuidSchema.addTypeResolver<Uuid>('Uuid', (uuid) => {
  return uuid.__typename
})
abstractUuidSchema.addTypeDef(gql`
  """
  Represents a Serlo.org data entity that can be uniquely identified by its ID and can be trashed.
  """
  interface Uuid {
    """
    The ID
    """
    id: Int!
    """
    \`true\` iff the data entity has been trashed
    """
    trashed: Boolean!
  }
`)

/**
 * type UnsupportedUuid
 */
export class UnsupportedUuid extends Uuid {
  public __typename: UuidType = 'UnsupportedUuid'
  public discriminator: string

  public constructor(payload: {
    id: number
    trashed: boolean
    discriminator: string
  }) {
    super(payload)
    this.discriminator = payload.discriminator
  }
}
abstractUuidSchema.addTypeDef(gql`
  """
  Represents an \`Uuid\` that isn't supported by the API, yet
  """
  type UnsupportedUuid implements Uuid {
    """
    The ID
    """
    id: Int!
    """
    \`true\` iff the data entity has been trashed
    """
    trashed: Boolean!
    """
    The discriminator
    """
    discriminator: String!
  }
`)

/**
 * query uuid
 */
abstractUuidSchema.addQuery<
  unknown,
  { id?: number; alias?: AliasInput },
  Uuid | null
>('uuid', async (_parent, payload, { dataSources }) => {
  const id = payload.alias
    ? (await dataSources.serlo.getAlias(payload.alias)).id
    : (payload.id as number)
  const data = await dataSources.serlo.getUuid({ id })
  return resolveAbstractUuid(data)
})
abstractUuidSchema.addTypeDef(gql`
  type Query {
    """
    Returns the \`Uuid\` with the given id or alias.
    """
    uuid(
      """
      The alias to look up
      """
      alias: AliasInput
      """
      The ID to look up
      """
      id: Int
    ): Uuid
  }
`)

/**
 * mutation _removeUuid
 */
abstractUuidSchema.addMutation<unknown, { id: number }, null>(
  '_removeUuid',
  (_parent, payload, { dataSources, service }) => {
    if (service !== Service.Serlo) {
      throw new ForbiddenError(
        `You do not have the permissions to remove an uuid`
      )
    }
    return dataSources.serlo.removeUuid(payload)
  }
)
abstractUuidSchema.addTypeDef(gql`
  type Mutation {
    """
    Removes the \`Uuid\` with the given ID from cache. May only be called by \`serlo.org\` when an Uuid has been removed.
    """
    _removeUuid(id: Int!): Boolean
  }
`)
