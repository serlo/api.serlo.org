import { resolvers } from './resolvers'
import typeDefs from './types.graphql'
import { Schema } from '~/internals/graphql'

export const experimentSchema: Schema = { resolvers, typeDefs: [typeDefs] }
