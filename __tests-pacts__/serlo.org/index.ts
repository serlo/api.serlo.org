/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
/* eslint-disable import/no-unassigned-import */
describe('GET /api/alias/:alias', () => {
  require('./alias')
})
describe('GET /api/cache-keys', () => {
  require('./cache-keys')
})
describe('GET /api/event/:id', () => {
  require('./event')
})
describe('GET /api/license/:id', () => {
  require('./license')
})
describe('GET /api/navigation', () => {
  require('./navigation')
})
describe('GET /api/notifications/:id', () => {
  require('./notifications')
})
describe('POST /api/set-notification-state/:id', () => {
  require('./set-notification-state')
})
describe('GET /api/user/*', () => {
  require('./user')
})
describe('GET /api/uuid/:id', () => {
  require('./uuid')
})
