import gql from 'graphql-tag'

import {
  article,
  page,
  pageRevision,
  taxonomyTermRoot,
  user as baseUser,
  taxonomyTermSubject,
  user,
  articleRevision,
} from '../../../__fixtures__'
import { Client } from '../../__utils__'

const uuids = [article.id, page.id, taxonomyTermSubject.id]
const mutation = new Client({ userId: 1 }).prepareQuery({
  query: gql`
    mutation uuid($input: UuidSetStateInput!) {
      uuid {
        setState(input: $input) {
          success
        }
      }
    }
  `,
  variables: { input: { id: uuids, trashed: true } },
})
const query = new Client().prepareQuery({
  query: gql`
    query ($id: Int!) {
      uuid(id: $id) {
        trashed
      }
    }
  `,
  variables: { id: taxonomyTermSubject.id },
})

test('set state of an uuid', async () => {
  await query.shouldReturnData({ uuid: { trashed: false } })

  await mutation.shouldReturnData({ uuid: { setState: { success: true } } })

  await query.shouldReturnData({ uuid: { trashed: true } })

  await mutation
    .changeInput({ trashed: false })
    .shouldReturnData({ uuid: { setState: { success: true } } })

  await query.shouldReturnData({ uuid: { trashed: false } })
})

test('fails when user shall be deletd', async () => {
  await mutation
    .changeInput({ id: user.id, trashed: true })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails when article revision shall be deleted', async () => {
  await mutation
    .changeInput({ id: articleRevision.id })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails for login user', async () => {
  await mutation.forLoginUser().shouldFailWithError('FORBIDDEN')
})
