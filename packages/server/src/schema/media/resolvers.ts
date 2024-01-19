import { v1 as uuidv1 } from 'uuid'

import {
  assertUserIsAuthenticated,
  createNamespace,
  Queries,
} from '~/internals/graphql'
import { MediaType } from '~/types'

export const resolvers: Queries<'media'> = {
  Query: {
    media: createNamespace(),
  },
  MediaQuery: {
    async newUpload(_parent, { mediaType }, { userId, googleStorage }) {
      assertUserIsAuthenticated(userId)

      const [fileExtension, mimeType] = getFileExtensionAndMimeType(mediaType)
      const fileHash = uuidv1()

      const [uploadUrl] = await googleStorage
        .bucket('assets.serlo.org')
        .file(`${fileHash}.${fileExtension}`)
        .getSignedUrl({
          version: 'v4',
          action: 'write',
          expires: Date.now() + 15 * 60 * 1000,
          contentType: mimeType,
        })

      return {
        uploadUrl,
        urlAfterUpload: `https://assets.serlo.org/${fileHash}/image.${fileExtension}`,
      }
    },
  },
}

function getFileExtensionAndMimeType(mediaType: MediaType) {
  switch (mediaType) {
    case MediaType.ImageGif:
      return ['gif', 'image/gif']
    case MediaType.ImageJpeg:
      return ['jpg', 'image/jpeg']
    case MediaType.ImagePng:
      return ['png', 'image/png']
    case MediaType.ImageSvgXml:
      return ['svg', 'image/svg+xml']
    case MediaType.ImageWebp:
      return ['webp', 'image/webp']
  }
}
