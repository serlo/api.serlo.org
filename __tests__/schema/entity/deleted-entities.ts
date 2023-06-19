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

test('paginates with `after` parameter { entityId, dateOfDeletion}, ', async () => {
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
