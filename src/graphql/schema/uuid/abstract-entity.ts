import { gql } from 'apollo-server'

import { DateTime } from '../date-time'
import { Instance } from '../instance'
import { Schema } from '../utils'
import { Uuid } from './abstract-uuid'

export const abstractEntitySchema = new Schema()

export enum EntityType {
  Article = 'Article',
}

/**
 * interface Entity
 */
export abstract class Entity extends Uuid {
  public abstract __typename: EntityType
  public instance: Instance
  public alias?: string
  public date: string
  public licenseId: number
  public taxonomyTermIds: number[]
  public currentRevisionId?: number

  public constructor(payload: {
    id: number
    trashed: boolean
    alias?: string
    date: DateTime
    instance: Instance
    licenseId: number
    taxonomyTermIds: number[]
    currentRevisionId?: number
  }) {
    super(payload)
    this.instance = payload.instance
    this.alias = payload.alias
    this.date = payload.date
    this.licenseId = payload.licenseId
    this.taxonomyTermIds = payload.taxonomyTermIds
    this.currentRevisionId = payload.currentRevisionId
  }
}
abstractEntitySchema.addTypeResolver<Entity>('Entity', (entity) => {
  return entity.__typename
})
abstractEntitySchema.addTypeDef(gql`
  """
  Represents a Serlo.org entity (e.g. an article). An \`Entity\` is tied to an \`Instance\`, has a \`License\`, might have an alias
  and is the child of \`TaxonomyTerm\`s
  """
  interface Entity {
    """
    The \`DateTime\` the entity has been created
    """
    date: DateTime!
    """
    The \`Instance\` the entity is tied to
    """
    instance: Instance!
    """
    The current alias of the entity
    """
    alias: String
    """
    The \`License\` of the entity
    """
    license: License!
    """
    The \`TaxonomyTerm\`s that the entity has been associated with
    """
    taxonomyTerms: [TaxonomyTerm!]!
  }
`)
