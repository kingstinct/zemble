export default {
  strict: true,
  versionGroups: [
    {
      packages: ['**'],
      dependencies: ['$LOCAL'],
      dependencyTypes: ['dev', 'prod'],
      pinVersion: 'workspace:*',
    },
  ],
} satisfies import('syncpack').RcFile
