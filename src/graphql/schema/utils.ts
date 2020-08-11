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

export function requestsOnlyFields(
  type: string,
  fields: string[],
  info: GraphQLResolveInfo
): boolean {
  const res = parseResolveInfo(info)
  return !res || R.isEmpty(R.omit(fields, res.fieldsByTypeName[type]))
}

export class LegacySchema {
  public constructor(
    public resolvers = {},
    public typeDefs: DocumentNode[] = []
  ) {}
}

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
    subResolvers
  )
  const subTypeDefs = R.map((schema) => schema.typeDefs, schemas)
  const typeDefs = R.flatten(subTypeDefs)
  return { resolvers, typeDefs }
}

/**
 * Function for finding the key of a string Enum by its value.
 * TypeScript doesn't support natively reverse mapping of string enums,
 * with this function you can find its key by its value. If it is not
 * found, function returns undefined
 * @param value The value of a key to be searched at the string Enum
 * @param strEnum A reference to the string Enum
 */
export function reverseMapStrEnum<E, K extends keyof E>(
  value: string,
  strEnum: any
): E | undefined {
  const enumKeys = Object.keys(strEnum).filter((k) => Number.isNaN(+k)) as K[]
  for (const key of enumKeys) {
    if (value === strEnum[key]) {
      return strEnum[key]
    }
  }
}
