import gql from 'graphql-tag'
import { HttpResponse } from 'msw'

import {
  article,
  user as baseUser,
  taxonomyTermCurriculumTopic,
} from '../../../__fixtures__'
import { Client, given } from '../../__utils__'

const user = { ...baseUser, roles: ['de_architect'] }

const input = {
  entityIds: [article.id],
  taxonomyTermId: taxonomyTermCurriculumTopic.id,
}

const mutation = new Client({ userId: user.id })
  .prepareQuery({
    query: gql`
      mutation ($input: TaxonomyEntityLinksInput!) {
        taxonomyTerm {
          deleteEntityLinks(input: $input) {
            success
          }
        }
      }
    `,
  })
  .withInput(input)

beforeEach(() => {
  given('UuidQuery').for(
    { ...article, taxonomyTermIds: [taxonomyTermCurriculumTopic.id] },
    taxonomyTermCurriculumTopic,
    user,
  )

  given('TaxonomyDeleteEntityLinksMutation')
    .withPayload({ ...input, userId: user.id })
    .isDefinedBy(() => {
      given('UuidQuery').for({
        ...article,
        taxonomyTermIds: [],
      })
      given('UuidQuery').for({
        ...taxonomyTermCurriculumTopic,
        childrenIds: [],
      })
      return HttpResponse.json({ success: true })
    })
})

test('returns { success, record } when mutation could be successfully executed', async () => {
  await mutation.shouldReturnData({
    taxonomyTerm: { deleteEntityLinks: { success: true } },
  })
})

test('updates the cache', async () => {
  const childQuery = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            ... on Article {
              taxonomyTerms {
                nodes {
                  id
                }
              }
            }
          }
        }
      `,
    })
    .withVariables({ id: article.id })

  await childQuery.shouldReturnData({
    uuid: {
      taxonomyTerms: { nodes: [{ id: taxonomyTermCurriculumTopic.id }] },
    },
  })

  const parentQuery = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            ... on TaxonomyTerm {
              children {
                nodes {
                  id
                }
              }
            }
          }
        }
      `,
    })
    .withVariables({ id: taxonomyTermCurriculumTopic.id })

  await parentQuery.shouldReturnData({
    uuid: { children: { nodes: [{ id: article.id }] } },
  })

  await mutation.execute()

  await parentQuery.shouldReturnData({ uuid: { children: { nodes: [] } } })
  await childQuery.shouldReturnData({ uuid: { taxonomyTerms: { nodes: [] } } })
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "architect"', async () => {
  await mutation.forLoginUser().shouldFailWithError('FORBIDDEN')
})

test('fails when database layer returns a 400er response', async () => {
  given('TaxonomyDeleteEntityLinksMutation').returnsBadRequest()

  await mutation.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer has an internal error', async () => {
  given('TaxonomyDeleteEntityLinksMutation').hasInternalServerError()

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
