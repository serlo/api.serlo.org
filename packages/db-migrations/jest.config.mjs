export default {
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true, isolatedModules: true }],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.mts'],
  setupFiles: ['dotenv/config'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/'],
}
