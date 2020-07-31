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
import { requestsOnlyFields } from '../../utils'
import { UserPayload } from '../user'
import {
  AbstractRepositoryPayload,
  AbstractRevisionPayload,
  RepositoryResolvers,
  RevisionResolvers,
} from './types'

export function createRepositoryResolvers<
  E extends AbstractRepositoryPayload,
  R extends AbstractRevisionPayload
>(): RepositoryResolvers<E, R> {
  return {
    async currentRevision(entity, _args, { dataSources }) {
      if (!entity.currentRevisionId) return null
      return dataSources.serlo.getUuid<R>({ id: entity.currentRevisionId })
    },
  }
}

export function createRevisionResolvers<
  E extends AbstractRepositoryPayload,
  R extends AbstractRevisionPayload
>(): RevisionResolvers<E, R> {
  return {
    async author(entityRevision, _args, { dataSources }, info) {
      const partialUser = { id: entityRevision.authorId }
      if (requestsOnlyFields('User', ['id'], info)) {
        return partialUser
      }
      return dataSources.serlo.getUuid<UserPayload>(partialUser)
    },
    repository: async (entityRevision, _args, { dataSources }) => {
      return dataSources.serlo.getUuid<E>({ id: entityRevision.repositoryId })
    },
  }
}
