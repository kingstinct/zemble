// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

// Remove all console logs in production...
// config.transformer.minifierConfig.compress.drop_console = true
/* config.watchFolders = [
  `${__dirname}/../../node_modules`,
  `${__dirname}/../../packages`,
] */
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs']
config.resolver.resolverMainFields = [...config.resolver.resolverMainFields]
config.resolver.unstable_enableSymlinks = true

module.exports = config
