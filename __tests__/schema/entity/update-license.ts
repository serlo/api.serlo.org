import gql from 'graphql-tag'

import { user } from '../../../__fixtures__'
import { Client, expectEvent, entityQuery } from '../../__utils__'
import { NotificationEventType } from '~/model/decoder'

const input = { entityId: 1855, licenseId: 4 }
const mutation = new Client({ userId: user.id }).prepareQuery({
  query: gql`
    mutation ($input: EntityUpdateLicenseInput!) {
      entity {
        updateLicense(input: $input) {
          success
        }
      }
    }
  `,
  variables: { input },
})

test('Updates license of an entity', async () => {
  await entityQuery
    .withVariables({ id: input.entityId })
    .shouldReturnData({ uuid: { licenseId: 1 } })

  await mutation.shouldReturnData({
    entity: { updateLicense: { success: true } },
  })

  await entityQuery
    .withVariables({ id: input.entityId })
    .shouldReturnData({ uuid: { licenseId: 4 } })

  await expectEvent({
    __typename: NotificationEventType.SetLicense,
    objectId: input.entityId,
  })
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "admin"', async () => {
  const newMutation = await mutation.forUser('de_moderator')
  await newMutation.shouldFailWithError('FORBIDDEN')
})
