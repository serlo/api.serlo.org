/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import * as R from 'ramda'

import { PickResolvers } from '~/internals/graphql'
import {
  DiscriminatorType,
  EntityRevisionType,
  EntityType,
} from '~/model/decoder'
import { resolveEvents } from '~/schema/notification/resolvers'
import { createAliasResolvers } from '~/schema/uuid/alias/utils'

const validTypes = [
  ...Object.values(DiscriminatorType),
  ...Object.values(EntityType),
  ...Object.values(EntityRevisionType),
]

export function isSupportedUuid(value: unknown) {
  return (
    R.has('__typename', value) &&
    typeof value.__typename === 'string' &&
    isSupportedUuidType(value.__typename)
  )
}

export function isSupportedUuidType(name: string) {
  return R.includes(name, validTypes)
}

export function createUuidResolvers(): PickResolvers<
  'AbstractUuid',
  'alias' | 'events'
> {
  return {
    ...createAliasResolvers(),
    events(uuid, payload, { dataSources }) {
      return resolveEvents({
        payload: { ...payload, objectId: uuid.id },
        dataSources,
      })
    },
  }
}
