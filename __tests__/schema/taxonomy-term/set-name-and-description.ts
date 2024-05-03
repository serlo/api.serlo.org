import gql from 'graphql-tag'

import { Client } from '../../__utils__'

const input = {
  description: 'a description',
  name: 'a name',
  id: 5,
}

const mutation = new Client({ userId: 1 })
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

const query = new Client().prepareQuery({
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
  variables: { id: input.id },
})

test('updates name and description', async () => {
  await query.shouldReturnData({ uuid: { name: 'Mathe', description: null } })

  await mutation.shouldReturnData({
    taxonomyTerm: { setNameAndDescription: { success: true } },
  })

  await query.shouldReturnData({
    uuid: { name: input.name, description: input.description },
  })
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "architect"', async () => {
  await mutation.forLoginUser().shouldFailWithError('FORBIDDEN')
})

test('fails when `name` is empty', async () => {
  await mutation.changeInput({ name: '' }).shouldFailWithError('BAD_USER_INPUT')
})

test('fails when `id` does not belong to a taxonomy term', async () => {
  await mutation.changeInput({ id: 1 }).shouldFailWithError('BAD_USER_INPUT')
})
