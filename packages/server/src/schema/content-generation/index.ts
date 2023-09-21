import { resolvers } from './resolvers'
import typeDefs from './types.graphql'
import { Schema } from '~/internals/graphql'

export const contentGenerationSchema: Schema = {
  resolvers,
  typeDefs: [typeDefs],
}
