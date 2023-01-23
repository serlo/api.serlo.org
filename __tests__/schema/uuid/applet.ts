/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2023 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2023 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { gql } from 'apollo-server'
import R from 'ramda'

import { applet, appletRevision } from '../../../__fixtures__'
import { given, Client } from '../../__utils__'

test('Applet', async () => {
  given('UuidQuery').for(applet)

  await new Client()
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on Applet {
              id
              trashed
              instance
              date
            }
          }
        }
      `,
    })
    .withVariables({ id: applet.id })
    .shouldReturnData({
      uuid: R.pick(['__typename', 'id', 'trashed', 'instance', 'date'], applet),
    })
})

test('AppletRevision', async () => {
  given('UuidQuery').for(appletRevision)

  await new Client()
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on AppletRevision {
              id
              trashed
              date
              url
              title
              content
              changes
              metaTitle
              metaDescription
            }
          }
        }
      `,
    })
    .withVariables(appletRevision)
    .shouldReturnData({
      uuid: R.pick(
        [
          '__typename',
          'id',
          'trashed',
          'date',
          'url',
          'title',
          'content',
          'changes',
          'metaTitle',
          'metaDescription',
        ],
        appletRevision
      ),
    })
})
