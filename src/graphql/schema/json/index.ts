import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json'

import { Schema } from '../utils'
import typeDefs from './types.graphql'

export const jsonSchema = new Schema(
  ({
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject,
  } as unknown) as Schema['resolvers'],
  [typeDefs]
)
