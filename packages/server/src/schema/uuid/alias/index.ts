import typeDefs from './types.graphql'
import { Schema } from '~/internals/graphql'

export const aliasSchema: Schema = { resolvers: {}, typeDefs: [typeDefs] }
