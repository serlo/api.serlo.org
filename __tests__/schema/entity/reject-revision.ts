import gql from 'graphql-tag'

import { user } from '../../../__fixtures__'
import {
  Client,
  expectEvent,
  entityQuery,
  entityRevisionQuery,
  userQueryUnrevisedEntities,
} from '../../__utils__'
import { NotificationEventType } from '~/model/decoder'

const input = { revisionId: 35290, reason: 'reason' }
const mutation = new Client({ userId: user.id }).prepareQuery({
  query: gql`
    mutation ($input: RejectRevisionInput!) {
      entity {
        rejectRevision(input: $input) {
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
        unrevisedEntities: { nodes: [{ id: 35247 }, { id: 34907 }] },
      },
    })

  await entityRevisionQuery
    .withVariables({ id: input.revisionId })
    .shouldReturnData({ uuid: { trashed: false } })

  await mutation.shouldReturnData({
    entity: { rejectRevision: { success: true } },
  })

  await entityQuery.withVariables({ id: 35247 }).shouldReturnData({
    uuid: { currentRevision: { id: 35248 } },
  })

  await entityRevisionQuery
    .withVariables({ id: input.revisionId })
    .shouldReturnData({ uuid: { trashed: true } })

  await userQueryUnrevisedEntities
    .withVariables({ id: 26334 })
    .shouldReturnData({
      uuid: { unrevisedEntities: { nodes: [{ id: 34907 }] } },
    })

  await expectEvent({
    __typename: NotificationEventType.RejectRevision,
    objectId: input.revisionId,
  })
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "reviewer"', async () => {
  const newMutation = await mutation.forUser('de_moderator')
  await newMutation.shouldFailWithError('FORBIDDEN')
})
