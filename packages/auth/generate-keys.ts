#!/usr/bin/env bun
/* eslint-disable @typescript-eslint/no-var-requires */
import { generateKeyPair } from 'node:crypto'
import * as fs from 'node:fs'
import * as path from 'node:path'

void generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
}, (err, publicKey, privateKey) => {
  console.log(publicKey)
  console.log(privateKey)

  const envPath = path.join(process.cwd(), '.env')
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, '')
  }

  fs.readFile(envPath, 'utf8', (err, data) => {
    if (err) throw err

    if (!data.includes('PUBLIC_KEY') && !data.includes('PRIVATE_KEY')) {
      fs.appendFile(envPath, `\nPUBLIC_KEY='${publicKey.trim()}'\nPRIVATE_KEY='${privateKey.trim()}'`, (err) => {
        if (err) throw err
        console.log('PUBLIC_KEY and PRIVATE_KEY was appended to your local .env file!')
      })
    } else {
      console.log('The "PUBLIC_KEY" and/or "PRIVATE_KEY" already exists in .env file, will not overwrite!')
    }
  })
})
