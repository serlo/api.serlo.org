import { gql } from 'apollo-server'

import { createTestClient } from './utils/test-client'

test('by id', async () => {
  const { cache, client } = createTestClient({ service: null })
  await cache.set(
    'de.serlo.org/api/license/1',
    JSON.stringify({
      id: 1,
      instance: 'de',
      default: true,
      title: 'title',
      url: 'url',
      content: 'content',
      agreement: 'agreement',
      iconHref: 'iconHref',
    })
  )
  const response = await client.query({
    query: gql`
      {
        license(id: 1) {
          id
          instance
          default
          title
          url
          content
          agreement
          iconHref
        }
      }
    `,
  })
  expect(response.errors).toBe(undefined)
  expect(response.data).toEqual({
    license: {
      id: 1,
      instance: 'de',
      default: true,
      title: 'title',
      url: 'url',
      content: 'content',
      agreement: 'agreement',
      iconHref: 'iconHref',
    },
  })
})

test('_setLicense (unauthenticated)', async () => {
  const { client } = createTestClient({ service: null })
  const response = await client.mutate({
    mutation: gql`
      mutation {
        _setLicense(
          id: 1
          instance: de
          default: true
          title: "title"
          url: "url"
          content: "content"
          agreement: "agreement"
          iconHref: "iconHref"
        )
      }
    `,
  })
  expect(response.errors?.[0].extensions?.code).toEqual('UNAUTHENTICATED')
})

test('_setLicense (authenticated)', async () => {
  const { client } = createTestClient({ service: 'serlo.org' })

  let response = await client.mutate({
    mutation: gql`
      mutation {
        _setLicense(
          id: 1
          instance: de
          default: true
          title: "title"
          url: "url"
          content: "content"
          agreement: "agreement"
          iconHref: "iconHref"
        )
      }
    `,
  })
  expect(response.errors).toBeUndefined()
  response = await client.query({
    query: gql`
      {
        license(id: 1) {
          id
          instance
          default
          title
          url
          content
          agreement
          iconHref
        }
      }
    `,
  })
  expect(response.errors).toBe(undefined)
  expect(response.data).toEqual({
    license: {
      id: 1,
      instance: 'de',
      default: true,
      title: 'title',
      url: 'url',
      content: 'content',
      agreement: 'agreement',
      iconHref: 'iconHref',
    },
  })
})
