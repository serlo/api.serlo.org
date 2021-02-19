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
import { Matchers } from '@pact-foundation/pact'
import { gql } from 'apollo-server'

import {
  getTaxonomyTermDataWithoutSubResolvers,
  taxonomyTermCurriculumTopic,
  taxonomyTermRoot,
  taxonomyTermSubject,
} from '../../../__fixtures__'
import {
  addUuidInteraction,
  assertSuccessfulGraphQLQuery,
} from '../../__utils__'
import { TaxonomyTermPayload } from '~/schema/uuid/taxonomy-term/types'

function addTaxonomyTermInteraction(payload: TaxonomyTermPayload) {
  return addUuidInteraction<TaxonomyTermPayload>({
    __typename: payload.__typename,
    id: payload.id,
    trashed: Matchers.boolean(payload.trashed),
    alias: Matchers.string(payload.alias),
    type: Matchers.string(payload.type),
    instance: Matchers.string(payload.instance),
    name: Matchers.string(payload.name),
    description: payload.description
      ? Matchers.string(payload.description)
      : null,
    weight: Matchers.integer(payload.weight),
    parentId: payload.parentId ? Matchers.integer(payload.parentId) : null,
    childrenIds:
      payload.childrenIds.length > 0
        ? Matchers.eachLike(Matchers.integer(payload.childrenIds[0]))
        : [],
  })
}

test('TaxonomyTerm root', async () => {
  await addTaxonomyTermInteraction(taxonomyTermRoot)
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query taxonomyTerm($id: Int!) {
        uuid(id: $id) {
          __typename
          ... on TaxonomyTerm {
            id
            type
            trashed
            instance
            name
            description
            weight
          }
        }
      }
    `,
    variables: taxonomyTermRoot,
    data: {
      uuid: getTaxonomyTermDataWithoutSubResolvers(taxonomyTermRoot),
    },
  })
})

test('TaxonomyTerm subject', async () => {
  await addTaxonomyTermInteraction(taxonomyTermSubject)
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query taxonomyTerm($id: Int!) {
        uuid(id: $id) {
          __typename
          ... on TaxonomyTerm {
            id
            type
            trashed
            instance
            name
            description
            weight
          }
        }
      }
    `,
    variables: taxonomyTermSubject,
    data: {
      uuid: getTaxonomyTermDataWithoutSubResolvers(taxonomyTermSubject),
    },
  })
})

test('TaxonomyTerm curriculumTopic', async () => {
  await addTaxonomyTermInteraction(taxonomyTermCurriculumTopic)
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query taxonomyTerm($id: Int!) {
        uuid(id: $id) {
          __typename
          ... on TaxonomyTerm {
            id
            type
            trashed
            instance
            name
            description
            weight
          }
        }
      }
    `,
    variables: taxonomyTermCurriculumTopic,
    data: {
      uuid: getTaxonomyTermDataWithoutSubResolvers(taxonomyTermCurriculumTopic),
    },
  })
})
