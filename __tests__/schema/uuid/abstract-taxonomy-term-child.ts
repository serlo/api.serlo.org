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
  }
)
