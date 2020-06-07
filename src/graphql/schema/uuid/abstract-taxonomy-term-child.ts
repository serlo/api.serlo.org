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
import { gql } from 'apollo-server'

import { SerloDataSource } from '../../data-sources/serlo'
import { Schema } from '../utils'
import {
  Entity,
  EntityPayload,
  EntityRevision,
  addEntityResolvers,
  EntityResolversPayload,
} from './abstract-entity'
import {
  resolveTaxonomyTerm,
  TaxonomyTerm,
  TaxonomyTermPayload,
} from './taxonomy-term'

export const abstractTaxonomyTermChildSchema = new Schema()

export abstract class TaxonomyTermChild extends Entity {
  public taxonomyTermIds: number[]

  public constructor(payload: TaxonomyTermChildPayload) {
    super(payload)
    this.taxonomyTermIds = payload.taxonomyTermIds
  }
}
export interface TaxonomyTermChildPayload extends EntityPayload {
  taxonomyTermIds: number[]
}
abstractTaxonomyTermChildSchema.addTypeResolver<TaxonomyTermChild>(
  'TaxonomyTermChild',
  (entity) => {
    return entity.__typename
  }
)
abstractTaxonomyTermChildSchema.addTypeDef(gql`
  """
  Represents a Serlo.org entity (e.g. an article) that is the child of \`TaxonomyTerm\`s
  """
  interface TaxonomyTermChild {
    """
    The \`TaxonomyTerm\`s that the entity has been associated with
    """
    taxonomyTerms: [TaxonomyTerm!]!
  }
`)

export function addTaxonomyTermChildResolvers<
  E extends TaxonomyTermChild,
  R extends EntityRevision,
  ESetter extends keyof SerloDataSource,
  RSetter extends keyof SerloDataSource
>(args: EntityResolversPayload<E, R, ESetter, RSetter>) {
  addEntityResolvers(args)
  args.schema.addResolver<E, unknown, TaxonomyTerm[]>(
    args.entityType,
    'taxonomyTerms',
    (entity, _args, { dataSources }) => {
      return Promise.all(
        entity.taxonomyTermIds.map((id: number) => {
          return dataSources.serlo
            .getUuid<TaxonomyTermPayload>({ id })
            .then((data) => {
              return resolveTaxonomyTerm(data)
            })
        })
      )
    }
  )
}
