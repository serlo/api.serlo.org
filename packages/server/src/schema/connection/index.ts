import typeDefs from './types.graphql'
import { Schema } from '~/internals/graphql'

export const connectionSchema: Schema = { resolvers: {}, typeDefs: [typeDefs] }
