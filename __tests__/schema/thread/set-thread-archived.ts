import gql from 'graphql-tag'

import { article, comment, comment1, user } from '../../../__fixtures__'
import { Client, given } from '../../__utils__'
import { encodeThreadId } from '~/schema/thread/utils'

const mutation = new Client({ userId: user.id })
  .prepareQuery<{
    input: { id: string | string[]; archived: boolean }
  }>({
    query: gql`
      mutation setThreadArchived($input: ThreadSetThreadArchivedInput!) {
        thread {
          setThreadArchived(input: $input) {
            success
          }
        }
      }
    `,
  })
  .withInput({ id: encodeThreadId(comment1.id), archived: true })

beforeEach(() => {
  given('UuidQuery').for(comment, user)
})

test.skip('setting multiple ids', async () => {
  given('ThreadSetThreadArchivedMutation')
    .withPayload({
      userId: user.id,
      ids: [comment1.id, comment.id],
      archived: true,
    })
    .returns(undefined)

  await mutation
    .withInput({
      id: [encodeThreadId(comment1.id), encodeThreadId(comment.id)],
      archived: true,
    })
    .shouldReturnData({ thread: { setThreadArchived: { success: true } } })
})

// TODO: Renable once the mutation was moved into the Api
test.skip('cache gets updated as expected', async () => {
  given('ThreadSetThreadArchivedMutation')
    .withPayload({ userId: user.id, ids: [comment1.id], archived: true })
    .returns(undefined)

  const commentQuery = new Client()
    .prepareQuery({
      query: gql`
        query ($id: Int) {
          uuid(id: $id) {
            ... on ThreadAware {
              threads {
                nodes {
                  archived
                }
              }
            }
          }
        }
      `,
    })
    .withVariables({ id: article.id })

  await commentQuery.shouldReturnData({
    uuid: { threads: { nodes: [{ archived: false }] } },
  })

  await mutation.shouldReturnData({
    thread: { setThreadArchived: { success: true } },
  })

  await commentQuery.shouldReturnData({
    uuid: { threads: { nodes: [{ archived: true }] } },
  })
})

test.skip('unauthenticated user gets error', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})
