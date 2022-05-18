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
import { Instance } from '~/types'

import { article, user } from '../../../__fixtures__'
import { given, Client } from '../../__utils__'

const mutation = new Client({ userId: user.id }).prepareQuery({
  query: gql`
    mutation ($input: EntitySetLicenseInput!) {
      entity {
        setLicense(input: $input) {
          success
        }
      }
    }
  `,
  variables: { input: { entityId: article.id, licenseId: 4 } },
})

const newLicenseId = 4

beforeEach(() => {
  given('UuidQuery').for(user, article)

  given('EntitySetLicenseMutation')
    .withPayload({
      userId: user.id,
      entityId: article.id,
      licenseId: 4,
    })
    .isDefinedBy((_req, res, ctx) => {
      given('UuidQuery').for({ ...article, licenseId: newLicenseId })

      return res(ctx.json({ success: true }))
    })
})

test('returns "{ success: true }" when mutation could be successfully executed', async () => {
  await mutation.shouldReturnData({
    entity: { setLicense: { success: true } },
  })

  await new Client()
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            ... on Article {
              license {
                id
              }
            }
          }
        }
      `,
      variables: { id: article.id },
    })
    .shouldReturnData({ uuid: { license: { id: newLicenseId } } })
})

test('throws UserInputError when license does not exist', async () => {
  await mutation
    .withInput({ entityId: article.id, licenseId: 420 })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('throws UserInputError when instances do not match', async () => {
  given('UuidQuery').for({ ...article, instance: Instance.Es })

  await mutation
    .withInput({ entityId: article.id, licenseId: newLicenseId })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "admin"', async () => {
  await mutation.forLoginUser('de_moderator').shouldFailWithError('FORBIDDEN')
})

test('fails when database layer returns a 400er response', async () => {
  given('EntitySetLicenseMutation').returnsBadRequest()

  await mutation.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer has an internal error', async () => {
  given('EntitySetLicenseMutation').hasInternalServerError()

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
