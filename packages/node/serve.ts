import { serve as nodeServer } from '@hono/node-server'
import type { Configure } from '@zemble/core'
import { createApp, runBeforeServe } from '@zemble/core'

export const serve = async (config: Configure | Promise<Zemble.App> | Zemble.App) => {
  const app = await ('plugins' in config ? createApp(config) : config)
  await runBeforeServe(app)
  const server = nodeServer({ fetch: app.hono.fetch })

  server.addListener('listening', () => {
    app.providers.logger.info(`[@zemble/node] Serving on ${JSON.stringify(server.address())}`)
  })

  return app
}

export default serve
