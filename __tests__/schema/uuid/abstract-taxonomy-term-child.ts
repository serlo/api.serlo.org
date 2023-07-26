import gql from 'graphql-tag'
import * as R from 'ramda'

import {
  applet,
  article,
  course,
  event,
  exercise,
  exerciseGroup,
  taxonomyTermSubject,
  video,
} from '../../../__fixtures__'
import { getTypenameAndId, given, Client } from '../../__utils__'
import { Model } from '~/internals/graphql'
import { EntityType } from '~/model/decoder'

const taxonomyTermChildFixtures: Record<
  Model<'AbstractTaxonomyTermChild'>['__typename'],
  Model<'AbstractTaxonomyTermChild'>
> = {
  [EntityType.Applet]: applet,
  [EntityType.Article]: article,
  [EntityType.Course]: course,
  [EntityType.Event]: event,
  [EntityType.Exercise]: exercise,
  [EntityType.ExerciseGroup]: exerciseGroup,
  [EntityType.Video]: video,
}
const taxonomyTermChildCases = R.toPairs(taxonomyTermChildFixtures)

test.each(taxonomyTermChildCases)(
  '%s by id (w/ taxonomyTerms)',
  async (_type, entity) => {
    given('UuidQuery').for(entity, taxonomyTermSubject)

    await new Client()
      .prepareQuery({
        query: gql`
          query taxonomyTerms($id: Int!) {
            uuid(id: $id) {
              ... on AbstractTaxonomyTermChild {
                taxonomyTerms {
                  nodes {
                    __typename
                    id
                  }
                  totalCount
                }
              }
            }
          }
        `,
      })
      .withVariables({ id: entity.id })
      .shouldReturnData({
        uuid: {
          taxonomyTerms: {
            nodes: [getTypenameAndId(taxonomyTermSubject)],
            totalCount: 1,
          },
        },
      })
  },
)
