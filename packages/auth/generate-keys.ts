import { generateKeyPair } from 'node:crypto'

type Keys = { readonly publicKey: string; readonly privateKey: string }

export const generateKeys = async () =>
  new Promise<Keys>((resolve, reject) => {
    generateKeyPair(
      'rsa',
      {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        },
      },
      (err, publicKey, privateKey) => {
        if (err) reject(err)
        else resolve({ publicKey, privateKey })
      },
    )
  })

export default generateKeys
