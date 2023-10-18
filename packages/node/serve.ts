import { serve } from '@hono/node-server'
import { createApp } from '@zemble/core'

import type { Configure } from '@zemble/core'

export const serve = async (config: Configure | Promise<Zemble.Server> | Zemble.Server) => {
  const app = await ('plugins' in config ? createApp(config) : config)
  const nodeServer = serve({ fetch: app.fetch })

  nodeServer.addListener('listening', () => {
    console.log(`[@zemble/node] Serving on ${JSON.stringify(nodeServer.address())}`)
  })

  return app
}

export default serve
