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
import fetch from 'node-fetch'

import { AliasPayload } from '../../src/schema'
import { Instance } from '../../src/types'
import { addJsonInteraction } from '../__utils__'

test('Alias', async () => {
  // This is a noop test that just adds the interaction to the contract
  const alias: AliasPayload = {
    id: 19767,
    instance: Instance.De,
    path: '/mathe',
  }
  await addJsonInteraction({
    name: 'fetch data of alias /mathe',
    given: '/mathe is alias of 19767',
    path: '/api/alias/mathe',
    body: {
      id: alias.id,
      instance: Matchers.string(alias.instance),
      path: Matchers.string(alias.path),
    },
  })
  await fetch(`http://de.${process.env.SERLO_ORG_HOST}/api/alias/mathe`)
})

test('Alias (URL /user/profile/:username)', async () => {
  await addJsonInteraction({
    name: 'fetch data of alias /user/profile/admin',
    given: 'user "admin" has id 1',
    path: '/api/alias/user/profile/admin',
    body: {
      id: Matchers.integer(1),
      instance: Matchers.string('de'),
      path: '/user/profile/admin',
      source: Matchers.term({
        matcher: '\\/user\\/profile\\/\\d+',
        generate: '/user/profile/1',
      }),
      timestamp: Matchers.iso8601DateTime('2014-03-01T20:36:21+01:00'),
    },
  })
  await fetch(
    `http://de.${process.env.SERLO_ORG_HOST}/api/alias/user/profile/admin`
  )
})
