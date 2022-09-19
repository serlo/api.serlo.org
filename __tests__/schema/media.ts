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
            /https:\/\/assets.serlo.org\/[\d\-a-f]+\/image.png/
          ) as unknown,
        },
      },
    })
  })

  test('fails for unauthenticated user', async () => {
    await query.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
  })
})
