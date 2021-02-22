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
import { A } from 'ts-toolbelt'

import {
  License,
  QueryResolvers,
  Resolvers,
  ResolversParentTypes,
  User,
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

export type PickQueryResolvers<
  Properties extends keyof QueryResolvers
> = A.Compute<
  {
    Query: Required<Pick<QueryResolvers, Properties>>
  },
  'deep'
>

export type ResolversFor<TypeNames extends keyof GraphQLTypes> = A.Compute<
  {
    [TypeName in TypeNames]: ResolverFor<TypeName>
  },
  'deep'
>

type ResolverFor<TypeName extends keyof GraphQLTypes> = {
  [Property in keyof GetResolvers<TypeName> &
    RequiredResolverMethodNames<TypeName>]: GetResolvers<TypeName>[Property]
} &
  GetResolvers<TypeName>

type GetResolvers<TypeName extends keyof GraphQLTypes> = NonNullable<
  Resolvers[TypeName]
>

type RequiredResolverMethodNames<
  TypeName extends keyof GraphQLTypes
> = IncompatibleProperties<
  GraphQLTypes[TypeName],
  ResolversParentTypes[TypeName]
>
type IncompatibleProperties<GraphQLType, ModelType> = {
  [Property in keyof GraphQLType]: Property extends keyof ModelType
    ? ModelType[Property] extends GraphQLType[Property]
      ? never
      : Property
    : Property
}[keyof GraphQLType]

interface GraphQLTypes {
  License: License
  User: User
}
