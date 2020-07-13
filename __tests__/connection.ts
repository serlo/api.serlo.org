import * as R from 'ramda'

import { ConnectionPayload, resolveConnection } from '../src/graphql/connection'

describe('resolveConnection', () => {
  const nodes = R.range(1, 10)
  const edges = R.map((node) => {
    return {
      cursor: Buffer.from(node.toString()).toString('base64'),
      node,
    }
  }, nodes)
  function getResult(payload: ConnectionPayload) {
    return resolveConnection({
      nodes,
      payload,
      createCursor(node: number) {
        return node.toString()
      },
    })
  }

  test('without payload', () => {
    expect(getResult({})).toEqual({
      edges,
      nodes,
      totalCount: 9,
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: edges[0].cursor,
        endCursor: edges[8].cursor,
      },
    })
  })

  test('forward pagination (by 5)', () => {
    const page1 = getResult({ first: 5 })
    expect(page1).toEqual({
      edges: edges.slice(0, 5),
      nodes: nodes.slice(0, 5),
      totalCount: 9,
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: edges[0].cursor,
        endCursor: edges[4].cursor,
      },
    })
    const page2 = getResult({ first: 5, after: page1.pageInfo.endCursor! })
    expect(page2).toEqual({
      edges: edges.slice(5, 9),
      nodes: nodes.slice(5, 9),
      totalCount: 9,
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: true,
        startCursor: edges[5].cursor,
        endCursor: edges[8].cursor,
      },
    })
  })

  test('backward pagination (by 5)', () => {
    const page1 = getResult({ last: 5 })
    expect(page1).toEqual({
      edges: edges.slice(4, 9),
      nodes: nodes.slice(4, 9),
      totalCount: 9,
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: true,
        startCursor: edges[4].cursor,
        endCursor: edges[8].cursor,
      },
    })
    const page2 = getResult({ last: 5, before: page1.pageInfo.startCursor! })
    expect(page2).toEqual({
      edges: edges.slice(0, 4),
      nodes: nodes.slice(0, 4),
      totalCount: 9,
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: edges[0].cursor,
        endCursor: edges[3].cursor,
      },
    })
  })
})
