import { DocumentNode } from 'graphql'
import * as R from 'ramda'

import { ResolversParentTypes } from '~/types'

export interface Schema {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  resolvers: {}
  typeDefs: DocumentNode[]
}

export function mergeSchemas(...schemas: Schema[]): Schema {
  const subResolvers = R.map((schema) => schema.resolvers, schemas)
  const resolvers = R.reduce<Record<string, unknown>, Schema['resolvers']>(
    R.mergeDeepRight,
    {},
    subResolvers,
  )
  const subTypeDefs = R.map((schema) => schema.typeDefs, schemas)
  const typeDefs = R.flatten(subTypeDefs)
  return { resolvers, typeDefs }
}

/**
 * Given the name `M` of a graphql type `Model<M>` returns the model type of the
 * graphql type with the name `M`. In case `M` is the name of a union or an
 * interface the union of all model types are returned whose corresponding
 * graphql types are in the union or implement the interface.
 *
 * @example
 * ```ts
 * type ThreadModel = Model<"Thread">
 * type UuidPayload = Model<"AbstractUuid">
 * ```
 */
export type Model<M extends keyof ResolversParentTypes> =
  ResolversParentTypes[M]
