import * as R from 'ramda'

import {
  DiscriminatorType,
  PagePayload,
  PageRevisionPayload,
} from '../../src/graphql/schema'
import { Instance } from '../../src/types'
import { license } from '../license'

export const page: PagePayload = {
  __typename: DiscriminatorType.Page,
  id: 19767,
  trashed: false,
  instance: Instance.De,
  alias: '/mathe',
  currentRevisionId: 35476,
  licenseId: license.id,
}

export const pageRevision: PageRevisionPayload = {
  __typename: DiscriminatorType.PageRevision,
  id: 35476,
  trashed: false,
  title: 'title',
  content: 'content',
  date: '2015-02-28T02:06:40Z',
  authorId: 1,
  repositoryId: page.id,
}

export function getPageDataWithoutSubResolvers(page: PagePayload) {
  return R.omit(['currentRevisionId', 'licenseId', 'taxonomyTermIds'], page)
}

export function getPageRevisionDataWithoutSubResolvers(
  pageRevision: PageRevisionPayload
) {
  return R.omit(['authorId', 'repositoryId'], pageRevision)
}
