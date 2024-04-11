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
  value: unknown,
): value is { __typename: (typeof validTypes)[number] } {
  return (
    R.has('__typename', value) &&
    typeof value.__typename === 'string' &&
    isSupportedUuidType(value.__typename)
  )
}

function isSupportedUuidType(name: string) {
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
  dataSources: Context['dataSources'],
): Promise<string> {
  if (uuid.__typename === DiscriminatorType.User) return uuid.username
  if (uuid.__typename === DiscriminatorType.TaxonomyTerm) return uuid.name
  if (t.type({ title: t.string }).is(uuid)) return uuid.title
  if (
    uuid.__typename === EntityType.Applet ||
    uuid.__typename === EntityType.Article ||
    uuid.__typename === EntityType.Course ||
    uuid.__typename === EntityType.CoursePage ||
    uuid.__typename === EntityType.Event ||
    uuid.__typename === EntityType.Page ||
    uuid.__typename === EntityType.Video
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
    (uuid.__typename === EntityType.Exercise ||
      uuid.__typename === EntityType.ExerciseGroup) &&
    uuid.taxonomyTermIds.length > 0
  )
    return uuid.taxonomyTermIds[0]

  return null
}
