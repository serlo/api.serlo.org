/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { DocumentNode, GraphQLResolveInfo } from 'graphql'
import { parseResolveInfo } from 'graphql-parse-resolve-info'
import * as R from 'ramda'

import { Resolver, LegacyResolvers } from './types'

export function requestsOnlyFields(
  type: string,
  fields: string[],
  info: GraphQLResolveInfo
): boolean {
  const res = parseResolveInfo(info)
  return !res || R.isEmpty(R.omit(fields, res.fieldsByTypeName[type]))
}

export function combineResolvers(...resolvers: LegacyResolvers[]) {
  return R.reduce<{}, {}>(R.mergeDeepRight, {}, resolvers)
}

export class Resolvers {
  public resolvers: Record<
    string,
    Record<string, Resolver<any, any, any>> & {
      __resolveType?(type: any): string
    }
  > = {
    Query: {},
    Mutation: {},
  }

  public addTypeResolver<T>(type: string, resolver: (type: T) => string) {
    this.resolvers[type] = this.resolvers[type] || {}
    this.resolvers[type]['__resolveType'] = resolver
  }

  public addQuery<P, A, T>(name: string, resolver: Resolver<P, A, T>) {
    this.resolvers.Query[name] = resolver
  }

  public addMutation<P, A, T>(name: string, resolver: Resolver<P, A, T>) {
    this.resolvers.Mutation[name] = resolver
  }

  public add<P, A, T>(type: string, name: string, resolver: Resolver<P, A, T>) {
    this.resolvers[type] = this.resolvers[type] || {}
    this.resolvers[type][name] = resolver
  }
}

export class TypeDefs {
  public typeDefs: DocumentNode[] = []

  public add(typeDef: DocumentNode) {
    this.typeDefs.push(typeDef)
  }
}
