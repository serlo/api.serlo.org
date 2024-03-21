import gql from 'graphql-tag'
import * as R from 'ramda'

import { exercise } from '../../../__fixtures__'
import { getTypenameAndId, given, Client } from '../../__utils__'
import { Model } from '~/internals/graphql'
import { EntityType } from '~/model/decoder'

// TODO: simplify
const exerciseFixtures: Record<string, Model<'AbstractExercise'>> = {
  [EntityType.Exercise]: exercise,
}
const exerciseCases = R.toPairs(exerciseFixtures)

test.each(exerciseCases)('%s by id', async (_type, entity) => {
  given('UuidQuery').for(entity)

  await new Client()
    .prepareQuery({
      query: gql`
        query exercise($id: Int!) {
          uuid(id: $id) {
            ... on AbstractExercise {
              __typename
              id
            }
          }
        }
      `,
    })
    .withVariables({ id: entity.id })
    .shouldReturnData({ uuid: getTypenameAndId(entity) })
})
