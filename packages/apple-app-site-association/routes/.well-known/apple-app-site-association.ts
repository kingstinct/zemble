import { Context } from 'hono'
import plugin from '../../plugin'

export default ({ json }: Context) => json(plugin.config)
