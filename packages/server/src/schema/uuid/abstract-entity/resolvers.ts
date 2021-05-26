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
import * as serloAuth from '@serlo/authorization'
import { UserInputError } from 'apollo-server-errors'

import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
  InterfaceResolvers,
  Model,
  Mutations,
} from '~/internals/graphql'
import { EntityRevisionDecoder, EntityRevisionType } from '~/model/decoder'
import { fetchScopeOfUuid } from '~/schema/authorization/utils'

export const resolvers: InterfaceResolvers<'AbstractEntity'> &
  InterfaceResolvers<'AbstractEntityRevision'> &
  Mutations<'entity'> = {
  Mutation: {
    entity: createNamespace(),
  },
  AbstractEntity: {
    __resolveType(entity) {
      return entity.__typename
    },
  },
  AbstractEntityRevision: {
    __resolveType(entityRevision) {
      return entityRevision.__typename
    },
  },
  EntityMutation: {
    async checkoutRevision(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const revision = await dataSources.model.serlo.getUuid({
        id: input.revisionId,
      })

      if (revision === null || !isEntityRevision(revision)) {
        throw new UserInputError('revisionId must belong to a revision')
      }

      const scope = await fetchScopeOfUuid({
        id: revision.repositoryId,
        dataSources,
      })
      await assertUserIsAuthorized({
        userId,
        dataSources,
        message: 'you are not authorized to checkout a revision',
        guard: serloAuth.Entity.checkoutRevision(scope),
      })

      return await dataSources.model.serlo.checkoutRevision({
        ...input,
        userId,
      })
    },
  },
}

function isEntityRevision(
  uuid: Model<'AbstractUuid'>
): uuid is Model<'AbstractEntityRevision'> {
  return Object.values<string>(EntityRevisionType).includes(uuid.__typename)
}
