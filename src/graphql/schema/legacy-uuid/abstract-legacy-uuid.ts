import { ForbiddenError, gql } from 'apollo-server'

import { resolveAbstractLegacyUuid } from '.'
import { Service } from '../types'
import { Schema } from '../utils'
import { EntityType, EntityRevisionType } from './abstract-entity'
import { AliasInput } from './alias'

export const abstractLegacyUuidSchema = new Schema()

export enum DiscriminatorType {
  Page = 'Page',
  PageRevision = 'PageRevision',
  User = 'User',
  TaxonomyTerm = 'TaxonomyTerm',
}

export type LegacyUuidType =
  | DiscriminatorType
  | EntityType
  | EntityRevisionType
  | 'UnsupportedUuid'

/**
 * interface LegacyUuid
 */
export abstract class LegacyUuid {
  public abstract __typename: LegacyUuidType
  public id: number
  public trashed: boolean

  public constructor(payload: LegacyUuidPayload) {
    this.id = payload.id
    this.trashed = payload.trashed
  }
}
export interface LegacyUuidPayload {
  id: number
  trashed: boolean
}
abstractLegacyUuidSchema.addTypeResolver<LegacyUuid>('LegacyUuid', (uuid) => {
  return uuid.__typename
})
abstractLegacyUuidSchema.addTypeDef(gql`
  interface LegacyUuid {
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
export class UnsupportedLegacyUuid extends LegacyUuid {
  public __typename: LegacyUuidType = 'UnsupportedUuid'
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
abstractLegacyUuidSchema.addTypeDef(gql`
  type UnsupportedLegacyUuid implements LegacyUuid {
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
abstractLegacyUuidSchema.addQuery<
  unknown,
  { id?: number; alias?: AliasInput },
  LegacyUuid | null
>('uuid', async (_parent, payload, { dataSources }) => {
  const id = payload.alias
    ? (await dataSources.serlo.getAlias(payload.alias)).id
    : (payload.id as number)
  const data = await dataSources.serlo.getUuid({ id })
  return resolveAbstractLegacyUuid(data)
})
abstractLegacyUuidSchema.addTypeDef(gql`
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
    ): LegacyUuid
  }
`)

/**
 * mutation _removeUuid
 */
abstractLegacyUuidSchema.addMutation<unknown, { id: number }, null>(
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
abstractLegacyUuidSchema.addTypeDef(gql`
  type Mutation {
    """
    Removes the \`Uuid\` with the given ID from cache. May only be called by \`serlo.org\` when an Uuid has been removed.
    """
    _removeUuid(id: Int!): Boolean
  }
`)
