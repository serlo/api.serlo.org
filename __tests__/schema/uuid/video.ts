import gql from 'graphql-tag'
import * as R from 'ramda'

import { video, videoRevision } from '../../../__fixtures__'
import { given, Client } from '../../__utils__'

test('Video', async () => {
  given('UuidQuery').for(video)

  await new Client()
    .prepareQuery({
      query: gql`
        query video($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on Video {
              id
              trashed
              instance
              date
            }
          }
        }
      `,
    })
    .withVariables({ id: video.id })
    .shouldReturnData({
      uuid: R.pick(['__typename', 'id', 'trashed', 'instance', 'date'], video),
    })
})

test('VideoRevision', async () => {
  given('UuidQuery').for(videoRevision)

  await new Client()
    .prepareQuery({
      query: gql`
        query videoRevision($id: Int!) {
          uuid(id: $id) {
            __typename
            ... on VideoRevision {
              id
              trashed
              date
              title
              content
              url
              changes
            }
          }
        }
      `,
    })
    .withVariables({ id: videoRevision.id })
    .shouldReturnData({
      uuid: R.pick(
        [
          '__typename',
          'id',
          'trashed',
          'date',
          'title',
          'content',
          'url',
          'changes',
        ],
        videoRevision,
      ),
    })
})
