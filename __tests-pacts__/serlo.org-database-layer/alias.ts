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

import { addMessageInteraction } from '../__utils__'
import { Payload } from '~/internals/model'
import { Instance } from '~/types'

test('AliasQuery', async () => {
  const alias: Payload<'serlo', 'getAlias'> = {
    id: 19767,
    instance: Instance.De,
    path: '/mathe',
  }
  await addMessageInteraction({
    given: '/mathe is alias of 19767',
    message: {
      type: 'AliasQuery',
      payload: {
        instance: alias.instance,
        path: alias.path,
      },
    },
    responseBody: {
      id: alias.id,
      instance: alias.instance,
      path: Matchers.string(alias.path),
    },
  })
  const response = await global.serloModel.getAlias(alias)
  expect(response).toEqual(alias)
})

test('AliasQuery (/user/profile/:username)', async () => {
  const alias: Payload<'serlo', 'getAlias'> = {
    id: 1,
    instance: Instance.De,
    path: '/user/1/admin',
  }
  await addMessageInteraction({
    given: 'user "admin" has id 1',
    message: {
      type: 'AliasQuery',
      payload: {
        instance: alias.instance,
        path: alias.path,
      },
    },
    responseBody: {
      id: alias.id,
      instance: alias.instance,
      path: Matchers.string(alias.path),
    },
  })
  const response = await global.serloModel.getAlias(alias)
  expect(response).toEqual(alias)
})
