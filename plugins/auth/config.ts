export const PUBLIC_KEY = process.env.PUBLIC_KEY
export const PRIVATE_KEY = process.env.PRIVATE_KEY
export const ISSUER = process.env.ISSUER ?? 'readapt-plugin-auth'
export const MAINTENANCE_SECRET = process.env.MAINTENANCE_SECRET ?? 'top-secret'
export const MAINTENANCE_KEY_EXPIRE_BEFORE_IAT = process.env.MAINTENANCE_KEY_EXPIRE_BEFORE_IAT ? parseInt(process.env.MAINTENANCE_KEY_EXPIRE_BEFORE_IAT, 0) : 0