import { array as A, function as F, number as N, ord } from 'fp-ts'
import * as t from 'io-ts'
import R from 'ramda'

import { getDefaultLicense, licenses } from '~/config'
import { captureErrorEvent } from '~/internals/error-event'
import {
  Model,
  PickResolvers,
  Repository,
  ResolverFunction,
  Revision,
} from '~/internals/graphql'
import { UserDecoder } from '~/model/decoder'
import { Connection } from '~/schema/connection/types'
import { resolveConnection } from '~/schema/connection/utils'
import { createThreadResolvers } from '~/schema/thread/utils'
import { createUuidResolvers } from '~/schema/uuid/abstract-uuid/utils'
import { VideoRevisionsArgs } from '~/types'

export function createRepositoryResolvers<R extends Model<'AbstractRevision'>>({
  revisionDecoder,
}: {
  revisionDecoder: t.Type<R, unknown>
}): PickResolvers<
  'AbstractRepository',
  'alias' | 'threads' | 'license' | 'events' | 'title'
> & {
  currentRevision: ResolverFunction<
    R | null,
    Repository<Model<'AbstractRevision'>['__typename']>
  >
  revisions: ResolverFunction<
    Connection<R>,
    Repository<Model<'AbstractRevision'>['__typename']>,
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
            })
          )
        ),
        A.filter(
          (revision) => R.isNil(cursorPayload.unrevised) || !revision.trashed
        )
      )
      return resolveConnection<R>({
        nodes: revisions,
        payload: cursorPayload,
        createCursor(node) {
          return node.id.toString()
        },
      })
    },
    license(repository, _args) {
      const license =
        licenses.find((license) => license.id === repository.licenseId) ?? null

      if (license === null) {
        captureErrorEvent({
          error: new Error('Could not find license, using default'),
          errorContext: { licenseId: repository.licenseId, repository },
        })
        return getDefaultLicense(repository.instance)
      }

      return license
    },
  }
}

export function createRevisionResolvers<E extends Model<'AbstractRepository'>>({
  repositoryDecoder,
}: {
  repositoryDecoder: t.Type<E, unknown>
}): PickResolvers<
  'AbstractRevision',
  'alias' | 'threads' | 'author' | 'events' | 'title'
> & {
  repository: ResolverFunction<
    E,
    Revision<Model<'AbstractRepository'>['__typename']>
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
