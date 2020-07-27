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
import { Matchers } from '@pact-foundation/pact'

import { createLicenseQuery, license } from '../../__fixtures__'
import { addJsonInteraction, assertSuccessfulGraphQLQuery } from '../__utils__'

test('License', async () => {
  await addJsonInteraction({
    name: `fetch data of license with id ${license.id}`,
    given: `there exists an license with id ${license.id}`,
    path: `/api/license/${license.id}`,
    body: {
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
    ...createLicenseQuery(license),
    data: {
      license,
    },
  })
})
