import { createApp } from '@zemble/core'
import Bun from 'bun'

import type { Configure } from '@zemble/core'

export const serve = async (config: Configure | Promise<Zemble.App> | Zemble.App) => {
  const app = await ('plugins' in config ? createApp(config) : config)
  const bunServer = Bun.serve({ fetch: app.fetch })
  const linkPrefix = bunServer.hostname === 'localhost' ? 'http://' : ''
  console.log(`[@zemble/bun] Serving on ${linkPrefix}${bunServer.hostname}:${bunServer.port}`)
  return app
}

export default serve
