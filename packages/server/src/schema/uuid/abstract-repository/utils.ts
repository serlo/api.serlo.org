import { array as A, function as F, number as N, ord } from 'fp-ts'
import * as t from 'io-ts'
import * as R from 'ramda'

import { UuidResolver } from '../abstract-uuid/resolvers'
import { Context } from '~/context'
import { Model } from '~/internals/graphql'
import { UserDecoder } from '~/model/decoder'
import { Connection } from '~/schema/connection/types'
import { resolveConnection } from '~/schema/connection/utils'
import { createThreadResolvers } from '~/schema/thread/utils'
import { createUuidResolvers } from '~/schema/uuid/abstract-uuid/utils'
import {
  AbstractRepositoryResolvers,
  ResolverFn,
  AppletRevisionsArgs,
  AbstractRevisionResolvers,
} from '~/types'

export function createRepositoryResolvers<
  Repository extends Model<'AbstractRepository'>,
  Revision extends Model<'AbstractRevision'>,
>({
  revisionDecoder,
}: {
  revisionDecoder: t.Type<Revision, unknown>
}): Pick<
  AbstractRepositoryResolvers,
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
    async currentRevision(entity, _args, context) {
      if (!entity.currentRevisionId) return null
      return await UuidResolver.resolveWithDecoder(
        revisionDecoder,
        { id: entity.currentRevisionId },
        context,
      )
    },
    async revisions(entity, cursorPayload, context) {
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
            A.map((id) =>
              UuidResolver.resolveWithDecoder(revisionDecoder, { id }, context),
            ),
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

export function createRevisionResolvers<
  Repository extends Model<'AbstractRepository'>,
  Revision extends Model<'AbstractRevision'>,
>({
  repositoryDecoder,
}: {
  repositoryDecoder: t.Type<Repository, unknown>
}): Pick<
  AbstractRevisionResolvers,
  'alias' | 'threads' | 'author' | 'events' | 'title'
> & {
  repository: ResolverFn<Repository, Revision, Context, unknown>
} {
  return {
    ...createUuidResolvers(),
    ...createThreadResolvers(),
    author(entityRevision, _args, context) {
      return UuidResolver.resolveWithDecoder(
        UserDecoder,
        { id: entityRevision.authorId },
        context,
      )
    },
    repository: async (entityRevision, _args, context) => {
      return UuidResolver.resolveWithDecoder(
        repositoryDecoder,
        { id: entityRevision.repositoryId },
        context,
      )
    },
  }
}
