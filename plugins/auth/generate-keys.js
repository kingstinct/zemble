/* eslint-disable @typescript-eslint/no-var-requires */
const { generateKeyPair } = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')

generateKeyPair('rsa', {
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

  const envPath = path.join(__dirname, '.env')
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, '')
  }

  fs.readFile(envPath, 'utf8', (err, data) => {
    if (err) throw err

    if (!data.includes('PUBLIC_KEY') && !data.includes('PRIVATE_KEY')) {
      fs.appendFile(envPath, `\nPUBLIC_KEY='${publicKey}'\nPRIVATE_KEY='${privateKey}'`, (err) => {
        if (err) throw err
        console.log('PUBLIC_KEY and PRIVATE_KEY was appended to your local .env file!')
      })
    } else {
      console.log('The "PUBLIC_KEY" and/or "PRIVATE_KEY" already exists in .env file, will not overwrite!')
    }
  })
})
