import gql from 'graphql-tag'
import { HttpResponse } from 'msw'

import {
  article,
  exercise,
  user as baseUser,
  taxonomyTermCurriculumTopic,
  taxonomyTermSubject,
  video,
} from '../../../__fixtures__'
import { Client, given } from '../../__utils__'

const user = { ...baseUser, roles: ['de_architect'] }

const input = {
  entityIds: [video.id, exercise.id],
  taxonomyTermId: taxonomyTermCurriculumTopic.id,
}

const mutation = new Client({ userId: user.id })
  .prepareQuery({
    query: gql`
      mutation ($input: TaxonomyEntityLinksInput!) {
        taxonomyTerm {
          createEntityLinks(input: $input) {
            success
          }
        }
      }
    `,
  })
  .withInput(input)

beforeEach(() => {
  given('UuidQuery').for(
    article,
    exercise,
    video,
    taxonomyTermSubject,
    taxonomyTermCurriculumTopic,
    user,
  )

  given('TaxonomyCreateEntityLinksMutation')
    .withPayload({ ...input, userId: user.id })
    .isDefinedBy(() => {
      given('UuidQuery').for({
        ...exercise,
        taxonomyTermIds: [
          ...exercise.taxonomyTermIds,
          taxonomyTermCurriculumTopic.id,
        ],
      })
      given('UuidQuery').for({
        ...taxonomyTermCurriculumTopic,
        childrenIds: [...taxonomyTermCurriculumTopic.childrenIds, exercise.id],
      })
      return HttpResponse.json({ success: true })
    })
})

test('returns { success, record } when mutation could be successfully executed', async () => {
  await mutation.shouldReturnData({
    taxonomyTerm: {
      createEntityLinks: {
        success: true,
      },
    },
  })
})

test('updates the cache', async () => {
  const childQuery = new Client({ userId: user.id })
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            ... on Exercise {
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
    .withVariables({ id: exercise.id })

  await childQuery.shouldReturnData({
    uuid: {
      taxonomyTerms: {
        nodes: [{ id: exercise.taxonomyTermIds[0] }],
      },
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
    uuid: {
      children: {
        nodes: [{ id: taxonomyTermCurriculumTopic.childrenIds[0] }],
      },
    },
  })

  await mutation.execute()

  await childQuery.shouldReturnData({
    uuid: {
      taxonomyTerms: {
        nodes: [
          { id: exercise.taxonomyTermIds[0] },
          { id: taxonomyTermCurriculumTopic.id },
        ],
      },
    },
  })

  await parentQuery.shouldReturnData({
    uuid: {
      children: {
        nodes: [
          { id: taxonomyTermCurriculumTopic.childrenIds[0] },
          { id: exercise.id },
        ],
      },
    },
  })
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "architect"', async () => {
  await mutation.forLoginUser().shouldFailWithError('FORBIDDEN')
})

test('fails when database layer returns a 400er response', async () => {
  given('TaxonomyCreateEntityLinksMutation').returnsBadRequest()

  await mutation.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer has an internal error', async () => {
  given('TaxonomyCreateEntityLinksMutation').hasInternalServerError()

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
