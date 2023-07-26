import { gql } from 'apollo-server'

import { user } from '../../__fixtures__'
import { Client } from '../__utils__'

const query = new Client({ userId: user.id }).prepareQuery({
  query: gql`
    query {
      media {
        newUpload(mediaType: IMAGE_PNG) {
          uploadUrl
          urlAfterUpload
        }
      }
    }
  `,
})

describe('media.upload', () => {
  test('returns url for uploading media file', async () => {
    await query.shouldReturnData({
      media: {
        newUpload: {
          uploadUrl: 'http://google.com/upload',
          urlAfterUpload: expect.stringMatching(
            /https:\/\/assets.serlo.org\/[\d\-a-f]+\/image.png/,
          ) as unknown,
        },
      },
    })
  })

  test('fails for unauthenticated user', async () => {
    await query.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
  })
})
