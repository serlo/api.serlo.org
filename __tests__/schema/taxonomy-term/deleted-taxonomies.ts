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
import { gql } from 'apollo-server'

import {
  taxonomyTermCurriculumTopic as baseTaxonomyTermCurriculumTopic,
  taxonomyTermTopic as baseTaxonomyTermTopic,
} from '../../../__fixtures__'
import { given, Client } from '../../__utils__'
import { Instance } from '~/types'

const query = new Client().prepareQuery({
  query: gql`
    query ($first: Int, $after: String, $instance: Instance) {
      taxonomyTerm {
        deletedTaxonomies(first: $first, after: $after, instance: $instance) {
          nodes {
            dateOfDeletion
            taxonomy {
              id
            }
          }
        }
      }
    }
  `,
})

const taxonomyTermCurriculumTopic = {
  ...baseTaxonomyTermCurriculumTopic,
  dateOfDeletion: '2015-01-01T00:00:00Z',
  instance: Instance.En,
}
const taxonomyTermTopic = {
  ...baseTaxonomyTermTopic,
  dateOfDeletion: '2016-01-01T00:00:00Z',
}

beforeEach(() => {
  const taxonomies = [taxonomyTermCurriculumTopic, taxonomyTermTopic]

  given('UuidQuery').for(
    taxonomies.map((taxonomy) => {
      return { ...taxonomy, trashed: true }
    })
  )

  given('DeletedTaxonomiesQuery').isDefinedBy((req, res, ctx) => {
    const { first, after, instance } = req.body.payload

    const taxonomiesByInstance = instance
      ? taxonomies.filter((taxonomy) => taxonomy.instance === instance)
      : taxonomies

    const taxonomiesByAfter = after
      ? taxonomiesByInstance.filter(
          (taxonomy) => new Date(taxonomy.dateOfDeletion) > new Date(after)
        )
      : taxonomiesByInstance

    const taxonomiesByFirst = taxonomiesByAfter.slice(0, first)

    const deletedTaxonomies = taxonomiesByFirst.map((taxonomy) => {
      return {
        id: taxonomy.id,
        dateOfDeletion: taxonomy.dateOfDeletion,
      }
    })
    return res(ctx.json({ deletedTaxonomies }))
  })
})

test('returns deleted taxonomies', async () => {
  await query.shouldReturnData({
    taxonomyTerm: {
      deletedTaxonomies: {
        nodes: [
          {
            dateOfDeletion: taxonomyTermCurriculumTopic.dateOfDeletion,
            taxonomy: { id: taxonomyTermCurriculumTopic.id },
          },
          {
            dateOfDeletion: taxonomyTermTopic.dateOfDeletion,
            taxonomy: { id: taxonomyTermTopic.id },
          },
        ],
      },
    },
  })

  await query.withVariables({ first: 1 }).shouldReturnData({
    taxonomyTerm: {
      deletedTaxonomies: {
        nodes: [
          {
            dateOfDeletion: taxonomyTermCurriculumTopic.dateOfDeletion,
            taxonomy: { id: taxonomyTermCurriculumTopic.id },
          },
        ],
      },
    },
  })
})

test('paginates with `after` parameter { taxonomyId, dateOfDeletion}, ', async () => {
  await query
    .withVariables({
      after: Buffer.from(
        JSON.stringify({
          id: taxonomyTermCurriculumTopic.id,
          dateOfDeletion: taxonomyTermCurriculumTopic.dateOfDeletion,
        })
      ).toString('base64'),
    })
    .shouldReturnData({
      taxonomyTerm: {
        deletedTaxonomies: {
          nodes: [
            {
              dateOfDeletion: taxonomyTermTopic.dateOfDeletion,
              taxonomy: { id: taxonomyTermTopic.id },
            },
          ],
        },
      },
    })
})

test('filters by instance', async () => {
  await query
    .withVariables({
      instance: Instance.En,
    })
    .shouldReturnData({
      taxonomyTerm: {
        deletedTaxonomies: {
          nodes: [{ taxonomy: { id: taxonomyTermCurriculumTopic.id } }],
        },
      },
    })
})

test('fails when `first` is too high', async () => {
  await query
    .withVariables({ first: 10_001 })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails when `after` is malformed', async () => {
  await query
    .withVariables({
      after: Buffer.from(
        JSON.stringify({
          id: taxonomyTermCurriculumTopic.id,
          dateOfDeletion: 'foo',
        })
      ).toString('base64'),
    })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer returns a 400er response', async () => {
  given('DeletedTaxonomiesQuery').returnsBadRequest()

  await query.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer has an internal error', async () => {
  given('DeletedTaxonomiesQuery').hasInternalServerError()

  await query.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
