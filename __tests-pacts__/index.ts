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
import { Pact } from '@pact-foundation/pact'
import path from 'path'
import rimraf from 'rimraf'
import util from 'util'

import { createTestClient } from '../__tests__/__utils__/test-client'
import { Service } from '../src/graphql/schema/types'

const root = path.join(__dirname, '..')
const pactDir = path.join(root, 'pacts')

const rm = util.promisify(rimraf)

global.commentsPact = new Pact({
  consumer: 'api.serlo.org',
  provider: 'comments.serlo.org',
  port: 9010,
  dir: pactDir,
})

global.pact = new Pact({
  consumer: 'api.serlo.org',
  provider: 'serlo.org',
  port: 9009,
  dir: pactDir,
})

beforeAll(async () => {
  await rm(pactDir)
  await Promise.all([global.commentsPact.setup(), global.pact.setup()])
})

beforeEach(() => {
  global.client = createTestClient({ service: Service.Playground }).client
})

afterEach(async () => {
  await Promise.all([global.commentsPact.verify(), global.pact.verify()])
})

afterAll(async () => {
  await Promise.all([global.commentsPact.finalize(), global.pact.finalize()])
})

/* eslint-disable import/no-unassigned-import */
describe('License', () => {
  require('./license')
})
describe('Thread', () => {
  require('./thread')
})
describe('Uuid', () => {
  require('./uuid')
})
/* eslint-enable import/no-unassigned-import */
