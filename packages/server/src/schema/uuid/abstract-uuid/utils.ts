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
import * as t from 'io-ts'
import * as R from 'ramda'

import { Context, Model, PickResolvers } from '~/internals/graphql'
import {
  DiscriminatorType,
  EntityRevisionType,
  EntityType,
  UuidDecoder,
} from '~/model/decoder'
import { resolveEvents } from '~/schema/notification/resolvers'
import { createAliasResolvers } from '~/schema/uuid/alias/utils'

const validTypes = [
  ...Object.values(DiscriminatorType),
  ...Object.values(EntityType),
  ...Object.values(EntityRevisionType),
]

export function isSupportedUuid(
  value: unknown
): value is { __typename: (typeof validTypes)[number] } {
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
  'alias' | 'events' | 'title'
> {
  return {
    ...createAliasResolvers(),
    title(uuid, _, { dataSources }) {
      return getTitle(uuid, dataSources)
    },
    events(uuid, payload, { dataSources }) {
      return resolveEvents({
        payload: { ...payload, objectId: uuid.id },
        dataSources,
      })
    },
  }
}

async function getTitle(
  uuid: Model<'AbstractUuid'>,
  dataSources: Context['dataSources']
): Promise<string> {
  if (uuid.__typename === 'User') return uuid.username
  if (uuid.__typename === 'TaxonomyTerm') return uuid.name
  if (t.type({ title: t.string }).is(uuid)) return uuid.title
  if (
    uuid.__typename === 'Applet' ||
    uuid.__typename === 'Article' ||
    uuid.__typename === 'Course' ||
    uuid.__typename === 'CoursePage' ||
    uuid.__typename === 'Event' ||
    uuid.__typename === 'Page' ||
    uuid.__typename === 'Video'
  ) {
    const revisionId = uuid.currentRevisionId ?? R.head(uuid.revisionIds)

    if (revisionId) {
      const revision = await dataSources.model.serlo.getUuid({ id: revisionId })

      if (t.type({ title: t.string }).is(revision)) {
        return revision.title
      }
    }
  }

  const parentId = getParentId(uuid)

  if (parentId) {
    const parentUuid = await dataSources.model.serlo.getUuidWithCustomDecoder({
      id: parentId,
      decoder: UuidDecoder,
    })
    return getTitle(parentUuid, dataSources)
  }

  return uuid.id.toString()
}

function getParentId(uuid: Model<'AbstractUuid'>) {
  if (t.type({ parentId: t.number }).is(uuid)) return uuid.parentId
  if (t.type({ repositoryId: t.number }).is(uuid)) return uuid.repositoryId
  if (
    (uuid.__typename === 'Exercise' || uuid.__typename === 'ExerciseGroup') &&
    uuid.taxonomyTermIds.length > 0
  )
    return uuid.taxonomyTermIds[0]

  return null
}
