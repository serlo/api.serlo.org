import { v1 as uuidv1 } from 'uuid'
import { Service } from '~/context/service'

import { assertUserIsAuthenticated, createNamespace } from '~/internals/graphql'
import { MediaType, Resolvers } from '~/types'

export const resolvers: Resolvers = {
  Query: {
    media: createNamespace(),
  },
  MediaQuery: {
    async newUpload(
      _parent,
      { mediaType },
      { userId, googleStorage, service },
    ) {
      if (service !== Service.SerloEditorTesting)
        assertUserIsAuthenticated(userId)

      const [fileExtension, mimeType] = getFileExtensionAndMimeType(mediaType)
      const fileHash = uuidv1()

      const bucketName =
        service === Service.SerloEditorTesting
          ? 'serlo-editor-testing'
          : 'assets.serlo.org'

      const file = googleStorage
        .bucket(bucketName)
        .file(`${fileHash}.${fileExtension}`)

      const [uploadUrl] = await file.getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000,
        contentType: mimeType,
      })

      return {
        uploadUrl,
        urlAfterUpload: `https://${bucketName}/${fileHash}/image.${fileExtension}`,
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
