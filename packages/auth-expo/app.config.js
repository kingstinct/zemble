/** @typedef { import('@expo/config-types').ExpoConfig } ExpoConfig  */

const packageJson = require('./package.json')

/**
 * @param {{ config: { expo: import('@expo/config-types').ExpoConfig } }} params
 * @returns {{ expo: import('@expo/config-types').ExpoConfig }}
 */
export default ({ config }) => {
  const cfg = {
    ...config,
    expo: {
      ...config.expo,
      name: packageJson.name,
      slug: packageJson.name,
      version: packageJson.version,
    },
  }

  return cfg
}
