import * as t from 'io-ts'

import {
  Model,
  PickResolvers,
  Repository,
  ResolverFunction,
} from '~/internals/graphql'
import { EntityRevisionType, EntityType } from '~/model/decoder'
import { Connection } from '~/schema/connection/types'
import { createRepositoryResolvers } from '~/schema/uuid/abstract-repository/utils'
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
  // TODO: Add threads to "AbstractEntity"
  PickResolvers<'AbstractRepository', 'threads'> & {
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
    ...createRepositoryResolvers({ revisionDecoder }),
    subject(entity) {
      return entity.canonicalSubjectId
        ? { taxonomyTermId: entity.canonicalSubjectId }
        : null
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
  }
}
