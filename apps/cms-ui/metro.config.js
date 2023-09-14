// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const config = getDefaultConfig(__dirname)

// Remove all console logs in production...
config.transformer.minifierConfig.compress.drop_console = true
config.watchFolders = [
  `${__dirname}/../../node_modules`,
  `${__dirname}/../../packages`,
  `${__dirname}/../../plugins`,
]

// #2 - Try resolving with project modules first, then workspace modules
config.resolver.nodeModulesPaths = [
  path.resolve('.', 'node_modules'),
  path.resolve('../../', 'node_modules'),
]

config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs']
config.resolver.resolverMainFields = ['sbmodern', ...config.resolver.resolverMainFields]
config.resolver.unstable_enableSymlinks = true

module.exports = config
