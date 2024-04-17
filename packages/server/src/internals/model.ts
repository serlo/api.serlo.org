import { Models } from '~/model/types'

/**
 * Given a GraphQL type it computes the model type of the GraphQL type based
 * on the following rules.
 */
export type ModelOf<T> =
  Typename<T> extends keyof Models ? Models[Typename<T>] : T

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
