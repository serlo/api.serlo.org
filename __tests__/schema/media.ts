import gql from 'graphql-tag'

import { user } from '../../__fixtures__'
import { Client } from '../__utils__'
import { Service } from '~/context/service'

test('returns url for uploading media file', async () => {
  const query = setupQuery()
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

test('Successfully uploads media file for Serlo Editor test users', async () => {
  const query = setupQuery({ service: Service.SerloEditorTesting })
  await query.shouldReturnData({
    media: {
      newUpload: {
        uploadUrl: 'http://google.com/upload',
        urlAfterUpload: expect.stringMatching(
          /https:\/\/serlo-editor-testing\/[\d\-a-f]+\/image.png/,
        ) as unknown,
      },
    },
  })
})

test('fails for unauthenticated user', async () => {
  const query = setupQuery()
  await query.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})

function setupQuery(options: { service?: Service } = {}) {
  return new Client({ userId: user.id, ...options }).prepareQuery({
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
}
