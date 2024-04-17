import { A } from 'ts-toolbelt'

import { modelFactories } from '~/model'
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
export type Typename<T> = T extends { __typename?: infer U }
  ? U extends string
    ? U
    : '__not_a_graphql_type'
  : '__not_a_graphql_type'

export type Payload<
  M extends keyof AllPayloads,
  P extends keyof AllPayloads[M],
> = AllPayloads[M][P]

export type AllPayloads = {
  [M in keyof ModelFactories]: Payloads<ReturnType<ModelFactories[M]>>
}
export type Payloads<M> = {
  [F in keyof M]: NonNullable<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    A.Await<M[F] extends (...args: any) => infer R ? R : never>
  >
}

export type ModelFactories = typeof modelFactories
