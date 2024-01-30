import gql from 'graphql-tag'
import { HttpResponse } from 'msw'

import {
  taxonomyTermCurriculumTopic,
  user as baseUser,
} from '../../../__fixtures__'
import { Client, given } from '../../__utils__'

describe('TaxonomyTermSetNameAndDescriptionMutation', () => {
  const user = { ...baseUser, roles: ['de_architect'] }

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
      .withPayload({ ...input, userId: user.id })
      .returns({ success: true })

    await mutation.shouldReturnData({
      taxonomyTerm: { setNameAndDescription: { success: true } },
    })
  })

  test('fails when user is not authenticated', async () => {
    await mutation
      .forUnauthenticatedUser()
      .shouldFailWithError('UNAUTHENTICATED')
  })

  test('fails when user does not have role "architect"', async () => {
    await mutation.forLoginUser().shouldFailWithError('FORBIDDEN')
  })

  test('fails when `name` is empty', async () => {
    await mutation
      .withInput({ ...input, name: '' })
      .shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer returns a 400er response', async () => {
    given('TaxonomyTermSetNameAndDescriptionMutation').returnsBadRequest()

    await mutation.shouldFailWithError('BAD_USER_INPUT')
  })

  test('fails when database layer has an internal error', async () => {
    given('TaxonomyTermSetNameAndDescriptionMutation').hasInternalServerError()

    await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
  })

  test('updates the cache', async () => {
    const query = new Client({ userId: user.id })
      .prepareQuery({
        query: gql`
          query ($id: Int!) {
            uuid(id: $id) {
              ... on TaxonomyTerm {
                name
                description
              }
            }
          }
        `,
      })
      .withVariables({ id: taxonomyTermCurriculumTopic.id })

    await query.shouldReturnData({
      uuid: {
        name: taxonomyTermCurriculumTopic.name,
        description: taxonomyTermCurriculumTopic.description,
      },
    })

    given('TaxonomyTermSetNameAndDescriptionMutation')
      .withPayload({
        ...input,
        userId: user.id,
      })
      .isDefinedBy(async ({ request }) => {
        const body = await request.json()
        const { name, description } = body.payload

        given('UuidQuery').for({
          ...taxonomyTermCurriculumTopic,
          name,
          description,
        })

        return HttpResponse.json({ success: true })
      })
    await mutation.shouldReturnData({
      taxonomyTerm: { setNameAndDescription: { success: true } },
    })

    await query.shouldReturnData({
      uuid: { name: 'a name', description: 'a description' },
    })
  })
})
