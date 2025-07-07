import type { Configure } from '@zemble/core'
import { createApp } from '@zemble/core'
import { runBeforeServe } from '@zemble/core/runBeforeServe'
import Bun from 'bun'

export const serve = async (
  config: Configure | Promise<Zemble.App> | Zemble.App,
) => {
  const app = await ('plugins' in config ? createApp(config) : config)
  await runBeforeServe(app)

  const bunServer = Bun.serve({
    fetch: async (request, server) => {
      // Upgrade the request to a WebSocket
      if (server.upgrade(request)) {
        return new Response()
      }

      return app.hono.fetch(request, server)
    },
    // todo [>1]: support updating websockets handler without restarting the server
    websocket: app.websocketHandler,
  })

  // mostly for clickability in the terminal :)
  const linkPrefix = bunServer.hostname === 'localhost' ? 'http://' : ''

  app.providers.logger.info(
    `[@zemble/bun] Serving on ${linkPrefix}${bunServer.hostname}:${bunServer.port}`,
  )
  return app
}

export default serve
