import { gql } from 'apollo-server'
import * as R from 'ramda'

import { exercise, groupedExercise, solution } from '../../../__fixtures__'
import { getTypenameAndId, given, Client } from '../../__utils__'
import { Model } from '~/internals/graphql'
import { EntityType } from '~/model/decoder'

const exerciseFixtures: Record<string, Model<'AbstractExercise'>> = {
  [EntityType.Exercise]: exercise,
  [EntityType.GroupedExercise]: groupedExercise,
}
const exerciseCases = R.toPairs(exerciseFixtures)

test.each(exerciseCases)('%s by id (w/ solution)', async (_type, entity) => {
  given('UuidQuery').for(entity, solution)

  await new Client()
    .prepareQuery({
      query: gql`
        query solution($id: Int!) {
          uuid(id: $id) {
            ... on AbstractExercise {
              solution {
                __typename
                id
              }
            }
          }
        }
      `,
    })
    .withVariables({ id: entity.id })
    .shouldReturnData({ uuid: { solution: getTypenameAndId(solution) } })
})
