import fs from 'fs'
import Path from 'path'

import plugin from '../plugin'

export const readP8KeyFile = async () => {
  const path = plugin.config.APPLE_PATH_TO_P8_KEY!
  const absoluteOrRelativePath = path.startsWith('/') ? path : Path.join(process.cwd(), path)

  console.log('Reading P8 key file from', absoluteOrRelativePath)

  return fs.readFileSync(absoluteOrRelativePath, 'utf8')
}

export const readP8KeyStringOrFile = async () => {
  const p8 = plugin.config.APPLE_P8_KEY ?? readP8KeyFile()
  if (!p8) throw new Error('No P8 key provided, set it with APPLE_P8_KEY or APPLE_PATH_TO_P8_KEY')
  return p8
}
