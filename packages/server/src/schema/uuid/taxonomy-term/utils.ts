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

import { UserInputError } from 'apollo-server'
import * as t from 'io-ts'

import { InvalidCurrentValueError } from '~/internals/data-source-helper'
import { Context, Model } from '~/internals/graphql'
import { TaxonomyTermDecoder } from '~/model/decoder'
import { TaxonomyTermType, TaxonomyTypeCreateOptions } from '~/types'

export function verifyTaxonomyType(
  type: TaxonomyTypeCreateOptions,
  parentType: TaxonomyTermType
) {
  // based on https://github.com/serlo/serlo.org-database-layer/blob/2a3db9d106bf0b6140c4e8eba12ac5adaec51112/server/src/vocabulary/model.rs#L272-L276
  const childType = {
    topic: {
      allowedParentTaxonomyTypes: [
        TaxonomyTermType.Subject,
        TaxonomyTermType.Topic,
        TaxonomyTermType.Curriculum,
        TaxonomyTermType.CurriculumTopic,
      ],
    },
    topicFolder: {
      allowedParentTaxonomyTypes: [
        TaxonomyTermType.Topic,
        TaxonomyTermType.CurriculumTopic,
      ],
    },
  }

  if (!childType[type].allowedParentTaxonomyTypes.includes(parentType)) {
    throw new UserInputError(
      `Child of type ${type} cannot have parent of type ${parentType}`
    )
  }
}

export async function resolveTaxonomyTermPath(
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

export async function getTaxonomyTerm(
  id: number,
  dataSources: Context['dataSources']
) {
  await assertIsTaxonomyTerm(id, dataSources)

  return await dataSources.model.serlo.getUuidWithCustomDecoder({
    id,
    decoder: TaxonomyTermDecoder,
  })
}

export async function assertIsTaxonomyTerm(
  id: number,
  dataSources: Context['dataSources']
) {
  try {
    await dataSources.model.serlo.getUuidWithCustomDecoder({
      id,
      decoder: TaxonomyTermDecoder,
    })
  } catch (error) {
    if (error instanceof InvalidCurrentValueError) {
      throw new UserInputError(
        `No taxonomy term found for the provided id ${id}`
      )
    } else {
      throw error
    }
  }
}
