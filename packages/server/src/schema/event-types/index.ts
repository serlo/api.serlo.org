import { resolvers } from './resolvers'
import typeDefs from './types.graphql'
import { Schema } from '~/internals/graphql'

export const eventTypesSchema: Schema = {
  resolvers,
  typeDefs: [typeDefs],
}
