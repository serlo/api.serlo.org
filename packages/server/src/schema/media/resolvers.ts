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
import { v4 as uuidv4 } from 'uuid'

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

      const fileExtension = getFileExtension(mediaType)
      const fileNameWithoutExtension = `${Date.now()}-${uuidv4()}`
      const fileName = `${fileNameWithoutExtension}.${fileExtension}`
      const storage = new Storage()
      const [uploadUrl] = await storage
        .bucket('assets.serlo.org')
        .file(fileName)
        .getSignedUrl({
          version: 'v4',
          action: 'write',
          expires: Date.now() + 15 * 60 * 1000,
          contentType: getMimeType(mediaType),
        })

      return {
        fileExtension,
        fileNameWithoutExtension,
        uploadUrl,
        urlAfterUpload: `https://assets.serlo.org/${fileName}`,
      }
    },
  },
}

function getFileExtension(mediaType: MediaType) {
  switch (mediaType) {
    case MediaType.ImageGif:
      return 'gif'
    case MediaType.ImageJpeg:
      return 'jpg'
    case MediaType.ImagePng:
      return 'png'
    case MediaType.ImageSvgXml:
      return 'svg'
    case MediaType.ImageWebp:
      return 'webp'
  }
}

function getMimeType(mediaType: MediaType) {
  switch (mediaType) {
    case MediaType.ImageGif:
      return 'image/gif'
    case MediaType.ImageJpeg:
      return 'image/jpeg'
    case MediaType.ImagePng:
      return 'image/png'
    case MediaType.ImageSvgXml:
      return 'image/svg+xml'
    case MediaType.ImageWebp:
      return 'image/webp'
  }
}
