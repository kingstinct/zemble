import { PluginConfigWithMiddleware } from '@readapt/core/types'
import middleware from './middleware'

export default new PluginConfigWithMiddleware(__dirname, middleware)