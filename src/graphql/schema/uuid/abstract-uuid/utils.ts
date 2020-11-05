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
import { ForbiddenError } from 'apollo-server'
import * as R from 'ramda'

import { SerloDataSource } from '../../../data-sources/serlo'
import { resolveConnection } from '../../connection'
import { ThreadPayload } from '../../threads'
import { isDefined } from '../../utils'
import { EntityRevisionType, EntityType } from '../abstract-entity'
import { AbstractUuidPayload, UuidResolvers } from '../abstract-uuid'
import { CommentPayload } from '../comment'
import { DiscriminatorType } from './types'

const validTypes = [
  ...Object.values(DiscriminatorType),
  ...Object.values(EntityType),
  ...Object.values(EntityRevisionType),
]

export function isUnsupportedUuid(payload: AbstractUuidPayload) {
  return !R.includes(payload.__typename, validTypes)
}

export function createUuidResolvers(): UuidResolvers {
  return {
    async threads(parent, cursorPayload, { dataSources }) {
      const { firstCommentIds } = await Promise.resolve(
        dataSources.serlo.getThreadIds({ id: parent.id })
      )

      return resolveConnection({
        nodes: await Promise.all(
          firstCommentIds.map((id) => toThreadPayload(dataSources.serlo, id))
        ),
        payload: cursorPayload,
        createCursor(node) {
          return node.commentPayloads[0].id.toString()
        },
      })
    },
  }
}

export async function toThreadPayload(
  serlo: SerloDataSource,
  firstCommentId: number
): Promise<ThreadPayload> {
  const firstComment = await serlo.getUuid<CommentPayload>({
    id: firstCommentId,
  })
  if (firstComment === null) {
    throw new ForbiddenError('There are no comments yet')
  }
  const remainingComments = await Promise.all(
    firstComment.childrenIds.map((id) => serlo.getUuid<CommentPayload>({ id }))
  )
  return {
    __typename: DiscriminatorType.Thread,
    commentPayloads: [firstComment, ...remainingComments.filter(isDefined)],
  }
}
