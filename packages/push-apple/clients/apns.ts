import { ApnsClient } from 'apns2'
import fs from 'fs'
import Path from 'path'

import plugin from '../plugin'

export const readP8KeyFile = async () => {
  const path = plugin.config.APPLE_PATH_TO_P8_KEY!
  const absoluteOrRelativePath = path.startsWith('/') ? path : Path.join(process.cwd(), path)

  console.log('Reading P8 key file from', absoluteOrRelativePath)

  return fs.readFileSync(absoluteOrRelativePath, 'utf8')
}

export const readP8KeyStringOrFile = async () => plugin.config.APPLE_P8_KEY ?? readP8KeyFile()

const createClient = async () => {
  const client = new ApnsClient({
    team: plugin.config.APPLE_TEAM_ID!,
    keyId: plugin.config.APPLE_KEY_ID!,
    signingKey: await readP8KeyStringOrFile(),
    defaultTopic: plugin.config.DEFAULT_TOPIC,
  })

  return client
}

export default createClient
