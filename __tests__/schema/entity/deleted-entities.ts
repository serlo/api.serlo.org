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
  article as baseArticle,
  coursePage as baseCoursePage,
  solution as baseSolution,
} from '../../../__fixtures__'
import { given, Client } from '../../__utils__'
import { Instance } from '~/types'

const query = new Client().prepareQuery({
  query: gql`
    query ($first: Int, $after: String, $instance: Instance) {
      entity {
        deletedEntities(first: $first, after: $after, instance: $instance) {
          nodes {
            dateOfDeletion
            entity {
              id
            }
          }
        }
      }
    }
  `,
})

const coursePage = { ...baseCoursePage, instance: Instance.En }
const article = { ...baseArticle, date: '2015-03-01T20:45:56Z' }
const solution = { ...baseSolution, date: '2016-03-01T20:45:56Z' }

beforeEach(() => {
  given('DeletedEntitiesQuery').for(article, coursePage, solution)
})

test('returns deleted entities', async () => {
  await query.shouldReturnData({
    entity: {
      deletedEntities: {
        nodes: [
          {
            dateOfDeletion: article.date,
            entity: { id: article.id },
          },
          {
            dateOfDeletion: coursePage.date,
            entity: { id: coursePage.id },
          },
          {
            dateOfDeletion: solution.date,
            entity: { id: solution.id },
          },
        ],
      },
    },
  })

  await query.withVariables({ first: 1 }).shouldReturnData({
    entity: {
      deletedEntities: {
        nodes: [
          {
            dateOfDeletion: article.date,
            entity: { id: article.id },
          },
        ],
      },
    },
  })
})

test('`after` parameter, using entity id and dateOfDeletion, paginates', async () => {
  await query
    .withVariables({
      after: Buffer.from(
        JSON.stringify({
          id: article.id,
          dateOfDeletion: article.date,
        })
      ).toString('base64'),
    })
    .shouldReturnData({
      entity: {
        deletedEntities: {
          nodes: [
            {
              dateOfDeletion: solution.date,
              entity: { id: solution.id },
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
      entity: {
        deletedEntities: {
          nodes: [{ entity: { id: coursePage.id } }],
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
          id: article.id,
          dateOfDeletion: 'foo',
        })
      ).toString('base64'),
    })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer returns a 400er response', async () => {
  given('DeletedEntitiesQuery').returnsBadRequest()

  await query.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer has an internal error', async () => {
  given('DeletedEntitiesQuery').hasInternalServerError()

  await query.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
