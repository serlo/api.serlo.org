import { ForbiddenError, gql } from 'apollo-server'

import { DateTime } from '../date-time'
import { Service } from '../types'
import { Schema } from '../utils'
import { DiscriminatorType, Uuid } from './abstract-uuid'

export const userSchema = new Schema()

/**
 * type User
 */
export class User extends Uuid {
  public __typename = DiscriminatorType.User
  public username: string
  public date: DateTime
  public lastLogin?: DateTime
  public description?: string

  public constructor(payload: {
    id: number
    trashed: boolean
    username: string
    date: DateTime
    lastLogin?: DateTime
    description?: string
  }) {
    super(payload)
    this.username = payload.username
    this.date = payload.date
    this.lastLogin = payload.lastLogin
    this.description = payload.description
  }
}
userSchema.addTypeDef(gql`
  """
  Represents a Serlo.org user account
  """
  type User implements Uuid {
    """
    The ID of the user
    """
    id: Int!
    """
    \`true\` iff the user has been trashed
    """
    trashed: Boolean!
    """
    The (unique) \`username\` of the user
    """
    username: String!
    """
    The \`DateTime\` the user account has been created
    """
    date: DateTime!
    """
    The \`DateTime\` the user has last logged in
    """
    lastLogin: DateTime
    """
    The profile of the user
    """
    description: String
  }
`)

/**
 * mutation _setUser
 */
userSchema.addMutation<unknown, UserPayload, null>(
  '_setUser',
  (_parent, payload, { dataSources, service }) => {
    if (service !== Service.Serlo) {
      throw new ForbiddenError(`You do not have the permissions to set an user`)
    }
    return dataSources.serlo.setUser(payload)
  }
)
export interface UserPayload {
  id: number
  trashed: boolean
  username: string
  date: DateTime
  lastLogin?: DateTime
  description?: string
}
userSchema.addTypeDef(gql`
  extend type Mutation {
    """
    Inserts the given \`User\` into the cache. May only be called by \`serlo.org\` when an user has been created or updated.
    """
    _setUser(
      """
      The ID of the user
      """
      id: Int!
      """
      \`true\` iff the user has been trashed
      """
      trashed: Boolean!
      """
      The username of the user
      """
      username: String!
      """
      The \`DateTime\` the user has registered on serlo.org
      """
      date: DateTime!
      """
      The \`DateTime\` of the user's latest login
      """
      lastLogin: DateTime
      """
      The profile of the user
      """
      description: String
    ): Boolean
  }
`)
