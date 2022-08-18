/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { Storage } from '@google-cloud/storage'
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
    async newUpload(_parent, { mediaType }, { userId }) {
      assertUserIsAuthenticated(userId)

      const [fileExtension, mimeType] = getFileExtensionAndMimeType(mediaType)
      const fileHash = uuidv1()

      const storage = new Storage()
      const [uploadUrl] = await storage
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
