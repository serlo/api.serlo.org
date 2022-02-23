/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import * as serloAuth from '@serlo/authorization'

import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
  Mutations,
  TypeResolvers,
} from '~/internals/graphql'
import { castToUuid, PageDecoder, PageRevisionDecoder } from '~/model/decoder'
import { fetchScopeOfUuid } from '~/schema/authorization/utils'
import {
  createRepositoryResolvers,
  createRevisionResolvers,
} from '~/schema/uuid/abstract-repository/utils'
import { Page, PageRevision } from '~/types'

export const resolvers: TypeResolvers<Page> &
  TypeResolvers<PageRevision> &
  Mutations<'page'> = {
  Mutation: {
    page: createNamespace(),
  },
  Page: {
    ...createRepositoryResolvers({ revisionDecoder: PageRevisionDecoder }),
    navigation(page, _args, { dataSources }) {
      return dataSources.model.serlo.getNavigation({
        instance: page.instance,
        id: page.id,
      })
    },
  },
  PageRevision: createRevisionResolvers({ repositoryDecoder: PageDecoder }),
  PageMutation: {
    async addRevision(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const { pageId } = input

      const scope = await fetchScopeOfUuid({
        id: pageId,
        dataSources,
      })
      await assertUserIsAuthorized({
        userId,
        dataSources,
        message: 'You are not allowed to add revision to this page.',
        guard: serloAuth.Uuid.create('PageRevision')(scope),
      })

      await dataSources.model.serlo.addPageRevision({
        userId,
        ...input,
      })

      return { success: true }
    },
    async checkoutRevision(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const scope = await fetchScopeOfUuid({
        id: input.revisionId,
        dataSources,
      })

      await assertUserIsAuthorized({
        userId,
        dataSources,
        message: 'You are not allowed to check out the provided revision.',
        guard: serloAuth.Page.checkoutRevision(scope),
      })

      await dataSources.model.serlo.checkoutPageRevision({
        revisionId: castToUuid(input.revisionId),
        reason: input.reason,
        userId,
      })

      return { success: true, query: {} }
    },
    async rejectRevision(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const scope = await fetchScopeOfUuid({
        id: input.revisionId,
        dataSources,
      })
      await assertUserIsAuthorized({
        userId,
        dataSources,
        message: 'You are not allowed to reject the provided revision.',
        guard: serloAuth.Page.rejectRevision(scope),
      })

      await dataSources.model.serlo.rejectPageRevision({ ...input, userId })

      return { success: true, query: {} }
    },
  },
}
