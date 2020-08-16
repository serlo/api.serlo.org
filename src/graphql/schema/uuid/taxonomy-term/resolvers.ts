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
import { decodePath, UuidPayload } from '..'
import { resolveConnection } from '../../connection'
import { Context } from '../../types'
import { TaxonomyTermPayload, TaxonomyTermResolvers } from './types'

export const resolvers: TaxonomyTermResolvers = {
  TaxonomyTerm: {
    alias(taxonomyTerm) {
      return Promise.resolve(
        taxonomyTerm.alias ? decodePath(taxonomyTerm.alias) : null
      )
    },
    async parent(taxonomyTerm, _args, { dataSources }) {
      if (!taxonomyTerm.parentId) return null
      return dataSources.serlo.getUuid<TaxonomyTermPayload>({
        id: taxonomyTerm.parentId,
      })
    },
    async children(taxonomyTerm, cursorPayload, { dataSources }) {
      const children = await Promise.all(
        taxonomyTerm.childrenIds.map((id) => {
          return dataSources.serlo.getUuid<UuidPayload>({ id })
        })
      )
      return resolveConnection<TaxonomyTermPayload>({
        nodes: children.filter(
          (payload) => payload !== null
        ) as TaxonomyTermPayload[],
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
        const navigation = await context.dataSources.serlo.getNavigation({
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
}

async function resolveTaxonomyTermPath(
  parent: TaxonomyTermPayload,
  { dataSources }: Context
) {
  const path: TaxonomyTermPayload[] = [parent]
  let current: TaxonomyTermPayload = parent

  while (current.parentId !== null) {
    const next = await dataSources.serlo.getUuid<TaxonomyTermPayload>({
      id: current.parentId,
    })
    if (next === null) break
    path.unshift(next)
    current = next
  }

  return path
}
