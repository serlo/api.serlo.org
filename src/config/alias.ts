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
import * as R from 'ramda'

import { Instance, QueryUuidArgs } from '~/types'

export type AliasConfig = {
  [instance in Instance]?: Partial<Record<string, number>>
}

// Custom aliases that take precedence over any alias defined in serlo.org
export const aliases: AliasConfig = {
  [Instance.De]: {
    '/mathe': 19767,
    '/serlo': 18922,
  },
}

export function lookupCustomAlias(payload: {
  instance: Instance
  id: number
}): string | null {
  const instanceAliasConfig = aliases[payload.instance] ?? {}
  const possibleCustomAlias = R.find(([_path, id]) => {
    return id === payload.id
  }, R.toPairs(instanceAliasConfig))
  return possibleCustomAlias?.[0] ?? null
}

export function resolveCustomId({
  instance,
  path,
}: NonNullable<QueryUuidArgs['alias']>): number | null {
  const instanceAliasConfig = aliases[instance]
  const possibleId = instanceAliasConfig?.[path]
  return typeof possibleId === 'number' ? possibleId : null
}
