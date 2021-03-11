/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { AuthenticationError } from 'apollo-server'
import { A, O } from 'ts-toolbelt'

import { Context } from '~/internals/graphql'
import { ModelOf, Typename } from '~/model'
import { MutationResolvers, QueryResolvers, Resolver, Resolvers } from '~/types'

export function assertUserIsAuthenticated(
  user: number | null
): asserts user is number {
  if (user === null) throw new AuthenticationError('You are not logged in')
}

export function createMutationNamespace() {
  return () => {
    return {}
  }
}

/**
 * Given the name `M` of a graphql type `Model<M>` returns the model type of the
 * graphql type with the name `M`. In case `M` is the name of a union or an
 * interface the union of all model types are returned whose corresponding
 * graphql types are in the union or implement the interface.
 *
 * @example
 *
 *   type ThreadModel = Model<"Thread">
 *   type UuidPayload = Model<"AbstractUuid">
 */
export type Model<M extends keyof ModelMapping> = NonNullable<ModelMapping[M]>

/**
 * Mapping between graphql type names and their model types:
 *
 *   ModelMapping = {
 *     User: { id: number, username: string, ... }
 *     ArticleRevision: { id: number, authorId: number, ... }
 *     ...
 *     AbstractRevision: | ModelMapping["ArticleRevision"]
 *                       | ModelMapping["CourseRevision"]
 *                       | ...
 *     ...
 *   }
 *
 * Here we use, that for each concrete graphql type there is a `__isTypeOf`
 * function in the generated resolver type whose first parameter is the parent
 * and thus has the model type of the concrete graphql type. This first
 * parameter is used for the mapping. For union and interface graphql types
 * the `__resolveType` function of the resolver type is used in the same way.
 */
type ModelMapping = {
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
 * Resolvers type for all mutations of the namespaces `Namespaces`.
 */
export type Mutations<Namespaces extends keyof MutationResolvers> = {
  Mutation: Required<Pick<MutationResolvers, Namespaces>>
} & {
  [P in `${Capitalize<Namespaces>}Mutation`]: P extends keyof Resolvers
    ? Required<Omit<NonNullable<Resolvers[P]>, '__isTypeOf'>>
    : never
}

/**
 * Resolvers type where all query properties in `QueryProperties` are
 * required.
 */
export type Querys<QueryProperties extends keyof QueryResolvers> = A.Compute<
  {
    Query: Required<Pick<QueryResolvers, QueryProperties>>
  },
  'deep'
>

/**
 * Resolver helper type for implementing all Interface resolvers of type `I`
 *
 * @example
 *
 *   export const resolvers: InterfaceResolvers<"AbstractUuid"> = {
 *     AbstractUuid: {
 *      ...
 *     }
 *   }
 */
export type InterfaceResolvers<I extends keyof Resolvers> = Required<
  Pick<Resolvers, I>
>

/**
 * Resolvers type with all resolvers for the GraphQL type `T`. All resolver
 * functions are required where either the corresponding property in the model
 * type is missing or the type of the model property does not fit the type of
 * the graphql property.
 */
export type TypeResolvers<
  T extends { __typename?: keyof Resolvers }
> = Typename<T> extends keyof Resolvers
  ? A.Compute<
      O.MergeUp<RequiredResolvers<T>, Pick<Resolvers, Typename<T>>, 'deep'>,
      'deep'
    >
  : never

type RequiredResolvers<T extends object> = PickRequiredResolvers<
  {
    [P in Typename<T>]: RequiredResolverFunctions<T>
  }
>

type RequiredResolverFunctions<
  T extends object
> = Typename<T> extends keyof Resolvers
  ? OmitKeys<
      Required<GetResolver<Typename<T>>>,
      ModelOf<T> extends object
        ? O.IntersectKeys<T, ModelOf<T>, '<-extends'> | '__isTypeOf'
        : never
    >
  : never

// When the model and the graphql type are the same, the object with all required
// resolver functions will be empty (i.e {}). This type helper filters
// all such empty resolver types since they do not need to be defined.
type PickRequiredResolvers<O extends object> = O.Filter<O, object, '<-extends'>

export type PickResolvers<
  R extends keyof Resolvers,
  F = O.OptionalKeys<GetResolver<R>>
> = Required<PickKeys<GetResolver<R>, F>>

// eslint-disable-next-line @typescript-eslint/ban-types
export type ResolverFunction<Result, Parent, Args = {}> = Resolver<
  Result,
  Parent,
  Context,
  Args
>

type GetResolver<Name extends keyof Resolvers> = NonNullable<Resolvers[Name]>

/**
 * A version of `Omit` where the keys do not need to be property names of the
 * object.
 */
type OmitKeys<O extends object, Keys> = Omit<O, Keys & keyof O>

/**
 * A version of `Pick` where the keys do not need to be property names of the
 * object.
 */
type PickKeys<O extends object, Keys> = Pick<O, Keys & keyof O>
