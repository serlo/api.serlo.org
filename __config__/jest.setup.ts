/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2023 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2023 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import {
  createAfterAll,
  createAfterEach,
  createBeforeAll,
  createBeforeEach,
  setup,
} from './setup'

jest.mock('@google-cloud/storage', () => {
  return {
    Storage: jest.fn().mockImplementation(() => ({
      bucket() {
        return {
          file() {
            return {
              getSignedUrl() {
                return ['http://google.com/upload']
              },
            }
          },
        }
      },
    })),
  }
})

setup()

beforeAll(async () => {
  await createBeforeAll({
    onUnhandledRequest(req) {
      if (
        req.method === 'POST' &&
        req.url.href.includes(process.env.SERLO_ORG_DATABASE_LAYER_HOST)
      ) {
        console.error(
          'Found an unhandled request for message %s',
          JSON.stringify(req.body)
        )
      } else {
        console.error(
          'Found an unhandled %s request to %s',
          req.method,
          req.url.href
        )
      }
    },
  })
})

beforeEach(createBeforeEach)

afterEach(createAfterEach)

afterAll(createAfterAll)
