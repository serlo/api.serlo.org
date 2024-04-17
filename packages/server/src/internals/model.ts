import { A } from 'ts-toolbelt'

import { Models } from '~/model/types'
import { type Connection } from '~/schema/connection/types'

/**
 * Given a GraphQL type it computes the model type of the GraphQL type based
 * on the following rules.
 */
export type ModelOf<T> =
  // This is needed for the JSON model type
  A.Equals<T, unknown> extends 1
    ? unknown
    : Record<string, unknown> extends T
      ? Record<string, unknown>
      : T extends string | boolean | number | null
        ? T
        : ModelFromTypename<Typename<T>>

type ModelFromTypename<T extends string> = T extends keyof Models
  ? Models[T]
  : T extends `${infer U}Connection`
    ? Connection<FromModels<U>>
    : T extends `${string}{'Query' | 'Mutation'}`
      ? Record<string, never>
      : never

type FromModels<T extends string> = T extends keyof Models ? Models[T] : never

/**
 * Given a GraphQL type it returns the name of the GraphQL type as a string.
 *
 * @example
 * import { Article } from '~/types'
 *
 * type A = Typename<Article> // A equals "Article"
 */
type Typename<T> = T extends { __typename?: infer U }
  ? U extends string
    ? U
    : '__not_a_graphql_type'
  : '__not_a_graphql_type'
