import { ForbiddenError, gql } from 'apollo-server'

import { Instance } from '../instance'
import { Service } from '../types'
import { Schema } from '../utils'

export const navigationSchema = new Schema()

export interface Navigation {
  data: string
  path: NavigationNode[]
}
navigationSchema.addTypeDef(gql`
  type Navigation {
    data: String!
    path: [NavigationNode!]!
  }
`)

export interface NavigationNode {
  label: string
  url: string | null
  id: number | null
}
navigationSchema.addTypeDef(gql`
  type NavigationNode {
    label: String!
    url: String
    id: Int
  }
`)

/**
 * mutation _setNavigation
 */
navigationSchema.addMutation<unknown, NavigationPayload, null>(
  '_setNavigation',
  async (_parent, payload, { dataSources, service }) => {
    if (service !== Service.Serlo) {
      throw new ForbiddenError(
        `You do not have the permissions to set the navigation`
      )
    }
    await dataSources.serlo.setNavigation(payload)
  }
)
export interface NavigationPayload {
  data: string
  instance: Instance
}
navigationSchema.addTypeDef(gql`
  extend type Mutation {
    _setNavigation(data: String!, instance: Instance!): Boolean
  }
`)
export function setNavigation(variables: NavigationPayload) {
  return {
    mutation: gql`
      mutation setNavigation($data: String!, $instance: Instance!) {
        _setNavigation(data: $data, instance: $instance)
      }
    `,
    variables,
  }
}
