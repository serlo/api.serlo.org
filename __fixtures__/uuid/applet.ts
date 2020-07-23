import * as R from 'ramda'

import {
  AppletPayload,
  AppletRevisionPayload,
  EntityRevisionType,
  EntityType,
} from '../../src/graphql/schema'
import { Instance } from '../../src/types'
import { license } from '../license'

export const applet: AppletPayload = {
  __typename: EntityType.Applet,
  id: 35596,
  trashed: false,
  instance: Instance.En,
  alias: '/math/example-content/example-topic-1/example-applet',
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: 35597,
  licenseId: license.id,
  taxonomyTermIds: [5],
}

export const appletRevision: AppletRevisionPayload = {
  __typename: EntityRevisionType.AppletRevision,
  id: 35597,
  trashed: false,
  date: '2014-09-15T15:28:35Z',
  authorId: 1,
  repositoryId: applet.id,
  url: 'url',
  title: 'title',
  content: 'content',
  changes: 'changes',
  metaDescription: 'metaDescription',
  metaTitle: 'metaTitle',
}

export function getAppletDataWithoutSubResolvers(applet: AppletPayload) {
  return R.omit(['currentRevisionId', 'licenseId', 'taxonomyTermIds'], applet)
}

export function getAppletRevisionDataWithoutSubResolvers(
  appletRevision: AppletRevisionPayload
) {
  return R.omit(['authorId', 'repositoryId'], appletRevision)
}
