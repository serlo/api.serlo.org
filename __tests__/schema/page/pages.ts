import gql from 'graphql-tag'

import { Client } from '../../__utils__'

const query = new Client().prepareQuery({
  query: gql`
    query {
      page {
        pages(instance: en) {
          id
        }
      }
    }
  `,
})

test('returns static pages', async () => {
  await query.shouldReturnData({
    page: {
      pages: [
        { id: 32966 },
        { id: 32840 },
        { id: 27469 },
        { id: 25082 },
        { id: 25079 },
        { id: 23727 },
        { id: 23720 },
        { id: 23711 },
        { id: 23591 },
        { id: 23580 },
        { id: 23579 },
      ],
    },
  })
})
