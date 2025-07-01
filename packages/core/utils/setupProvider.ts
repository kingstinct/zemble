// strategies for providers:
// - fallback (priority but use a different provider if the first one fails)
// - round robin (use a different provider each time, with a fallback)
// - batch (send to multiple providers at once) (for push we do this as each provider handles a different type of token)
// - singleton (use a specific provider for a specific plugin or app)

import type { Plugin } from '..'

export type InitializeProvider<T, TMiddlewareKey extends keyof Zemble.MiddlewareConfig> = (
  forSpecificPlugin: Zemble.MiddlewareConfig[TMiddlewareKey] | undefined,
  plugin: Plugin | undefined,
) => Promise<T> | T

/* eslint-disable no-param-reassign */
/* eslint-disable functional/immutable-data */
export type SetupProviderArgs<T extends Zemble.Providers[Key], Key extends keyof Zemble.Providers, TMiddlewareKey extends keyof Zemble.MiddlewareConfig> = {
  readonly app: Pick<Zemble.App, 'providers' | 'plugins' | 'multiProviders'>
  readonly initializeProvider: InitializeProvider<T, TMiddlewareKey>
  readonly providerKey: Key
  readonly middlewareKey: TMiddlewareKey
  readonly alwaysCreateForEveryPlugin?: boolean
}

export async function setupProvider<T extends Zemble.Providers[Key], Key extends keyof Zemble.Providers, TMiddlewareKey extends keyof Zemble.MiddlewareConfig>({
  app,
  initializeProvider,
  providerKey,
  middlewareKey,
  alwaysCreateForEveryPlugin,
}: SetupProviderArgs<T, Key, TMiddlewareKey>) {
  const defaultProvider = await initializeProvider(undefined, undefined)

  app.multiProviders[providerKey] = app.multiProviders[providerKey] || {}
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore hard to fix, and might boil up later
  app.multiProviders[providerKey][middlewareKey] = defaultProvider

  await Promise.all(
    app.plugins.map(async (p) => {
      const middlewareConfig = middlewareKey && p.config.middleware?.[middlewareKey]
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const isDisabled = !!middlewareConfig?.disable
      if (!isDisabled) {
        const hasCustomConfig = !!middlewareConfig

        const defaultOrCustomProvider = hasCustomConfig || alwaysCreateForEveryPlugin ? await initializeProvider(middlewareConfig, p) : app.providers[providerKey]

        p.multiProviders[providerKey] = p.multiProviders[providerKey] || {}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore hard to fix, and might boil up later
        p.multiProviders[providerKey][middlewareKey] = defaultOrCustomProvider
      }
    }),
  )
}

export default setupProvider
