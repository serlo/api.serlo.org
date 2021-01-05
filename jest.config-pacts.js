/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
/* eslint-disable @typescript-eslint/no-var-requires,import/no-commonjs */
const { pathsToModuleNameMapper } = require('ts-jest/utils')

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { compilerOptions } = require('./tsconfig')

module.exports = {
  preset: 'ts-jest',
  modulePaths: ['<rootDir>/src'],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/__config__/jest.setup-pacts.ts'],
  testEnvironment: 'node',
  testRegex: '/__tests-pacts__/serlo\\.org/index\\.ts',
  transform: {
    '^.+\\.graphql$': 'jest-transform-graphql',
  },
  watchPathIgnorePatterns: ['<rootDir>/pacts/'],
}
