import gql from 'graphql-tag'
import { HttpResponse } from 'msw'

import {
  article as baseArticle,
  articleRevision,
  taxonomyTermSubject,
  user as baseUser,
  emptySubjects,
} from '../../../__fixtures__'
import { given, getTypenameAndId, nextUuid, Client } from '../../__utils__'
import { Instance } from '~/types'

const user = { ...baseUser, roles: ['de_reviewer'] }
const article = {
  ...baseArticle,
  instance: Instance.De,
  currentRevision: articleRevision.id,
}
const currentRevision = {
  ...articleRevision,
  id: nextUuid(articleRevision.id),
  trashed: false,
}

const mutation = new Client({ userId: user.id })
  .prepareQuery({
    query: gql`
      mutation ($input: RejectRevisionInput!) {
        entity {
          rejectRevision(input: $input) {
            success
          }
        }
      }
    `,
  })
  .withInput({ revisionId: currentRevision.id, reason: 'reason' })

beforeEach(() => {
  given('UuidQuery').for(user, article, articleRevision, currentRevision)
  given('UnrevisedEntitiesQuery').for([article])

  given('EntityRejectRevisionMutation')
    .withPayload({
      userId: user.id,
      reason: 'reason',
      revisionId: currentRevision.id,
    })
    .isDefinedBy(() => {
      given('UuidQuery').for({ ...currentRevision, trashed: true })
      given('UnrevisedEntitiesQuery').for([])

      return HttpResponse.json({ success: true })
    })
})

test('returns "{ success: true }" when mutation could be successfully executed', async () => {
  await mutation.shouldReturnData({
    entity: { rejectRevision: { success: true } },
  })
})

test('following queries for entity point to checkout revision when entity is already in the cache', async () => {
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
    entity: { rejectRevision: { success: true } },
  })

  await revisionQuery.shouldReturnData({ uuid: { trashed: true } })
})

test('after the reject mutation the cache is cleared for unrevisedEntities', async () => {
  const unrevisedEntitiesQuery = new Client()
    .prepareQuery({
      query: gql`
        query ($instance: Instance!) {
          subject {
            subjects(instance: $instance) {
              unrevisedEntities {
                nodes {
                  __typename
                  id
                }
              }
            }
          }
        }
      `,
    })
    .withVariables({ instance: taxonomyTermSubject.instance })

  await unrevisedEntitiesQuery.shouldReturnData({
    subject: {
      subjects: [
        { unrevisedEntities: { nodes: [getTypenameAndId(article)] } },
        ...emptySubjects,
      ],
    },
  })

  await mutation.shouldReturnData({
    entity: { rejectRevision: { success: true } },
  })

  await unrevisedEntitiesQuery.shouldReturnData({
    subject: {
      subjects: [{ unrevisedEntities: { nodes: [] } }, ...emptySubjects],
    },
  })
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

test('fails when user does not have role "reviewer"', async () => {
  const newMutation = await mutation.forUser('de_moderator')
  await newMutation.shouldFailWithError('FORBIDDEN')
})

test('fails when database layer returns a 400er response', async () => {
  given('EntityRejectRevisionMutation').returnsBadRequest()

  await mutation.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer has an internal error', async () => {
  given('EntityRejectRevisionMutation').hasInternalServerError()

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
