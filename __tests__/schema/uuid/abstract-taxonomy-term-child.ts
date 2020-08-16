/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import * as R from 'ramda'

import {
  applet,
  article,
  course,
  createEntityTaxonomyTermsQuery,
  event,
  exercise,
  exerciseGroup,
  getTaxonomyTermDataWithoutSubResolvers,
  taxonomyTermSubject,
  video,
} from '../../../__fixtures__'
import {
  EntityPayload,
  EntityType,
  TaxonomyTermChildPayload,
} from '../../../src/graphql/schema'
import { Service } from '../../../src/graphql/schema/types'
import {
  assertSuccessfulGraphQLQuery,
  Client,
  createTestClient,
  createUuidHandler,
} from '../../__utils__'

let client: Client

beforeEach(() => {
  client = createTestClient({
    service: Service.SerloCloudflareWorker,
    user: null,
  }).client
})

type TaxonomyTermChildType = TaxonomyTermChildPayload['__typename']

const taxonomyTermChildFixtures: Record<
  TaxonomyTermChildType,
  EntityPayload
> = {
  [EntityType.Applet]: applet,
  [EntityType.Article]: article,
  [EntityType.Course]: course,
  [EntityType.Event]: event,
  [EntityType.Exercise]: exercise,
  [EntityType.ExerciseGroup]: exerciseGroup,
  [EntityType.Video]: video,
}
const taxonomyTermChildCases = R.toPairs(taxonomyTermChildFixtures) as Array<
  [TaxonomyTermChildType, TaxonomyTermChildPayload]
>

test.each(taxonomyTermChildCases)(
  '%s by id (w/ taxonomyTerms)',
  async (type, entity) => {
    global.server.use(
      createUuidHandler(entity),
      createUuidHandler(taxonomyTermSubject)
    )
    await assertSuccessfulGraphQLQuery({
      ...createEntityTaxonomyTermsQuery(entity),
      data: {
        uuid: {
          taxonomyTerms: {
            nodes: [
              getTaxonomyTermDataWithoutSubResolvers(taxonomyTermSubject),
            ],
            totalCount: 1,
          },
        },
      },
      client,
    })
  }
)
