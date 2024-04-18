import { array as A, function as F, number as N, ord } from 'fp-ts'
import * as t from 'io-ts'
import * as R from 'ramda'

import { Context } from '~/context'
import { Model } from '~/internals/graphql'
import { EntityRevisionType, EntityType, UserDecoder } from '~/model/decoder'
import { Connection } from '~/schema/connection/types'
import { resolveConnection } from '~/schema/connection/utils'
import { createThreadResolvers } from '~/schema/thread/utils'
import { createUuidResolvers } from '~/schema/uuid/abstract-uuid/utils'
import {
  AbstractEntityResolvers,
  AbstractEntityRevisionResolvers,
  AppletRevisionsArgs,
  ResolverFn,
} from '~/types'

export function createEntityResolvers<
  Repository extends Model<'AbstractEntity'>,
  Revision extends Model<'AbstractEntityRevision'>,
>({
  revisionDecoder,
}: {
  revisionDecoder: t.Type<Revision, unknown>
}): Pick<
  AbstractEntityResolvers,
  'alias' | 'threads' | 'licenseId' | 'events' | 'title'
> & {
  currentRevision: ResolverFn<Revision | null, Repository, Context, unknown>
  revisions: ResolverFn<
    Connection<Revision>,
    Repository,
    Context,
    AppletRevisionsArgs
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
      return resolveConnection({
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
  }
}

export function createEntityRevisionResolvers<
  Repository extends Model<'AbstractEntityRevision'>,
  Revision extends Model<'AbstractEntityRevision'>,
>({
  repositoryDecoder,
}: {
  repositoryDecoder: t.Type<Repository, unknown>
}): Pick<
  AbstractEntityRevisionResolvers,
  'alias' | 'threads' | 'author' | 'events' | 'title'
> & { repository: ResolverFn<Repository, Revision, Context, unknown> } {
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
