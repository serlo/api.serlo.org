import gql from 'graphql-tag'
import { HttpResponse } from 'msw'

import { user as baseUser } from '../../../__fixtures__'
import { given, Client } from '../../__utils__'
import { Model } from '~/internals/graphql'
import { DiscriminatorType } from '~/model/decoder'
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

    given('PageCreateMutation').isDefinedBy(async ({ request }) => {
      const body = await request.json()
      const { content, instance, licenseId, title, userId } = body.payload

      const newPageRevisionId = 19769

      const newPage: Model<'Page'> = {
        __typename: DiscriminatorType.Page,
        id: 19768,
        trashed: false,
        instance,
        alias: `/19768/${title}`,
        date: new Date().toISOString(),
        currentRevisionId: newPageRevisionId,
        revisionIds: [newPageRevisionId],
        licenseId,
      }

      const newPageRevision: Model<'PageRevision'> = {
        __typename: DiscriminatorType.PageRevision,
        id: newPageRevisionId,
        trashed: false,
        alias: `/${newPageRevisionId}/${title}`,
        title,
        content,
        date: new Date().toISOString(),
        authorId: userId,
        repositoryId: newPage.id,
      }

      given('UuidQuery').for(newPage, newPageRevision)

      return HttpResponse.json({ ...newPage })
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
      .withInput({
        ...input,
        content: '',
      })
      .shouldFailWithError('BAD_USER_INPUT')

    await mutation
      .withInput({
        ...input,
        content: 'content',
        title: '',
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
