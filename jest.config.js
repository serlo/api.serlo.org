// eslint-disable-next-line import/no-default-export
export default {
  modulePaths: ['<rootDir>/packages'],
  moduleNameMapper: {
    '^~/(.*)$': 'server/src/$1',
    '@serlo/api': '@serlo/api/src',
    '@serlo/authorization': '@serlo/authorization/src',
  },
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/__config__/jest.setup.ts'],
  // Fixes issue with memory leak in Jest see
  // https://github.com/jestjs/jest/issues/11956
  workerIdleMemoryLimit: '1GB',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/__tests__\\/__utils__/'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true, isolatedModules: true }],
    '^.+\\.graphql$': './transform-graphql-jest-28-shim.cjs',
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.mts'],
}
