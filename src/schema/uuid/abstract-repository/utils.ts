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
import { array as A, pipeable } from 'fp-ts'
import * as t from 'io-ts'

import { resolveUser } from '../user/utils'
import {
  RepositoryPayload,
  RepositoryResolvers,
  RevisionPayload,
  RevisionResolvers,
} from './types'
import { resolveConnection } from '~/schema/connection/utils'
import { createThreadResolvers } from '~/schema/thread/utils'
import { createUuidResolvers } from '~/schema/uuid/abstract-uuid/utils'
import { isDefined } from '~/utils'

export function createRepositoryResolvers<
  E extends RepositoryPayload,
  R extends RevisionPayload
>({
  revisionDecoder,
}: {
  revisionDecoder: t.Type<R>
}): RepositoryResolvers<E, R> {
  return {
    ...createUuidResolvers(),
    ...createThreadResolvers(),
    async currentRevision(entity, _args, { dataSources }) {
      if (!entity.currentRevisionId) return null
      return await dataSources.model.serlo.getUuidWithCustomDecoder({
        id: entity.currentRevisionId,
        decoder: revisionDecoder,
      })
    },
    async revisions(entity, cursorPayload, { dataSources }) {
      const revisions = pipeable.pipe(
        await Promise.all(
          entity.revisionIds.map(async (id) => {
            return await dataSources.model.serlo.getUuidWithCustomDecoder({
              id,
              decoder: revisionDecoder,
            })
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
    async license(repository, _args, { dataSources }) {
      return dataSources.model.serlo.getLicense({ id: repository.licenseId })
    },
  }
}

export function createRevisionResolvers<
  E extends RepositoryPayload,
  R extends RevisionPayload
>({
  repositoryDecoder,
}: {
  repositoryDecoder: t.Type<E>
}): RevisionResolvers<E, R> {
  return {
    ...createUuidResolvers(),
    ...createThreadResolvers(),
    async author(entityRevision, _args, context) {
      const user = await resolveUser({ id: entityRevision.authorId }, context)

      if (user === null) throw new Error('author cannot be null')

      return user
    },
    repository: async (entityRevision, _args, { dataSources }) => {
      const repository = await dataSources.model.serlo.getUuidWithCustomDecoder(
        {
          id: entityRevision.repositoryId,
          decoder: repositoryDecoder,
        }
      )

      if (repository === null) throw new Error('respository cannot be null')

      return repository
    },
  }
}
