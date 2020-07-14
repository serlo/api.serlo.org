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
import { DateTime } from '../../date-time'
import { MutationResolver, QueryResolver } from '../../types'
import { DiscriminatorType, Uuid, UuidPayload } from '../abstract-uuid'

export interface User extends Uuid {
  __typename: DiscriminatorType.User
  username: string
  date: DateTime
  lastLogin: DateTime | null
  description: string | null
}

export interface UserPayload extends UuidPayload {
  username: string
  date: DateTime
  lastLogin: DateTime | null
  description: string | null
}

export interface UserResolvers {
  Query: {
    activeDonors: QueryResolver<never, UserPayload[]>
  }
  Mutation: {
    _setUser: MutationResolver<UserPayload>
  }
}

export function isUserPayload(payload: any): payload is UserPayload {
  return payload.username !== undefined
}
