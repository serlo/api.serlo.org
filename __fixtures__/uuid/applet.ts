/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import * as R from 'ramda'

import { license } from '../license'
import {
  AppletPayload,
  AppletRevisionPayload,
  EntityRevisionType,
  EntityType,
} from '~/schema/uuid'
import { Instance } from '~/types'

export const applet: AppletPayload = {
  __typename: EntityType.Applet,
  id: 35596,
  trashed: false,
  instance: Instance.En,
  alias: '/math/example-content/example-topic-1/example-applet',
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: 35597,
  revisionIds: [35597],
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
  return R.omit(
    ['currentRevisionId', 'revisionIds', 'licenseId', 'taxonomyTermIds'],
    applet
  )
}

export function getAppletRevisionDataWithoutSubResolvers(
  appletRevision: AppletRevisionPayload
) {
  return R.omit(['authorId', 'repositoryId'], appletRevision)
}
