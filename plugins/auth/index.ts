import { PluginConfig } from '@readapt/core/types'

const PUBLIC_KEY = process.env.PUBLIC_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ISSUER = process.env.ISSUER ?? 'readapt-plugin-auth'
const MAINTENANCE_SECRET = process.env.MAINTENANCE_SECRET ?? 'top-secret'
const MAINTENANCE_KEY_EXPIRE_BEFORE_IAT = process.env.MAINTENANCE_KEY_EXPIRE_BEFORE_IAT ? parseInt(process.env.MAINTENANCE_KEY_EXPIRE_BEFORE_IAT, 0) : 0

type AuthConfig = {
  PUBLIC_KEY?: string;
  PRIVATE_KEY?: string;
  ISSUER?: string;
  MAINTENANCE_SECRET?: string;
  MAINTENANCE_KEY_EXPIRE_BEFORE_IAT?: number;
}

const defaults = {
  PUBLIC_KEY,
  PRIVATE_KEY,
  ISSUER,
  MAINTENANCE_SECRET,
  MAINTENANCE_KEY_EXPIRE_BEFORE_IAT
}

export default new PluginConfig<AuthConfig, typeof defaults>(__dirname, { defaultConfig: defaults })