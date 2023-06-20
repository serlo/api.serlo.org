import { user } from './user'
import { license } from '../license'
import { Model } from '~/internals/graphql'
import {
  castToAlias,
  castToNonEmptyString,
  castToUuid,
  EntityRevisionType,
  EntityType,
} from '~/model/decoder'
import { Instance } from '~/types'

export const applet: Model<'Applet'> = {
  __typename: EntityType.Applet,
  id: castToUuid(35596),
  trashed: false,
  instance: Instance.En,
  alias: castToAlias('/math/35596/example-applet'),
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: castToUuid(35597),
  revisionIds: [35597].map(castToUuid),
  licenseId: license.id,
  canonicalSubjectId: castToUuid(23593),
  taxonomyTermIds: [5].map(castToUuid),
}

export const appletRevision: Model<'AppletRevision'> = {
  __typename: EntityRevisionType.AppletRevision,
  id: castToUuid(35597),
  trashed: false,
  alias: castToAlias('/math/35597/example-applet'),
  date: '2014-09-15T15:28:35Z',
  authorId: user.id,
  repositoryId: applet.id,
  url: 'url',
  title: 'title',
  content: castToNonEmptyString('content'),
  changes: 'changes',
  metaDescription: 'metaDescription',
  metaTitle: 'metaTitle',
}
