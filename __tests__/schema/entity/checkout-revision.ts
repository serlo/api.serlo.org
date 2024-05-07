import gql from 'graphql-tag'
import { HttpResponse } from 'msw'

import {
  article as baseArticle,
  articleRevision,
  user as baseUser,
  taxonomyTermSubject,
  emptySubjects,
} from '../../../__fixtures__'
import { getTypenameAndId, nextUuid, given, Client } from '../../__utils__'
import { Instance } from '~/types'

const user = { ...baseUser, roles: ['de_reviewer'] }
const article = {
  ...baseArticle,
  instance: Instance.De,
  currentRevision: articleRevision.id,
}
const unrevisedRevision = {
  ...articleRevision,
  id: nextUuid(articleRevision.id),
  trashed: true,
}
const mutation = new Client({ userId: user.id })
  .prepareQuery({
    query: gql`
      mutation ($input: CheckoutRevisionInput!) {
        entity {
          checkoutRevision(input: $input) {
            success
          }
        }
      }
    `,
  })
  .withInput({
    revisionId: unrevisedRevision.id,
    reason: 'reason',
  })

beforeEach(() => {
  given('UuidQuery').for(user, article, articleRevision, unrevisedRevision)
  given('UnrevisedEntitiesQuery').for([article])

  given('EntityCheckoutRevisionMutation')
    .withPayload({
      userId: user.id,
      reason: 'reason',
      revisionId: unrevisedRevision.id,
    })
    .isDefinedBy(() => {
      given('UuidQuery').for({ ...unrevisedRevision, trashed: false })
      given('UuidQuery').for({
        ...article,
        currentRevisionId: unrevisedRevision.id,
      })
      given('UnrevisedEntitiesQuery').for([])

      return HttpResponse.json({ success: true })
    })
})

test('returns "{ success: true }" when mutation could be successfully executed', async () => {
  await mutation.shouldReturnData({
    entity: { checkoutRevision: { success: true } },
  })
})

test('following queries for entity point to checkout revision when entity is already in the cache', async () => {
  const articleQuery = new Client()
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            ... on Article {
              currentRevision {
                id
              }
            }
          }
        }
      `,
    })
    .withVariables({ id: article.id })

  await articleQuery.shouldReturnData({
    uuid: { currentRevision: { id: articleRevision.id } },
  })

  await mutation.shouldReturnData({
    entity: { checkoutRevision: { success: true } },
  })

  await articleQuery.shouldReturnData({
    uuid: { currentRevision: { id: unrevisedRevision.id } },
  })
})

test('checkout revision has trashed == false for following queries', async () => {
  const revisionQuery = new Client()
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            ... on ArticleRevision {
              trashed
            }
          }
        }
      `,
    })
    .withVariables({ id: unrevisedRevision.id })

  await revisionQuery.shouldReturnData({ uuid: { trashed: true } })

  await mutation.shouldReturnData({
    entity: { checkoutRevision: { success: true } },
  })

  await revisionQuery.shouldReturnData({ uuid: { trashed: false } })
})

test('after the checkout mutation the cache is cleared for unrevisedEntities', async () => {
  given('UuidQuery').for(article)

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
    entity: { checkoutRevision: { success: true } },
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
  await mutation.forLoginUser('de_moderator').shouldFailWithError('FORBIDDEN')
})

test('fails when database layer returns a 400er response', async () => {
  given('EntityCheckoutRevisionMutation').returnsBadRequest()

  await mutation.shouldFailWithError('BAD_USER_INPUT')
})

test('fails when database layer has an internal error', async () => {
  given('EntityCheckoutRevisionMutation').hasInternalServerError()

  await mutation.shouldFailWithError('INTERNAL_SERVER_ERROR')
})
