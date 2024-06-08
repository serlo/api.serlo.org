import { user } from './user'
import { licenseId } from '../license-id'
import { Model } from '~/internals/graphql'
import {
  castToNonEmptyString,
  EntityRevisionType,
  EntityType,
} from '~/model/decoder'
import { Instance } from '~/types'

export const applet: Model<'Applet'> = {
  __typename: EntityType.Applet,
  id: 35596,
  trashed: false,
  instance: Instance.En,
  alias: '/math/35596/example-applet',
  date: '2020-01-29T17:47:19.000Z',
  currentRevisionId: 35597,
  revisionIds: [35597],
  licenseId,
  canonicalSubjectId: 23593,
  taxonomyTermIds: [5],
}

export const appletRevision: Model<'AppletRevision'> = {
  __typename: EntityRevisionType.AppletRevision,
  id: 35597,
  trashed: false,
  alias: '/math/35597/example-applet',
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
