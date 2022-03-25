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

import { taxonomyTermCurriculumTopic, user } from '../../../__fixtures__'
import { Client, given } from '../../__utils__'

describe('TaxonomyTermSetNameAndDescriptionMutation', () => {
  const input = {
    description: 'a description',
    name: 'a name',
    id: taxonomyTermCurriculumTopic.id,
  }

  const mutation = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        mutation set($input: TaxonomyTermSetNameAndDescriptionInput!) {
          taxonomyTerm {
            setNameAndDescription(input: $input) {
              success
            }
          }
        }
      `,
    })
    .withVariables({ input })

  beforeEach(() => {
    given('UuidQuery').for(user, taxonomyTermCurriculumTopic)
  })

  test('returns "{ success: true }" when mutation could be successfully executed', async () => {
    given('TaxonomyTermSetNameAndDescriptionMutation')
      .withPayload({
        ...input,
        userId: user.id,
      })
      .returns({ success: true })

    await mutation.shouldReturnData({
      taxonomyTerm: { setNameAndDescription: { success: true } },
    })
  })
})
