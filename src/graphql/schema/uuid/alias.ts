import { ForbiddenError, gql } from 'apollo-server'

import { DateTime } from '../date-time'
import { Instance } from '../instance'
import { Service } from '../types'
import { Schema } from '../utils'

export const aliasSchema = new Schema()

/**
 * input AliasInput
 */
export interface AliasInput {
  instance: Instance
  path: string
}
aliasSchema.addTypeDef(gql`
  """
  Needed input to look up an Uuid by alias.
  """
  input AliasInput {
    """
    The \`Instance\` the alias should be looked up in
    """
    instance: Instance!
    """
    The path that should be looked up
    """
    path: String!
  }
`)

/**
 * mutation _setAlias
 */
aliasSchema.addMutation<unknown, AliasPayload, null>(
  '_setAlias',
  (_parent, payload, { dataSources, service }) => {
    if (service !== Service.Serlo) {
      throw new ForbiddenError(
        `You do not have the permissions to set an alias`
      )
    }
    return dataSources.serlo.setAlias(payload)
  }
)
export interface AliasPayload {
  id: number
  instance: Instance
  path: string
  source: string
  timestamp: DateTime
}
aliasSchema.addTypeDef(gql`
  extend type Mutation {
    """
    Inserts the given \`Alias\` into the cache. May only be called by \`serlo.org\` when an alias has been created or updated.
    """
    _setAlias(
      """
      The id the of \`Uuid\` the alias links to
      """
      id: Int!
      """
      The \`Instance\` the alias is tied to
      """
      instance: Instance!
      """
      The path of the alias
      """
      path: String!
      """
      The path the alias links to
      """
      source: String!
      """
      The \`DateTime\` the alias has been created
      """
      timestamp: DateTime!
    ): Boolean
  }
`)
