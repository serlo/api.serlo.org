import gql from 'graphql-tag'
import { HttpResponse } from 'msw'

import { article, user } from '../../../__fixtures__'
import { given, Client } from '../../__utils__'

const mutation = new Client({ userId: user.id })
  .prepareQuery({
    query: gql`
      mutation ($input: EntityUpdateLicenseInput!) {
        entity {
          updateLicense(input: $input) {
            success
          }
        }
      }
    `,
  })
  .withInput({ entityId: article.id, licenseId: 4 })

const newLicenseId = 4

beforeEach(() => {
  given('UuidQuery').for(user, article)

  given('EntitySetLicenseMutation')
    .withPayload({
      userId: user.id,
      entityId: article.id,
      licenseId: 4,
    })
    .isDefinedBy(() => {
      given('UuidQuery').for({ ...article, licenseId: newLicenseId })

      return HttpResponse.json({ success: true })
    })
})

test('returns "{ success: true }" when mutation could be successfully executed', async () => {
  await mutation.shouldReturnData({
    entity: { updateLicense: { success: true } },
  })

  await new Client()
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            ... on Article {
              licenseId
            }
          }
        }
      `,
    })
    .withVariables({ id: article.id })
    .shouldReturnData({ uuid: { licenseId: newLicenseId } })
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "admin"', async () => {
  const newMutation = await mutation.forUser('de_moderator')
  await newMutation.shouldFailWithError('FORBIDDEN')
})

test('fails when database layer returns a 400er response', async () => {
  given('EntitySetLicenseMutation').returnsBadRequest()

  await mutation.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer has an internal error', async () => {
  given('EntitySetLicenseMutation').hasInternalServerError()

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
