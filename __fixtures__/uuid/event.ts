import { user } from './user'
import { licenseId } from '../license-id'
import { Model } from '~/internals/graphql'
import {
  castToAlias,
  castToNonEmptyString,
  castToUuid,
  EntityRevisionType,
  EntityType,
} from '~/model/decoder'
import { Instance } from '~/types'

export const event: Model<'Event'> = {
  __typename: EntityType.Event,
  id: castToUuid(35554),
  trashed: false,
  instance: Instance.De,
  alias: castToAlias('/mathe/35554/beispielveranstaltung'),
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: castToUuid(35555),
  revisionIds: [35555].map(castToUuid),
  licenseId,
  taxonomyTermIds: [5].map(castToUuid),
  canonicalSubjectId: castToUuid(5),
}

export const eventRevision: Model<'EventRevision'> = {
  __typename: EntityRevisionType.EventRevision,
  id: castToUuid(35555),
  trashed: false,
  alias: castToAlias('/mathe/35555/beispielveranstaltung'),
  date: '2014-09-15T15:28:35Z',
  authorId: user.id,
  repositoryId: event.id,
  title: 'title',
  content: castToNonEmptyString('content'),
  changes: 'changes',
  metaDescription: 'metaDescription',
  metaTitle: 'metaTitle',
}
