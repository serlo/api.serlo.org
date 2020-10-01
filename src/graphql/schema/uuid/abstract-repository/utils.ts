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
import { resolveConnection } from '../..'
import { requestsOnlyFields, isNotNil } from '../../utils'
import { createAliasResolvers } from '../alias'
import { resolveUser } from '../user'
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
    ...createAliasResolvers<E>(),
    async currentRevision(entity, _args, { dataSources }) {
      if (!entity.currentRevisionId) return null
      return dataSources.serlo.getUuid<R>({ id: entity.currentRevisionId })
    },
    async revisions(entity, cursorPayload, { dataSources }) {
      const revsFromSerlo = await Promise.all(
        entity.revisionIds.map((id) => {
          return dataSources.serlo.getUuid<R>({ id })
        })
      )
      const revs = revsFromSerlo.filter(isNotNil)
      const filteredRevs = cursorPayload.unrevised
        ? revs.filter(
            (rev) =>
              (entity.currentRevisionId === null ||
                rev.id > entity.currentRevisionId) &&
              !rev.trashed
          )
        : revs
      return resolveConnection<R>({
        nodes: filteredRevs,
        payload: cursorPayload,
        createCursor(node) {
          return node.id.toString()
        },
      })
    },
    async license(repository, _args, { dataSources }, info) {
      const partialLicense = { id: repository.licenseId }
      if (requestsOnlyFields('License', ['id'], info)) {
        return partialLicense
      }
      return dataSources.serlo.getLicense(partialLicense)
    },
  }
}

export function createRevisionResolvers<
  E extends AbstractRepositoryPayload,
  R extends AbstractRevisionPayload
>(): RevisionResolvers<E, R> {
  return {
    author(entityRevision, _args, context, info) {
      return resolveUser({ id: entityRevision.authorId }, context, info)
    },
    repository: async (entityRevision, _args, { dataSources }) => {
      return dataSources.serlo.getUuid<E>({ id: entityRevision.repositoryId })
    },
  }
}
