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

import { resolveAbstractUuid, UuidPayload } from '..'
import { Context, Service } from '../../types'
import { AbstractUuidPreResolver } from '../abstract-uuid'
import {
  TaxonomyTermPayload,
  TaxonomyTermPreResolver,
  TaxonomyTermResolvers,
} from './types'
import { resolveTaxonomyTerm } from './utils'

export const resolvers: TaxonomyTermResolvers = {
  TaxonomyTerm: {
    async parent(parent, _args, { dataSources }) {
      if (!parent.parentId) return
      const data = await dataSources.serlo.getUuid<TaxonomyTermPayload>({
        id: parent.parentId,
      })
      return resolveTaxonomyTerm(data)
    },
    children(parent, _args, { dataSources }) {
      return Promise.all(
        parent.childrenIds.map((id) => {
          return dataSources.serlo
            .getUuid<UuidPayload>({ id })
            .then((data) => {
              return resolveAbstractUuid(data) as AbstractUuidPreResolver
            })
        })
      )
    },
    async navigation(parent, _args: undefined, context: Context) {
      const taxonomyPath = await resolveTaxonomyTermPath(parent, context)

      for (let i = 0; i < taxonomyPath.length; i++) {
        const currentIndex = taxonomyPath.length - (i + 1)
        const current = taxonomyPath[currentIndex]
        const navigation = await context.dataSources.serlo.getNavigation({
          instance: parent.instance,
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
    },
  },
  Mutation: {
    async _setTaxonomyTerm(_parent, payload, { dataSources, service }) {
      if (service !== Service.Serlo) {
        throw new ForbiddenError(
          `You do not have the permissions to set a taxonomy term`
        )
      }
      await dataSources.serlo.setTaxonomyTerm(payload)
    },
  },
}

async function resolveTaxonomyTermPath(
  parent: TaxonomyTermPreResolver,
  { dataSources }: Context
) {
  const path: TaxonomyTermPreResolver[] = [parent]
  let current: TaxonomyTermPreResolver = parent

  while (current.parentId !== null) {
    const data = await dataSources.serlo.getUuid<TaxonomyTermPayload>({
      id: current.parentId,
    })
    current = resolveTaxonomyTerm(data)
    path.unshift(current)
  }

  return path
}
