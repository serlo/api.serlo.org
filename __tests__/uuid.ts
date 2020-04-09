import { gql } from 'apollo-server'

import { Service } from '../src/graphql/schema/types'
import { Client, createTestClient } from './utils/test-client'

describe('_setAlias', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({ service: Service.Playground })
    const response = await setAlias({ id: 1, client })
    expect(response.errors?.[0].extensions?.code).toEqual('FORBIDDEN')
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo })

    let response = await setUser({ id: 1, client })
    expect(response.errors).toBeUndefined()
    response = await setAlias({ id: 1, client })
    expect(response.errors).toBeUndefined()

    response = await client.query({
      query: gql`
        {
          uuid(alias: { instance: de, path: "/path" }) {
            id
          }
        }
      `,
    })
    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({
      uuid: {
        id: 1,
      },
    })
  })
})

describe('_removeUuid', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({ service: Service.Playground })
    const response = await removeUuid({ id: 1, client })
    expect(response.errors?.[0].extensions?.code).toEqual('FORBIDDEN')
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo })

    let response = await removeUuid({ id: 1, client })
    expect(response.errors).toBeUndefined()

    response = await client.query({
      query: gql`
        {
          uuid(id: 1) {
            id
          }
        }
      `,
    })
    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({
      uuid: null,
    })
  })
})

describe('_setArticle', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({ service: Service.Playground })
    const response = await setArticle({
      id: 1,
      currentRevisionId: 2,
      licenseId: 3,
      client,
    })
    expect(response.errors?.[0].extensions?.code).toEqual('FORBIDDEN')
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo })

    let response = await setArticle({
      id: 1,
      currentRevisionId: 2,
      licenseId: 3,
      client,
    })
    expect(response.errors).toBeUndefined()
    response = await client.query({
      query: gql`
        {
          uuid(id: 1) {
            ... on Article {
              id
            }
          }
        }
      `,
    })
    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({
      uuid: {
        id: 1,
      },
    })
  })
})

describe('_setArticleRevision', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({ service: Service.Playground })
    const response = await setArticleRevison({
      id: 1,
      repositoryId: 2,
      authorId: 3,
      client,
    })
    expect(response.errors?.[0].extensions?.code).toEqual('FORBIDDEN')
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo })

    let response = await setArticleRevison({
      id: 1,
      repositoryId: 2,
      authorId: 3,
      client,
    })
    expect(response.errors).toBeUndefined()
    response = await client.query({
      query: gql`
        {
          uuid(id: 1) {
            ... on ArticleRevision {
              id
            }
          }
        }
      `,
    })
    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({
      uuid: {
        id: 1,
      },
    })
  })
})

describe('_setPage', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({ service: Service.Playground })
    const response = await setPage({
      id: 1,
      currentRevisionId: 2,
      licenseId: 3,
      client,
    })
    expect(response.errors?.[0].extensions?.code).toEqual('FORBIDDEN')
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo })

    let response = await setPage({
      id: 1,
      currentRevisionId: 2,
      licenseId: 3,
      client,
    })
    expect(response.errors).toBeUndefined()
    response = await client.query({
      query: gql`
        {
          uuid(id: 1) {
            ... on Page {
              id
            }
          }
        }
      `,
    })
    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({
      uuid: {
        id: 1,
      },
    })
  })
})

describe('_setPageRevision', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({ service: Service.Playground })
    const response = await setPageRevison({
      id: 1,
      repositoryId: 2,
      authorId: 3,
      client,
    })
    expect(response.errors?.[0].extensions?.code).toEqual('FORBIDDEN')
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo })

    let response = await setPageRevison({
      id: 1,
      repositoryId: 2,
      authorId: 3,
      client,
    })
    expect(response.errors).toBeUndefined()
    response = await client.query({
      query: gql`
        {
          uuid(id: 1) {
            ... on PageRevision {
              id
            }
          }
        }
      `,
    })
    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({
      uuid: {
        id: 1,
      },
    })
  })
})

