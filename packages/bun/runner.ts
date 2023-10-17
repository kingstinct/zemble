import { createApp } from '@zemble/core'
import Bun from 'bun'

import type { Configure } from '@zemble/core'

export const bunRunner = async (config: Configure) => {
  const app = await createApp(config)
  const bunServer = Bun.serve({ fetch: app.fetch })
  const linkPrefix = bunServer.hostname === 'localhost' ? 'http://' : ''
  console.log(`[@zemble/bun] Serving on ${linkPrefix}${bunServer.hostname}:${bunServer.port}`)
  return app
}

export default bunRunner
