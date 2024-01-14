import defaultConfig from './jest.config.js'

// eslint-disable-next-line import/no-default-export
export default {
  ...defaultConfig,
  setupFilesAfterEnv: [
    '<rootDir>/__config__/jest.setup-pacts-serlo-org-database-layer.ts',
  ],
  testRegex: '/__tests-pacts__/index\\.ts',
  watchPathIgnorePatterns: ['<rootDir>/pacts/'],
}