describe('_setTaxonomyTerm', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({ service: Service.Playground })
    const response = await setTaxonomyTerm({
      id: 1,
      parentId: 2,
      client,
    })
    expect(response.errors?.[0].extensions?.code).toEqual('FORBIDDEN')
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo })

    let response = await setTaxonomyTerm({
      id: 1,
      parentId: 2,
      client,
    })
    expect(response.errors).toBeUndefined()
    response = await client.query({
      query: gql`
        {
          uuid(id: 1) {
            ... on TaxonomyTerm {
              id
            }
          }
        }
      `,
    })
    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({
      uuid: {
        id: 1,
      },
    })
  })
})

describe('_setUser', () => {
  test('forbidden', async () => {
    const { client } = createTestClient({ service: Service.Playground })
    const response = await setUser({ id: 1, client })
    expect(response.errors?.[0].extensions?.code).toEqual('FORBIDDEN')
  })

  test('authenticated', async () => {
    const { client } = createTestClient({ service: Service.Serlo })

    let response = await setUser({ id: 1, client })
    expect(response.errors).toBeUndefined()
    response = await client.query({
      query: gql`
        {
          uuid(id: 1) {
            ... on User {
              id
            }
          }
        }
      `,
    })
    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({
      uuid: {
        id: 1,
      },
    })
  })
})

function setAlias({ id, client }: { id: number; client: Client }) {
  return client.mutate({
    mutation: gql`
        mutation {
          _setAlias(
            id: ${id}
            instance: de
            path: "/path"
            source: "/source"
            timestamp: "timestamp"
          )
        }
      `,
  })
}

function removeUuid({ id, client }: { id: number; client: Client }) {
  return client.mutate({
    mutation: gql`
        mutation {
          _removeUuid(
            id: ${id}
          )
        }
      `,
  })
}

function setArticle({
  id,
  currentRevisionId,
  licenseId,
  client,
}: {
  id: number
  currentRevisionId: number
  licenseId: number
  client: Client
}) {
  return client.mutate({
    mutation: gql`
        mutation {
          _setArticle(
            id: ${id}
            trashed: false
            instance: de
            date: "date"
            currentRevisionId: ${currentRevisionId}
            licenseId: ${licenseId}
            taxonomyTermIds: []
          )
        }
      `,
  })
}

function setArticleRevison({
  id,
  repositoryId,
  authorId,
  client,
}: {
  id: number
  repositoryId: number
  authorId: number
  client: Client
}) {
  return client.mutate({
    mutation: gql`
        mutation {
          _setArticleRevision(
            id: ${id}
            trashed: false
            date: DateTime
            authorId: ${authorId}
            repositoryId: ${repositoryId}
            title: "title"
            content: "content"
            changes: "changes"
          )
        }
      `,
  })
}

function setPage({
  id,
  currentRevisionId,
  licenseId,
  client,
}: {
  id: number
  currentRevisionId: number
  licenseId: number
  client: Client
}) {
  return client.mutate({
    mutation: gql`
        mutation {
          _setPage(
            id: ${id}
            instance: de
            alias: "alias"
            trashed: false
            currentRevisionId: ${currentRevisionId}
            licenseId: ${licenseId}
          )
        }
      `,
  })
}

function setPageRevison({
  id,
  repositoryId,
  authorId,
  client,
}: {
  id: number
  repositoryId: number
  authorId: number
  client: Client
}) {
  return client.mutate({
    mutation: gql`
        mutation {
          _setPageRevision(
            id: ${id}
            trashed: false
            title: "title"
            content: "content"
            date: DateTime
            authorId: ${authorId}
            repositoryId: ${repositoryId}
          )
        }
      `,
  })
}

function setUser({ id, client }: { id: number; client: Client }) {
  return client.mutate({
    mutation: gql`
      mutation {
        _setUser(
          id: ${id}
          trashed: false
          username: "username"
          date: "date"
          lastLogin: "lastLogin"
          description: "description"
        )
      }
    `,
  })
}

function setTaxonomyTerm({
  id,
  parentId,
  client,
}: {
  id: number
  parentId: number
  client: Client
}) {
  return client.mutate({
    mutation: gql`
      mutation {
        _setTaxonomyTerm(
          id: ${id}
          trashed: false
          type: root
          instance: de
          alias: "alias"
          name: "name"
          description: "description"
          weight: 0
          parentId: ${parentId}
          childrenIds: []
        )
      }
    `,
  })
}
