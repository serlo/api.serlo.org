/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import pact from '@pact-foundation/pact-node'
import { spawnSync } from 'child_process'
import * as path from 'path'

// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-commonjs
const { version } = require('../package.json') as { version: string }

const result = spawnSync('git', ['rev-parse', '--short', 'HEAD'], {
  stdio: 'pipe',
})
const hash = String(result.stdout).trim()

const consumerVersion = `${version}-${hash}`

void pact
  .publishPacts({
    pactFilesOrDirs: [path.join(__dirname, '..', 'pacts')],
    pactBroker: 'https://pact.serlo.org/',
    pactBrokerUsername: process.env.PACT_BROKER_USERNAME,
    pactBrokerPassword: process.env.PACT_BROKER_PASSWORD,
    consumerVersion,
  })
  .then(function () {
    console.log('success')
  })
