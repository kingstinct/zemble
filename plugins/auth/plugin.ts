import { Plugin } from '@readapt/core'

const { PUBLIC_KEY, PRIVATE_KEY } = process.env
const ISSUER = process.env.ISSUER ?? 'readapt-plugin-auth'

type AuthConfig = {
  readonly PUBLIC_KEY?: string;
  readonly PRIVATE_KEY?: string;
  readonly ISSUER?: string;
}

const defaultConfig = {
  PUBLIC_KEY,
  PRIVATE_KEY,
  ISSUER,
} satisfies AuthConfig

export default new Plugin<AuthConfig, typeof defaultConfig>(__dirname, { defaultConfig })
