import type { Plugin } from '@zemble/core'

export type SetupProviderArgs<
  T extends Zemble.Providers[Key],
  Key extends keyof Zemble.Providers,
  TMiddlewareKey extends keyof Zemble.MiddlewareConfig
> = {
  readonly app: Pick<Zemble.App, 'providers'>,
  readonly plugins: readonly Plugin[],
  readonly initializeProvider: (forSpecificPlugin: Zemble.MiddlewareConfig[TMiddlewareKey] | undefined) => Promise<T> | T,
  readonly providerKey: Key,
  readonly middlewareKey: TMiddlewareKey
}

export async function setupProvider<T extends Zemble.Providers[Key], Key extends keyof Zemble.Providers, TMiddlewareKey extends keyof Zemble.MiddlewareConfig>({
  app, initializeProvider, providerKey, plugins, middlewareKey,
}: SetupProviderArgs<T, Key, TMiddlewareKey>) {
  // eslint-disable-next-line functional/immutable-data, no-param-reassign
  app.providers[providerKey] = await initializeProvider(undefined)

  plugins.map(async (p) => {
    const middlewareConfig = p.config.middleware?.[middlewareKey]
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const isDisabled = !!middlewareConfig?.disable
    if (!isDisabled) {
      const hasCustomConfig = !!middlewareConfig

      // eslint-disable-next-line functional/immutable-data, no-param-reassign
      p.providers[providerKey] = hasCustomConfig
        ? await initializeProvider(middlewareConfig)
        : app.providers[providerKey]
    }
  })
}

export default setupProvider
