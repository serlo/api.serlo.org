/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { Matchers } from '@pact-foundation/pact'
import { gql } from 'apollo-server'

import { license } from '../../__fixtures__'
import {
  addMessageInteraction,
  assertSuccessfulGraphQLQuery,
} from '../__utils__'

test('LicenseQuery', async () => {
  await addMessageInteraction({
    given: `there exists an license with id ${license.id}`,
    message: {
      type: 'LicenseQuery',
      payload: {
        id: 1,
      },
    },
    responseBody: {
      id: 1,
      instance: Matchers.string(license.instance),
      default: Matchers.boolean(license.default),
      title: Matchers.string(license.title),
      url: Matchers.string(license.url),
      content: Matchers.string(license.content),
      agreement: Matchers.string(license.agreement),
      iconHref: Matchers.string(license.iconHref),
    },
  })

  await assertSuccessfulGraphQLQuery({
    query: gql`
      query license($id: Int!) {
        license(id: $id) {
          id
          instance
          default
          title
          url
          content
          agreement
          iconHref
        }
      }
    `,
    variables: { id: license.id },
    data: { license },
  })
})
