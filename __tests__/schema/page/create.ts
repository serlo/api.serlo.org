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

import { user as baseUser } from '../../../__fixtures__'
import { given, Client } from '../../__utils__'
import { Model } from '~/internals/graphql'
import { castToAlias, castToUuid, DiscriminatorType } from '~/model/decoder'
import { Instance } from '~/types'

const user = { ...baseUser, roles: ['de_static_pages_builder'] }

describe('PageCreateMutation', () => {
  const input = {
    content: 'content',
    discussionsEnabled: false,
    instance: Instance.De,
    licenseId: 1,
    title: 'title',
    forumId: 123,
  }

  const mutation = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        mutation set($input: CreatePageInput!) {
          page {
            create(input: $input) {
              record {
                currentRevision {
                  title
                  content
                }
              }
              success
            }
          }
        }
      `,
    })
    .withVariables({ input })

  beforeEach(() => {
    given('UuidQuery').for(user)

    given('PageCreateMutation').isDefinedBy((req, res, ctx) => {
      const { content, instance, licenseId, title, userId } = req.body.payload

      const newPageRevisionId = castToUuid(19769)

      const newPage: Model<'Page'> = {
        __typename: DiscriminatorType.Page,
        id: castToUuid(19768),
        trashed: false,
        instance,
        alias: castToAlias(`/19768/${title}`),
        date: new Date().toISOString(),
        currentRevisionId: newPageRevisionId,
        revisionIds: [newPageRevisionId],
        licenseId,
      }

      const newPageRevision: Model<'PageRevision'> = {
        __typename: DiscriminatorType.PageRevision,
        id: newPageRevisionId,
        trashed: false,
        alias: castToAlias(`/${newPageRevisionId}/${title}`),
        title,
        content,
        date: new Date().toISOString(),
        authorId: castToUuid(userId),
        repositoryId: newPage.id,
      }

      given('UuidQuery').for(newPage, newPageRevision)

      return res(ctx.json({ ...newPage }))
    })
  })

  test('returns success and record  when mutation is successfully executed', async () => {
    await mutation.shouldReturnData({
      page: {
        create: {
          success: true,
          record: { currentRevision: { title: 'title', content: 'content' } },
        },
      },
    })
  })

  test('fails when user is not authenticated', async () => {
    await mutation
      .forUnauthenticatedUser()
      .shouldFailWithError('UNAUTHENTICATED')
  })

  test('fails when user does not have role "static_pages_builder"', async () => {
    await mutation.forLoginUser().shouldFailWithError('FORBIDDEN')
  })

  test('fails when `title` or `content` is empty', async () => {
    await mutation
      .withVariables({
        input: {
          ...input,
          content: '',
        },
      })
      .shouldFailWithError('BAD_USER_INPUT')

    await mutation
      .withVariables({
        input: {
          ...input,
          content: 'content',
          title: '',
        },
      })
      .shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer returns a 400er response', async () => {
    given('PageCreateMutation').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('PageCreateMutation').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })
})
