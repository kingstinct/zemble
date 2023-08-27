import plugin from '../../plugin'

import { Context } from 'hono'

export default ({ json }: Context) => json(plugin.config)