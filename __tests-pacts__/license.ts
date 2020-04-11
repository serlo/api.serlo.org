import { gql } from 'apollo-server'

import { license } from '../__fixtures__/license'
import { assertSuccessfulGraphQLQuery } from './__utils__/assertions'
import { addLicenseInteraction } from './__utils__/interactions'

test('License', async () => {
  await addLicenseInteraction(license)
  await assertSuccessfulGraphQLQuery({
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
    data: {
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
    },
  })
})
