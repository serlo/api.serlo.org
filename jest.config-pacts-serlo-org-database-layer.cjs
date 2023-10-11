/* eslint-disable @typescript-eslint/no-var-requires,import/no-commonjs */
// eslint-disable-next-line import/no-extraneous-dependencies
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
  testRegex: '/__tests-pacts__/index\\.ts',
  transform: {
    '^.+\\.graphql$': './transform-graphql-jest-28-shim.cjs',
  },
  watchPathIgnorePatterns: ['<rootDir>/pacts/'],
}
