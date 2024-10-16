import gql from 'graphql-tag'

import { user } from '../../../__fixtures__'
import {
  Client,
  userQueryUnrevisedEntities,
  expectEvent,
  entityQuery,
  entityRevisionQuery,
} from '../../__utils__'
import { NotificationEventType } from '~/model/decoder'

const input = { revisionId: 35290, reason: 'reason' }
const mutation = new Client({ userId: user.id }).prepareQuery({
  query: gql`
    mutation ($input: CheckoutRevisionInput!) {
      entity {
        checkoutRevision(input: $input) {
          success
        }
      }
    }
  `,
  variables: { input },
})

test('checks out a revision', async () => {
  await entityQuery.withVariables({ id: 35247 }).shouldReturnData({
    uuid: { currentRevision: { id: 35248 } },
  })

  await userQueryUnrevisedEntities
    .withVariables({ id: 26334 })
    .shouldReturnData({
      uuid: {
        unrevisedEntities: { nodes: [{ id: 34907 }, { id: 35247 }] },
      },
    })

  await mutation.shouldReturnData({
    entity: { checkoutRevision: { success: true } },
  })

  await entityQuery.withVariables({ id: 35247 }).shouldReturnData({
    uuid: { currentRevision: { id: 35290 } },
  })

  await userQueryUnrevisedEntities
    .withVariables({ id: 26334 })
    .shouldReturnData({
      uuid: { unrevisedEntities: { nodes: [{ id: 34907 }] } },
    })

  await expectEvent({
    __typename: NotificationEventType.CheckoutRevision,
    objectId: input.revisionId,
  })
})

test('allows to checkout a revision for pages for static pages builder', async () => {
  const newMutation = await mutation
    .changeInput({ revisionId: 35476 })
    .forUser('de_static_pages_builder')
  await newMutation.shouldReturnData({
    entity: { checkoutRevision: { success: true } },
  })
})

test('checkout revision has trashed == false for following queries', async () => {
  await databaseForTests.mutate('update uuid set trashed = 1 where id = ?', [
    input.revisionId,
  ])

  await entityRevisionQuery
    .withVariables({ id: input.revisionId })
    .shouldReturnData({
      uuid: { trashed: true },
    })

  await mutation.shouldReturnData({
    entity: { checkoutRevision: { success: true } },
  })

  await entityRevisionQuery
    .withVariables({ id: input.revisionId })
    .shouldReturnData({
      uuid: { trashed: false },
    })
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "reviewer"', async () => {
  const newMutation = await mutation.forUser('de_moderator')
  await newMutation.shouldFailWithError('FORBIDDEN')
})
