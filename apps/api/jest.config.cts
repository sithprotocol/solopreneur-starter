module.exports = {
  displayName: 'api',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleNameMapper: {
    '^\\.\\./generated/prisma/client$':
      '<rootDir>/src/test-utils/prisma-client.mock.ts',
    '^\\.\\./\\.\\./generated/prisma/client$':
      '<rootDir>/src/test-utils/prisma-client.mock.ts',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/api',
};
