import { gql } from 'apollo-server'

import { Service } from '../src/graphql/schema/types'
import { createTestClient } from './utils/test-client'

test('_setLicense (forbidden)', async () => {
  const { client } = createTestClient({ service: Service.Playground })
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
  expect(response.errors?.[0].extensions?.code).toEqual('FORBIDDEN')
})

test('_setLicense (authenticated)', async () => {
  const { client } = createTestClient({ service: Service.Serlo })

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
