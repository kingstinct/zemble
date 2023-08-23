import plugin from '../..'

import { Context } from 'hono'

export default ({ json }: Context) => json(plugin.config)