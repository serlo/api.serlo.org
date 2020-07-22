import { Schema } from '../../utils'
import typeDefs from './types.graphql'

export * from './types'

export const navigationSchema = new Schema({}, [typeDefs])
