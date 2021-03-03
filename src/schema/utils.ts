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

import {
  License,
  QueryResolvers,
  Resolvers,
  ResolversParentTypes,
} from '~/types'

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
 * Resolvers type with all resolvers in the union `TypeNames`. All resolvers
 * functions are required where either its corresponding property is missing
 * in the model type or the type of the model type does not fit the type of
 * the graphql type.
 *
 * You need to add the GraphQL type to the interface {@link GraphQLTypes} in
 * order to use this feature.
 */
export type TypeResolvers<TypeNames extends PossibleTypeNames> = A.Compute<
  O.MergeUp<RequiredResolvers<TypeNames>, Pick<Resolvers, TypeNames>, 'deep'>,
  'deep'
>
type RequiredResolvers<
  TypeNames extends PossibleTypeNames
> = PickRequiredResolvers<
  {
    [TypeName in TypeNames]: RequiredResolverFunctions<TypeName>
  }
>
type RequiredResolverFunctions<T extends PossibleTypeNames> = OmitKeys<
  Resolver<T>,
  | O.IntersectKeys<GraphQLTypes[T], ResolversParentTypes[T], '<-extends'>
  | '__isTypeOf'
>
// When the model and the graphql type are the same, the object with all required
// resolver functions will be empty. This type function filters all such
// empty resolver types.
type PickRequiredResolvers<O extends object> = O.Filter<O, object, '<-extends'>

type PossibleTypeNames = keyof Resolvers &
  keyof ResolversParentTypes &
  keyof GraphQLTypes
type Resolver<T extends PossibleTypeNames> = Required<NonNullable<Resolvers[T]>>

interface GraphQLTypes {
  License: License
}

/**
 * A version of `Omit` where the keys do not need to be property names of the
 * object.
 */
type OmitKeys<O extends object, Keys extends string> = Omit<O, Keys & keyof O>
