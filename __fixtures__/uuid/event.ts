import { user } from './user'
import { licenseId } from '../license-id'
import { Model } from '~/internals/graphql'
import {
  castToNonEmptyString,
  EntityRevisionType,
  EntityType,
} from '~/model/decoder'
import { Instance } from '~/types'

export const event: Model<'Event'> = {
  __typename: EntityType.Event,
  id: 35554,
  trashed: false,
  instance: Instance.De,
  alias: '/mathe/35554/beispielveranstaltung',
  date: '2019-12-02T22:40:41.000Z',
  currentRevisionId: 35555,
  revisionIds: [35555],
  licenseId,
  taxonomyTermIds: [5],
  canonicalSubjectId: 5,
}

export const eventRevision: Model<'EventRevision'> = {
  __typename: EntityRevisionType.EventRevision,
  id: 35555,
  trashed: false,
  alias: '/mathe/35555/beispielveranstaltung',
  date: '2014-09-15T15:28:35Z',
  authorId: user.id,
  repositoryId: event.id,
  title: 'title',
  content: castToNonEmptyString('content'),
  changes: 'changes',
  metaDescription: 'metaDescription',
  metaTitle: 'metaTitle',
}
