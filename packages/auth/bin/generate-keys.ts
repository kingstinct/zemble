#!/usr/bin/env bun
import zembleContext from '@zemble/core/zembleContext'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

import generateKeys from '../generate-keys'

await generateKeys().then(async ({ publicKey, privateKey }) => {
  const envPath = path.join(process.cwd(), '.env')

  if (!(await fs.exists(envPath))) {
    await fs.writeFile(envPath, '')
  }

  const data = await fs.readFile(envPath, 'utf8')

  if (!data.includes('PUBLIC_KEY') && !data.includes('PRIVATE_KEY')) {
    await fs.appendFile(envPath, `\nPUBLIC_KEY='${publicKey.trim()}'\nPRIVATE_KEY='${privateKey.trim()}'`)
    zembleContext.logger.info('PUBLIC_KEY and PRIVATE_KEY was appended to your local .env file!')
  } else {
    zembleContext.logger.info('The "PUBLIC_KEY" and/or "PRIVATE_KEY" already exists in .env file, will not overwrite!')
  }
})
