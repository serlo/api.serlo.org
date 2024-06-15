import gql from 'graphql-tag'

import { Client } from '../../__utils__'
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

beforeEach(async () => {
  // The database dump does not contain any deleted entities, thus we create some here
  await databaseForTests.mutate('update uuid set trashed = 1 where id = 1615')
})

test('returns deleted entities', async () => {
  await query.shouldReturnData({
    entity: {
      deletedEntities: {
        nodes: [
          { entity: { id: 1615 }, dateOfDeletion: '2014-04-21T14:40:28.000Z' },
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
          id: 1615,
          dateOfDeletion: '2014-04-21T14:40:28.000Z',
        }),
      ).toString('base64'),
    })
    .shouldReturnData({
      entity: { deletedEntities: { nodes: [] } },
    })
})

test('filters by instance', async () => {
  await query.withVariables({ instance: Instance.En }).shouldReturnData({
    entity: { deletedEntities: { nodes: [] } },
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
        JSON.stringify({ id: 1865, dateOfDeletion: 'foo' }),
      ).toString('base64'),
    })
    .shouldFailWithError('BAD_USER_INPUT')
})
