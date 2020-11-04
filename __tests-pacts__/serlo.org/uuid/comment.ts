import { Matchers } from '@pact-foundation/pact'
import { gql } from 'apollo-server'

import {
  comment1,
  getCommentDataWithoutSubresolvers,
} from '../../../__fixtures__/uuid/comment'
import { CommentPayload } from '../../../src/graphql/schema/uuid/comment/types'
import {
  addUuidInteraction,
  assertSuccessfulGraphQLQuery,
} from '../../__utils__'

test('Comment', async () => {
  await addUuidInteraction<CommentPayload>({
    __typename: comment1.__typename,
    id: comment1.id,
    trashed: Matchers.boolean(comment1.trashed),
    alias: null,
    authorId: Matchers.integer(comment1.authorId),
    title: Matchers.string(comment1.title),
    date: Matchers.iso8601DateTime(comment1.date),
    archived: Matchers.boolean(comment1.archived),
    content: Matchers.string(comment1.content),
    parentId: Matchers.integer(comment1.parentId),
    childrenIds: Matchers.eachLike(Matchers.integer(1)),
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      query comments($id: Int!) {
        uuid(id: $id) {
          __typename
          ... on Comment {
            __typename
            trashed
            id
            content
            alias
            title
            archived
          }
        }
      }
    `,
    variables: comment1,
    data: {
      uuid: getCommentDataWithoutSubresolvers(comment1),
    },
  })
})
