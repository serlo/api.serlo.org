import gql from 'graphql-tag'

import { page as basePage } from '../../../__fixtures__'
import { given, Client, Query, nextUuid } from '../../__utils__'
import { Instance } from '~/types'

let client: Client
let query: Query

const page = { ...basePage, instance: Instance.En }
const page2 = { ...basePage, id: nextUuid(page.id) }

beforeEach(() => {
  client = new Client()

  query = client.prepareQuery({
    query: gql`
      query ($instance: Instance) {
        page {
          pages(instance: $instance) {
            id
          }
        }
      }
    `,
  })

  given('UuidQuery').for(page, page2)
  given('PagesQuery').isDefinedBy((req, res, ctx) => {
    const { instance } = req.body.payload

    if (instance === Instance.En) {
      return res(ctx.json({ success: true, pages: [page.id] }))
    }
    return res(ctx.json({ success: true, pages: [page.id, page2.id] }))
  })
})

test('returns all pages', async () => {
  await query.shouldReturnData({
    page: {
      pages: [{ id: page.id }, { id: page2.id }],
    },
  })
})

test('returns english pages', async () => {
  await query.withVariables({ instance: Instance.En }).shouldReturnData({
    page: {
      pages: [{ id: page.id }],
    },
  })
})

test('fails when database layer has an internal error', async () => {
  given('PagesQuery').hasInternalServerError()

  await query.shouldFailWithError('INTERNAL_SERVER_ERROR')
})

test('fails when database layer returns a 400er response', async () => {
  given('PagesQuery').returnsBadRequest()

  await query.shouldFailWithError('BAD_USER_INPUT')
})
