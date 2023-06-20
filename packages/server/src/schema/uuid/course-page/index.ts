import { resolvers } from './resolvers'
import typeDefs from './types.graphql'
import { Schema } from '~/internals/graphql'

export const coursePageSchema: Schema = { resolvers, typeDefs: [typeDefs] }
