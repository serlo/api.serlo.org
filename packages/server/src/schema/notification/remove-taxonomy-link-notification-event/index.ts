import { resolvers } from './resolvers'
import typeDefs from './types.graphql'
import { Schema } from '~/internals/graphql'

export const removeTaxonomyLinkNotificationSchema: Schema = {
  resolvers,
  typeDefs: [typeDefs],
}
