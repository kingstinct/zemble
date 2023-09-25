/* eslint-disable @typescript-eslint/no-var-requires */
const { registerRootComponent } = require('expo')

const App = require('./App.tsx').default

registerRootComponent(App)
