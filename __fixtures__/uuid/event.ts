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

import {
  EntityRevisionType,
  EntityType,
  EventPayload,
  EventRevisionPayload,
} from '../../src/graphql/schema'
import { Instance } from '../../src/types'
import { license } from '../license'

export const event: EventPayload = {
  __typename: EntityType.Event,
  id: 35554,
  trashed: false,
  instance: Instance.De,
  alias: '/mathe/beispielinhalte/beispielveranstaltung',
  date: '2014-03-01T20:45:56Z',
  currentRevisionId: 35555,
  revisionIds: [35555],
  licenseId: license.id,
  taxonomyTermIds: [5],
}

export const eventRevision: EventRevisionPayload = {
  __typename: EntityRevisionType.EventRevision,
  id: 35555,
  trashed: false,
  date: '2014-09-15T15:28:35Z',
  authorId: 1,
  repositoryId: event.id,
  title: 'title',
  content: 'content',
  changes: 'changes',
  metaDescription: 'metaDescription',
  metaTitle: 'metaTitle',
}

export function getEventDataWithoutSubResolvers(event: EventPayload) {
  return R.omit(
    [
      'alias',
      'currentRevisionId',
      'revisionIds',
      'licenseId',
      'taxonomyTermIds',
    ],
    event
  )
}

export function getEventRevisionDataWithoutSubResolvers(
  eventRevision: EventRevisionPayload
) {
  return R.omit(['alias', 'authorId', 'repositoryId'], eventRevision)
}
