import { array as A, function as F, number as N, ord } from 'fp-ts'
import * as t from 'io-ts'
import * as R from 'ramda'

import {
  Model,
  PickResolvers,
  Repository,
  ResolverFunction,
  Revision,
} from '~/internals/graphql'
import { EntityRevisionType, EntityType, UserDecoder } from '~/model/decoder'
import { Connection } from '~/schema/connection/types'
import { resolveConnection } from '~/schema/connection/utils'
import { createThreadResolvers } from '~/schema/thread/utils'
import { createUuidResolvers } from '~/schema/uuid/abstract-uuid/utils'
import { VideoRevisionsArgs } from '~/types'

export function createEntityResolvers<
  R extends Model<'AbstractEntityRevision'>,
>({
  revisionDecoder,
}: {
  revisionDecoder: t.Type<R, unknown>
}): PickResolvers<
  'AbstractEntity',
  'alias' | 'threads' | 'licenseId' | 'events' | 'subject' | 'title'
> &
  PickResolvers<'AbstractEntity', 'threads'> & {
    currentRevision: ResolverFunction<
      R | null,
      Repository<Model<'AbstractEntityRevision'>['__typename']>
    >
    revisions: ResolverFunction<
      Connection<R>,
      Repository<Model<'AbstractEntityRevision'>['__typename']>,
      VideoRevisionsArgs
    >
  } {
  return {
    ...createUuidResolvers(),
    ...createThreadResolvers(),
    async currentRevision(entity, _args, { dataSources }) {
      if (!entity.currentRevisionId) return null
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: entity.currentRevisionId,
        decoder: revisionDecoder,
      })
    },
    async revisions(entity, cursorPayload, { dataSources }) {
      const revisions = F.pipe(
        await Promise.all(
          F.pipe(
            entity.revisionIds,
            A.sort(ord.reverse(N.Ord)),
            A.filter((revisionId) => {
              if (R.isNil(cursorPayload.unrevised)) return true

              const isUnrevised =
                entity.currentRevisionId === null ||
                revisionId > entity.currentRevisionId
              return cursorPayload.unrevised ? isUnrevised : !isUnrevised
            }),
            A.map(async (id) => {
              return await dataSources.model.serlo.getUuidWithCustomDecoder({
                id,
                decoder: revisionDecoder,
              })
            }),
          ),
        ),
        A.filter(
          (revision) => R.isNil(cursorPayload.unrevised) || !revision.trashed,
        ),
      )
      return resolveConnection<R>({
        nodes: revisions,
        payload: cursorPayload,
        createCursor(node) {
          return node.id.toString()
        },
      })
    },
    licenseId(repository, _args) {
      return repository.licenseId
    },
    subject(entity) {
      if (entity.__typename === EntityType.Page) return null
      return entity.canonicalSubjectId
        ? { taxonomyTermId: entity.canonicalSubjectId }
        : null
    },
  }
}

export function createEntityRevisionResolvers<
  E extends Model<'AbstractEntity'>,
>({
  repositoryDecoder,
}: {
  repositoryDecoder: t.Type<E, unknown>
}): PickResolvers<
  'AbstractEntityRevision',
  'alias' | 'threads' | 'author' | 'events' | 'title'
> & {
  repository: ResolverFunction<
    E,
    Revision<Model<'AbstractEntity'>['__typename']>
  >
} {
  return {
    ...createUuidResolvers(),
    ...createThreadResolvers(),
    async author(entityRevision, _args, { dataSources }) {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: entityRevision.authorId,
        decoder: UserDecoder,
      })
    },
    repository: async (entityRevision, _args, { dataSources }) => {
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: entityRevision.repositoryId,
        decoder: repositoryDecoder,
      })
    },
  }
}

export function fromEntityTypeToEntityRevisionType(
  entityType: EntityType,
): EntityRevisionType {
  switch (entityType) {
    case EntityType.Applet:
      return EntityRevisionType.AppletRevision
    case EntityType.Article:
      return EntityRevisionType.ArticleRevision
    case EntityType.Course:
      return EntityRevisionType.CourseRevision
    case EntityType.CoursePage:
      return EntityRevisionType.CoursePageRevision
    case EntityType.Event:
      return EntityRevisionType.EventRevision
    case EntityType.Exercise:
      return EntityRevisionType.ExerciseRevision
    case EntityType.ExerciseGroup:
      return EntityRevisionType.ExerciseGroupRevision
    case EntityType.Video:
      return EntityRevisionType.VideoRevision
    case EntityType.Page:
      return EntityRevisionType.PageRevision
  }
}
