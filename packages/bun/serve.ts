import { createApp } from '@zemble/core'
import { runBeforeServe } from '@zemble/core/runBeforeServe'
import Bun from 'bun'

import type { Configure } from '@zemble/core'

export const serve = async (config: Configure | Promise<Zemble.App> | Zemble.App) => {
  const app = await ('plugins' in config ? createApp(config) : config)
  await runBeforeServe(app)
  const bunServer = Bun.serve({ fetch: app.hono.fetch })

  // mostly for clickability in the terminal :)
  const linkPrefix = bunServer.hostname === 'localhost' ? 'http://' : ''

  app.providers.logger.info(`[@zemble/bun] Serving on ${linkPrefix}${bunServer.hostname}:${bunServer.port}`)
  return app
}

export default serve
