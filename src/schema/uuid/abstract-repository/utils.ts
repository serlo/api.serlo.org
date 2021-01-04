/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { array as A, pipeable } from 'fp-ts'

import { resolveConnection } from '../../connection'
import { isDefined } from '../../utils'
import { createUuidResolvers } from '../abstract-uuid'
import { resolveUser } from '../user'
import {
  AbstractRepositoryPayload,
  AbstractRevisionPayload,
  RepositoryResolvers,
  RevisionResolvers,
} from './types'
import { requestsOnlyFields } from '~/internals/graphql'

export function createRepositoryResolvers<
  E extends AbstractRepositoryPayload,
  R extends AbstractRevisionPayload
>(): RepositoryResolvers<E, R> {
  return {
    ...createUuidResolvers(),
    async currentRevision(entity, _args, { dataSources }) {
      if (!entity.currentRevisionId) return null
      return (await dataSources.model.serlo.getUuid({
        id: entity.currentRevisionId,
      })) as R | null
    },
    async revisions(entity, cursorPayload, { dataSources }) {
      const revisions = pipeable.pipe(
        await Promise.all(
          entity.revisionIds.map(async (id) => {
            return (await dataSources.model.serlo.getUuid({ id })) as R | null
          })
        ),
        A.filter(isDefined),
        A.filter((revision) => {
          if (!isDefined(cursorPayload.unrevised)) return true

          if (revision.trashed) return false

          const isUnrevised =
            entity.currentRevisionId === null ||
            revision.id > entity.currentRevisionId
          return cursorPayload.unrevised ? isUnrevised : !isUnrevised
        })
      )
      return resolveConnection<R>({
        nodes: revisions,
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
      return dataSources.model.serlo.getLicense(partialLicense)
    },
  }
}

export function createRevisionResolvers<
  E extends AbstractRepositoryPayload,
  R extends AbstractRevisionPayload
>(): RevisionResolvers<E, R> {
  return {
    ...createUuidResolvers(),
    author(entityRevision, _args, context, info) {
      return resolveUser({ id: entityRevision.authorId }, context, info)
    },
    repository: async (entityRevision, _args, { dataSources }) => {
      return (await dataSources.model.serlo.getUuid({
        id: entityRevision.repositoryId,
      })) as E | null
    },
  }
}
