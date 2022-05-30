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
import { page as basePage } from "../../../__fixtures__";
import {given, Client, Query, nextUuid} from '../../__utils__'
import { Instance } from '~/types'

let client: Client
let query: Query



const page = { ...basePage, instance: Instance.En}
const page2 = { ...basePage, id: nextUuid(page.id)}

beforeEach(() => {
  client = new Client()

  query = client.prepareQuery({
    query: gql`
      query ($input: PagesInput!) {
        page {
          pages(input: $input) {
            success
              pages {
                id
              }
          }
        }
      }
    `,
    variables: { input: {}}
  })

  given('UuidQuery').for(page, page2)
  given('PageQuery').isDefinedBy((req, res, ctx) => {
    const { instance } = req.body.payload

    if (instance === Instance.En){
      return res(ctx.json({success: true, pages: [page]}))
    }
    return res(ctx.json({success: true, pages: [page, page2] }))
  })
})

test('returns all pages', async () => {
  await query.withVariables({input: {instance: Instance.En}}).shouldReturnData({
    page: {
      pages: {
        success: true,
        pages: [page, page2]
      }
    },
  })
})

test('returns english pages', async () => {
  await query.withVariables({input: {instance: Instance.En}}).shouldReturnData({
    page: {
      pages: {
        success: true,
        pages: [page]
      }
    },
  })
})

test('fails when database layer has an internal error', async () => {
  given('PageQuery').hasInternalServerError()

  await query.shouldFailWithError('INTERNAL_SERVER_ERROR')
})