import { DocumentNode } from 'graphql'
import * as R from 'ramda'
import { A, O } from 'ts-toolbelt'

import { Context } from './context'
import { Typename } from '~/internals/model'
import { MutationResolvers, QueryResolvers, Resolver, Resolvers } from '~/types'

export interface Schema {
  // eslint-disable-next-line @typescript-eslint/ban-types
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
// TODO: For some reason `ModelMapping[M]` is a union with undefined and thus
// we need `NonNullable<...>`. There should be a way to remove this.
export type Model<M extends keyof ModelMapping> = NonNullable<ModelMapping[M]>

/**
 * Mapping between graphql type names and their model types:
 * ```ts
 *   ModelMapping = {
 *     User: { id: number, username: string, ... }
 *     ArticleRevision: { id: number, authorId: number, ... }
 *     ...
 *     AbstractRevision: | ModelMapping["ArticleRevision"]
 *                       | ModelMapping["CourseRevision"]
 *                       | ...
 *     ...
 *   }
 * ```
 * Here we use, that for each concrete graphql type there is a `__isTypeOf`
 * function in the generated resolver type whose first parameter is the parent
 * and thus has the model type of the concrete graphql type. This first
 * parameter is used for the mapping. For union and interface graphql types
 * the `__resolveType` function of the resolver type is used in the same way.
 */
export type ModelMapping = {
  [R in keyof Resolvers]: '__resolveType' extends keyof GetResolver<R>
    ? GetResolver<R>['__resolveType'] extends (...args: infer P) => unknown
      ? P[0]
      : never
    : '__isTypeOf' extends keyof GetResolver<R>
      ? NonNullable<GetResolver<R>['__isTypeOf']> extends (
          ...args: infer P
        ) => unknown
        ? P[0]
        : never
      : never
}

/**
 * Returns the corresponding type of the revision model for the given repository
 * type.
 */
export type Revision<T extends Model<'AbstractEntity'>['__typename']> =
  Model<`${T}Revision`>

/**
 * Returns the corresponding type of the repository model for the given revision
 * type.
 */
export type Repository<
  R extends Model<'AbstractEntityRevision'>['__typename'],
> = Model<R extends `${infer U}Revision` ? U : never>

/**
 * Resolvers type where all queries of the namespace `Namespaces` are
 * required.
 *
 * @example
 * ```ts
 *   const resolvers : Queries<"subject"> = {
 *     Subject: {
 *       subject: () => { return {} }
 *     },
 *     SubjectQuery: {
 *       ...
 *     }
 *   }
 * ```
 */
export type Queries<Namespaces extends keyof QueryResolvers> = {
  Query: Required<Pick<QueryResolvers, Namespaces>>
} & {
  [P in `${Capitalize<Namespaces>}Query`]: P extends keyof Resolvers
    ? Required<Omit<NonNullable<Resolvers[P]>, '__isTypeOf'>>
    : never
}

/**
 * Resolvers type where all mutations of the namespace `Namespaces` are
 * required.
 *
 * @example
 * ```ts
 *   const resolvers : Mutations<"subscription"> = {
 *     Mutation: {
 *       subscription: () => { return {} }
 *     },
 *     SubscriptionMutation: {
 *       ...
 *     }
 *   }
 * ```
 */
export type Mutations<Namespaces extends keyof MutationResolvers> = {
  Mutation: Required<Pick<MutationResolvers, Namespaces>>
} & {
  [P in `${Capitalize<Namespaces>}Mutation`]: P extends keyof Resolvers
    ? Required<Omit<NonNullable<Resolvers[P]>, '__isTypeOf'>>
    : never
}

/**
 * Resolvers type where all queries `QueryProperties` are required.
 *
 * @example
 * ```ts
 * const resolvers: Query<"uuid" | "activeAuthors"> = {
 *   Query: {
 *     uuid(...) { ... }
 *     activeAuthors(...) { ... }
 *   }
 * }
 * ```
 *
 * TODO: This should not be used any more since all queries shall be moved into
 * namespaces.
 */
export type LegacyQueries<QueryProperties extends keyof QueryResolvers> =
  A.Compute<
    {
      Query: Required<Pick<QueryResolvers, QueryProperties>>
    },
    'deep'
  >

/**
 * Resolvers type where all Interface resolvers in `I` are required.
 *
 * @example
 * ```ts
 * export const resolvers: InterfaceResolvers<"AbstractUuid"> = {
 *   AbstractUuid: {
 *     __resolveType(...) { ... }
 *   }
 * }
 * ```
 */
export type InterfaceResolvers<I extends keyof Resolvers> = Required<
  Pick<Resolvers, I>
>

/**
 * Resolvers type where all resolver `R` and their resolver functions `F`
 * is required. Without specifiying `F` all resolver functions of `R` are
 * required.
 *
 * @example
 * ```ts
 * const resolvers : PickResolvers<"AbstractUuid", | "alias" > = {
 *   alias(...) { ... }
 * }
 * ```
 */
export type PickResolvers<
  R extends keyof Resolvers,
  F = O.OptionalKeys<GetResolver<R>>,
> = Required<PickKeys<GetResolver<R>, F>>

export type ResolverFunction<Result, Parent, Args = object> = Resolver<
  Result,
  Parent,
  Context,
  Args
>

/**
 * Resolvers type with all resolvers for the GraphQL type `T`. All resolver
 * functions are required where either the corresponding property in the model
 * type is missing or the type of the model property does not fit the type of
 * the graphql property.
 *
 * @example
 * ```ts
 * const resolvers : TypeResolvers<User> {
 *   User: {
 *     activeAuthor(...) { ... }
 *     activeReviewer(...) { ... }
 *     ...
 *   }
 * }
 * ```
 */
export type TypeResolvers<T extends { __typename?: keyof Resolvers }> =
  Typename<T> extends keyof Resolvers
    ? A.Compute<
        O.Merge<RequiredResolvers<T>, Pick<Resolvers, Typename<T>>, 'deep'>,
        'deep'
      >
    : never

export type RequiredResolvers<T extends object> = PickRequiredResolvers<{
  [P in Typename<T>]: RequiredResolverFunctions<T>
}>

export type RequiredResolverFunctions<T extends object> =
  Typename<T> extends keyof Resolvers
    ? OmitKeys<
        Required<GetResolver<Typename<T>>>,
        Model<Typename<T>> extends object
          ? O.IntersectKeys<T, Model<Typename<T>>, '<-extends'> | '__isTypeOf'
          : never
      >
    : never

// When the model and the graphql type are the same, the object with all required
// resolver functions will be empty (i.e {}). This type helper filters
// all such empty resolver types since they do not need to be defined.
export type PickRequiredResolvers<O extends object> = O.Filter<
  O,
  object,
  '<-extends'
>

export type GetResolver<Name extends keyof Resolvers> = NonNullable<
  Resolvers[Name]
>

/**
 * A version of `Omit` where the keys do not need to be property names of the
 * object.
 */
export type OmitKeys<O extends object, Keys> = Omit<O, Keys & keyof O>

/**
 * A version of `Pick` where the keys do not need to be property names of the
 * object.
 */
export type PickKeys<O extends object, Keys> = Pick<O, Keys & keyof O>
