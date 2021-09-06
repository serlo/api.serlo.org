/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { Model } from '~/internals/graphql'
import { Payload } from '~/internals/model'
import { castToAlias, castToUuid, DiscriminatorType } from '~/model/decoder'

export const user: Model<'User'> = {
  __typename: DiscriminatorType.User,
  id: castToUuid(1),
  trashed: false,
  alias: castToAlias('/user/1/admin'),
  username: 'alpha',
  date: '2014-03-01T20:36:21Z',
  lastLogin: '2020-03-24T09:40:55Z',
  description: null,
  roles: ['login', 'german_horizonhelper', 'sysadmin'],
}

export const user2: Model<'User'> = {
  __typename: DiscriminatorType.User,
  id: castToUuid(23),
  trashed: false,
  alias: castToAlias('/user/23/sandra'),
  username: 'sandra',
  date: '2015-02-01T20:35:21Z',
  lastLogin: '2019-03-23T09:20:55Z',
  description: null,
  roles: ['login'],
}

export const activityByType: Payload<'serlo', 'getActivityByType'> = {
  edits: 10,
  comments: 11,
  reviews: 0,
  taxonomy: 3,
}
