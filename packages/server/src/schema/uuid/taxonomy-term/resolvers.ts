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
import { UserInputError } from 'apollo-server'
import * as t from 'io-ts'

import {
  TypeResolvers,
  Context,
  Model,
  Mutations,
  createNamespace,
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  assertArgumentIsNotEmpty,
} from '~/internals/graphql'
import { TaxonomyTermDecoder } from '~/model/decoder'
import { fetchScopeOfUuid } from '~/schema/authorization/utils'
import { resolveConnection } from '~/schema/connection/utils'
import { createThreadResolvers } from '~/schema/thread/utils'
import { createUuidResolvers } from '~/schema/uuid/abstract-uuid/utils'
import { TaxonomyTerm, TaxonomyTermType } from '~/types'
import { isDefined } from '~/utils'

export const resolvers: TypeResolvers<TaxonomyTerm> &
  Mutations<'taxonomyTerm'> = {
  Mutation: {
    taxonomyTerm: createNamespace(),
  },
  TaxonomyTerm: {
    ...createUuidResolvers(),
    ...createThreadResolvers(),
    parent(taxonomyTerm, _args, { dataSources }) {
      if (!taxonomyTerm.parentId) return null
      return dataSources.model.serlo.getUuidWithCustomDecoder({
        id: taxonomyTerm.parentId,
        decoder: TaxonomyTermDecoder,
      })
    },
    async children(taxonomyTerm, cursorPayload, { dataSources }) {
      const children = await Promise.all(
        taxonomyTerm.childrenIds.map((id) => {
          // TODO: Use getUuidWithCustomDecoder()
          return dataSources.model.serlo.getUuid({ id })
        })
      )
      return resolveConnection({
        nodes: children.filter(isDefined),
        payload: cursorPayload,
        createCursor(node) {
          return node.id.toString()
        },
      })
    },
    async navigation(taxonomyTerm, _args, context) {
      const taxonomyPath = await resolveTaxonomyTermPath(taxonomyTerm, context)

      for (let i = 0; i < taxonomyPath.length; i++) {
        const currentIndex = taxonomyPath.length - (i + 1)
        const current = taxonomyPath[currentIndex]
        const navigation = await context.dataSources.model.serlo.getNavigation({
          instance: taxonomyTerm.instance,
          id: current.id,
        })

        if (navigation !== null) {
          const { data, path } = navigation

          return {
            data,
            path: [
              ...path,
              ...taxonomyPath.slice(currentIndex + 1).map((term) => {
                return {
                  label: term.name,
                  url: term.alias ?? null,
                  id: term.id,
                }
              }),
            ],
          }
        }
      }
      return null
    },
  },
  TaxonomyTermMutation: {
    async create(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const { parentId, name, description = null } = input

      assertArgumentIsNotEmpty({ name })


      const scope = await fetchScopeOfUuid({
        id: parentId,
        dataSources,
      })

      await assertUserIsAuthorized({
        userId,
        dataSources,
        message: 'You are not allowed to move this taxonomy term.',
        guard: serloAuth.Uuid.create('TaxonomyTerm')(scope),
      })

      const taxonomyTerm = await dataSources.model.serlo.createTaxonomyTerm({
        taxonomyType: TaxonomyTermType.CurriculumTopic, // TODO
        parentId,
        name,
        description,
        userId,
      })

      return {
        success: taxonomyTerm ? true : false,
        record: taxonomyTerm,
        query: {},
      }
    },

    async move(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const { childrenIds, destination } = input

      const scope = await fetchScopeOfUuid({
        id: destination,
        dataSources,
      })

      for (const id of childrenIds) {
        const object = await dataSources.model.serlo.getUuid({
          id,
        })
        if (object === null) throw new UserInputError('UUID does not exist.')
      }

      await assertUserIsAuthorized({
        userId,
        dataSources,
        message: 'You are not allowed to move this taxonomy term.',
        guard: serloAuth.TaxonomyTerm.addChild(scope),
      })

      const { success } = await dataSources.model.serlo.moveTaxonomyTerm({
        childrenIds,
        destination,
        userId,
      })

      return { success, query: {} }
    },

    async setNameAndDescription(_parent, { input }, { dataSources, userId }) {
      assertUserIsAuthenticated(userId)

      const { id, name, description = null } = input

      assertArgumentIsNotEmpty({ name })

      const scope = await fetchScopeOfUuid({
        id,
        dataSources,
      })

      await assertUserIsAuthorized({
        userId,
        dataSources,
        message:
          'You are not allowed to set name or description of this taxonomy term.',
        guard: serloAuth.TaxonomyTerm.set(scope),
      })

      const { success } =
        await dataSources.model.serlo.setTaxonomyTermNameAndDescription({
          id,
          name,
          description,
          userId,
        })

      return { success, query: {} }
    },
  },
}

async function resolveTaxonomyTermPath(
  parent: Model<'TaxonomyTerm'>,
  { dataSources }: Context
) {
  const path = [parent]
  let current = parent

  while (current.parentId !== null) {
    const next = await dataSources.model.serlo.getUuidWithCustomDecoder({
      id: current.parentId,
      decoder: t.union([TaxonomyTermDecoder, t.null]),
    })
    if (next === null) break
    path.unshift(next)
    current = next
  }

  return path
}
