#!/usr/bin/env bun
import * as fs from 'node:fs'
import * as path from 'node:path'
import zembleContext from '@zemble/core/zembleContext'

import generateKeys from '../generate-keys'

await generateKeys().then(async ({ publicKey, privateKey }) => {
  const envPath = path.join(process.cwd(), '.env')

  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, '')
  }

  const data = fs.readFileSync(envPath, 'utf8')

  if (!data.includes('PUBLIC_KEY') && !data.includes('PRIVATE_KEY')) {
    fs.appendFileSync(
      envPath,
      `\nPUBLIC_KEY='${publicKey.trim()}'\nPRIVATE_KEY='${privateKey.trim()}'`,
    )
    zembleContext.logger.info(
      'PUBLIC_KEY and PRIVATE_KEY was appended to your local .env file!',
    )
  } else {
    zembleContext.logger.info(
      'The "PUBLIC_KEY" and/or "PRIVATE_KEY" already exists in .env file, will not overwrite!',
    )
  }
})
