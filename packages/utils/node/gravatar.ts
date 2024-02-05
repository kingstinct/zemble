import crypto from 'crypto'

export const gravatarUrlForHash = (gravatarHash: string) => `https://www.gravatar.com/avatar/${gravatarHash}?d=404`

export const gravatarHashForEmail = (email: string) => {
  const hash = crypto.createHash('md5').update(email).digest('hex')

  return hash
}

export const gravatarUrlForEmail = (email: string) => {
  const hash = gravatarHashForEmail(email)
  return gravatarUrlForHash(hash)
}
