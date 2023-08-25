/* eslint-disable import/no-unresolved */

/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: '50%',
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  // modulePaths: [compilerOptions.baseUrl],
  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  /* transform: {
    '^.+\\.tsx?$': [
      'ts-jest', {
        isolatedModules: true,
        compilerHost: true,
        incremental: true,
      },
    ],
  }, */
}
