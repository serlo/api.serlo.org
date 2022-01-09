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
/* eslint-disable @typescript-eslint/no-var-requires,import/no-commonjs */
const { pathsToModuleNameMapper } = require('ts-jest')

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,import/extensions
const { compilerOptions } = require('./tsconfig.json')

module.exports = {
  preset: 'ts-jest',
  modulePaths: ['<rootDir>/packages'],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  moduleNameMapper: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
    ...pathsToModuleNameMapper(compilerOptions.paths),
    '@serlo/api': '@serlo/api/src',
    '@serlo/authorization': '@serlo/authorization/src',
  },
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: [
    '<rootDir>/__config__/jest.setup-pacts-serlo-org-database-layer.ts',
  ],
  testEnvironment: 'node',
  testRegex: '/__tests-pacts__/serlo\\.org-database-layer/index\\.ts',
  transform: {
    '^.+\\.graphql$': 'jest-transform-graphql',
  },
  watchPathIgnorePatterns: ['<rootDir>/pacts/'],
}
