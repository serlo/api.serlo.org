import * as t from 'io-ts'
import * as R from 'ramda'

import { UuidResolver } from './resolvers'
import { Context } from '~/context'
import { Model } from '~/internals/graphql'
import { DiscriminatorType, EntityType, UuidDecoder } from '~/model/decoder'
import { createAliasResolvers } from '~/schema/uuid/alias/utils'
import { AbstractUuidResolvers } from '~/types'

export function createUuidResolvers(): Pick<
  AbstractUuidResolvers,
  'alias' | 'title'
> {
  return {
    ...createAliasResolvers(),
    title(uuid, _, context) {
      return getTitle(uuid, context)
    },
  }
}

async function getTitle(
  uuid: Model<'AbstractUuid'>,
  context: Context,
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
      const revision = await UuidResolver.resolve({ id: revisionId }, context)

      if (t.type({ title: t.string }).is(revision)) {
        return revision.title
      }
    }
  }

  const parentId = getParentId(uuid)

  if (parentId) {
    const parentUuid = await UuidResolver.resolveWithDecoder(
      UuidDecoder,
      { id: parentId },
      context,
    )
    return getTitle(parentUuid, context)
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
