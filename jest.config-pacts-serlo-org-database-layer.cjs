// eslint-disable-next-line import/no-commonjs
const defaultConfig = require('./jest.config.cjs')

module.exports = {
  ...defaultConfig,
  setupFilesAfterEnv: [
    '<rootDir>/__config__/jest.setup-pacts-serlo-org-database-layer.ts',
  ],
  testRegex: '/__tests-pacts__/index\\.ts',
  watchPathIgnorePatterns: ['<rootDir>/pacts/'],
}
