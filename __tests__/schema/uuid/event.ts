import { gql } from 'apollo-server'
import R from 'ramda'

import { event, eventRevision } from '../../../__fixtures__'
import { given, Client } from '../../__utils__'

test('Event', async () => {
  given('UuidQuery').for(event)

  await new Client()
    .prepareQuery({
      query: gql`
        query event($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on Event {
              id
              trashed
              instance
              date
            }
          }
        }
      `,
    })
    .withVariables({ id: event.id })
    .shouldReturnData({
      uuid: R.pick(['__typename', 'id', 'trashed', 'instance', 'date'], event),
    })
})

test('EventRevision', async () => {
  given('UuidQuery').for(eventRevision)

  await new Client()
    .prepareQuery({
      query: gql`
        query eventRevision($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on EventRevision {
              id
              trashed
              date
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
    .withVariables({ id: eventRevision.id })
    .shouldReturnData({
      uuid: R.pick(
        [
          '__typename',
          'id',
          'trashed',
          'date',
          'title',
          'content',
          'changes',
          'metaTitle',
          'metaDescription',
        ],
        eventRevision
      ),
    })
})
