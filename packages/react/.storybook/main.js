const merge = require('lodash').merge;
const webpack = require('webpack');

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  "framework": "@storybook/react",
  webpackFinal: async (config, { configType }) => {
    console.log('STORYBOOKS', JSON.stringify(config, null, 2))

    
      const cfg = require('@expo/webpack-config')
      console.log('got cfg')
      const expoConfig = await cfg(
        {...config}
      )

      // console.log('EXPO', JSON.stringify(expoConfig, null, 2))

      /*const loader = getExpoBabelLoader(config)
      loader.use.options.configFile = './babel.config.web.js'*/
      
      /*delete expoConfig.config
      const merged = merge(expoConfig, config)
      console.log('FOUND WEBPACK CONFIG', merged)*/
      config.resolve.alias = {...config.resolve.alias, ...expoConfig.resolve.alias}
      config.entry = ['babel-polyfill', ...config.entry]
      config.plugins = [...config.plugins, new webpack.EnvironmentPlugin({ JEST_WORKER_ID: null }),
        new webpack.DefinePlugin({
          // https://github.com/jaredpalmer/formik/issues/1607
          __DEV__: process.env.NODE_ENV === 'development',
          process: { env: {} },
        })]
      config.resolve.extensions = ['.web.js', '.js', '.json', '.web.jsx', '.jsx', '.ts', '.tsx', 'web.ts', 'web.tsx']
      config.module.rules = [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-react',
                { plugins: ['@babel/plugin-proposal-class-properties'] }
              ],
            },
          },
        },
        ...config.module.rules
      ]
      return config
    

  },
}