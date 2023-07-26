import { gql } from 'apollo-server'
import R from 'ramda'

import { applet, appletRevision } from '../../../__fixtures__'
import { given, Client } from '../../__utils__'

test('Applet', async () => {
  given('UuidQuery').for(applet)

  await new Client()
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on Applet {
              id
              trashed
              instance
              date
            }
          }
        }
      `,
    })
    .withVariables({ id: applet.id })
    .shouldReturnData({
      uuid: R.pick(['__typename', 'id', 'trashed', 'instance', 'date'], applet),
    })
})

test('AppletRevision', async () => {
  given('UuidQuery').for(appletRevision)

  await new Client()
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on AppletRevision {
              id
              trashed
              date
              url
              title
              content
              changes
              metaTitle
              metaDescription
            }
          }
        }
      `,
    })
    .withVariables(appletRevision)
    .shouldReturnData({
      uuid: R.pick(
        [
          '__typename',
          'id',
          'trashed',
          'date',
          'url',
          'title',
          'content',
          'changes',
          'metaTitle',
          'metaDescription',
        ],
        appletRevision,
      ),
    })
})
