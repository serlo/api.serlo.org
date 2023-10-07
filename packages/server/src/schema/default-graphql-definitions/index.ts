import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json'

import typeDefs from './types.graphql'
import { Schema } from '~/internals/graphql'

export const defaultGraphQLDefinitionsSchema: Schema = {
  resolvers: {
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject,
  },
  typeDefs: [typeDefs],
}
