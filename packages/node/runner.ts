import { serve } from '@hono/node-server'
import { createApp } from '@zemble/core'

import type { Configure } from '@zemble/core'

export const nodeRunner = async (config: Configure) => {
  const app = await createApp(config)
  const nodeServer = serve({ fetch: app.fetch })

  nodeServer.addListener('listening', () => {
    console.log(`[@zemble/node] Serving on ${JSON.stringify(nodeServer.address())}`)
  })

  return app
}

export default nodeRunner
