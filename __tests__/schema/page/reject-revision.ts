import gql from 'graphql-tag'
import { HttpResponse } from 'msw'

import {
  page as basePage,
  pageRevision,
  user as baseUser,
} from '../../../__fixtures__'
import { given, nextUuid, Client } from '../../__utils__'
import { Instance } from '~/types'

const user = { ...baseUser, roles: ['de_static_pages_builder'] }
const page = {
  ...basePage,
  instance: Instance.De,
  currentRevision: pageRevision.id,
}
const currentRevision = {
  ...pageRevision,
  id: nextUuid(pageRevision.id),
  trashed: false,
}
const mutation = new Client({ userId: user.id })
  .prepareQuery({
    query: gql`
      mutation ($input: RejectRevisionInput!) {
        page {
          rejectRevision(input: $input) {
            success
          }
        }
      }
    `,
  })
  .withInput({ revisionId: currentRevision.id, reason: 'reason' })

beforeEach(() => {
  given('UuidQuery').for(user, page, pageRevision, currentRevision)
  given('PageRejectRevisionMutation')
    .withPayload({
      userId: user.id,
      reason: 'reason',
      revisionId: currentRevision.id,
    })
    .isDefinedBy(() => {
      given('UuidQuery').for({ ...currentRevision, trashed: true })

      return HttpResponse.json({ success: true })
    })
})

test('returns "{ success: true }" when mutation could be successfully executed', async () => {
  await mutation.shouldReturnData({
    page: { rejectRevision: { success: true } },
  })
})

test('following queries for page point to checkout revision when page is already in the cache', async () => {
  const revisionQuery = new Client()
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            trashed
          }
        }
      `,
    })
    .withVariables({ id: currentRevision.id })

  await revisionQuery.shouldReturnData({ uuid: { trashed: false } })

  await mutation.shouldReturnData({
    page: { rejectRevision: { success: true } },
  })

  await revisionQuery.shouldReturnData({ uuid: { trashed: true } })
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "static_pages_builder"', async () => {
  await mutation.forLoginUser('de_moderator').shouldFailWithError('FORBIDDEN')
})

test('fails when database layer returns a 400er response', async () => {
  given('PageRejectRevisionMutation').returnsBadRequest()

  await mutation.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer has an internal error', async () => {
  given('PageRejectRevisionMutation').hasInternalServerError()

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
