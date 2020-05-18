import { Matchers } from '@pact-foundation/pact'

import {
  CommentPayload,
  ThreadPayload,
} from '../../src/graphql/schema/thread/schema'

export function addCommentInteraction(
  id: string,
  payload: Omit<CommentPayload, 'parentId'>
) {
  return addJsonInteraction({
    name: `fetch comment ${payload.id} of parent ${id}`,
    given: '',
    path: `/comment/${payload.id}`,
    body: {
      id: payload.id,
      content: Matchers.string(payload.content),
      createdAt: Matchers.iso8601DateTime(payload.createdAt),
      updatedAt: Matchers.iso8601DateTime(payload.updatedAt),
      authorId: Matchers.integer(payload.authorId),
      parentId: Matchers.string(id),
    },
  })
}

export function addThreadInteraction(
  id: number,
  payload: Omit<ThreadPayload, 'parentId'>
) {
  return addJsonInteraction({
    name: `fetch thread ${payload.id} of parent ${id}`,
    given: '',
    path: `/thread/${payload.id}`,
    body: {
      id: payload.id,
      title: Matchers.string(payload.title),
      archived: Matchers.boolean(payload.archived),
      createdAt: Matchers.iso8601DateTime(payload.createdAt),
      updatedAt: Matchers.iso8601DateTime(payload.updatedAt),
      commentIds:
        payload.commentIds.length > 0
          ? Matchers.eachLike(Matchers.like([payload.commentIds][0]))
          : [],
      parentId: Matchers.integer(id),
    },
  })
}

export function addThreadsInteraction(id: number, payload: string[]) {
  return addJsonInteraction({
    name: `fetch threads of uuid ${id}`,
    given: '',
    path: `/threads/${id}`,
    body:
      payload.length > 0 ? Matchers.eachLike(Matchers.like(payload[0])) : [],
  })
}

function addJsonInteraction({
  name,
  given,
  path,
  body,
}: {
  name: string
  given: string
  path: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any
}) {
  return global.commentsPact.addInteraction({
    uponReceiving: name,
    state: given,
    withRequest: {
      method: 'GET',
      path,
    },
    willRespondWith: {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body,
    },
  })
}
