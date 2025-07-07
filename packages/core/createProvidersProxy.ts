const roundRobinCount = new Map<string, number>()

export const createProviderProxy = (
  multiProviders: Zemble.MultiProviders,
  providerStrategiesPerProvider: Zemble.ProviderStrategies,
) =>
  new Proxy({} as Zemble.Providers, {
    get: (_, providerKey) => {
      // @ts-ignore asdf as
      const multiProvidersForType = multiProviders[providerKey]
      // @ts-ignore asdf as
      const providers = Object.values(multiProvidersForType)

      const strategy =
        providerStrategiesPerProvider[
          providerKey as keyof Zemble.ProviderStrategies
        ] ?? 'last'

      if (strategy === 'last') {
        const lastProvider = providers.at(-1)
        if (lastProvider) {
          return lastProvider
        }
      } else if (strategy === 'all') {
        const isAllProvidersFunctions = providers.every(
          (p) => typeof p === 'function',
        )

        if (!isAllProvidersFunctions) {
          throw new Error(
            `All providers for ${String(providerKey)} must be functions for all strategy to work`,
          )
        }

        // @ts-ignore
        const callAllProviders = async (...args: readonly unknown[]) =>
          Promise.all(providers.map((p) => p(...args)))

        return callAllProviders
      } else if (strategy === 'round-robin') {
        const count = roundRobinCount.get(providerKey.toString()) ?? 0
        const provider = providers[count % providers.length]
        roundRobinCount.set(providerKey.toString(), count + 1)

        return provider
      } else if (strategy === 'failover') {
        const isAllProvidersFunctions = providers.every(
          (p) => typeof p === 'function',
        )

        if (!isAllProvidersFunctions) {
          throw new Error(
            `All providers for "${String(providerKey)}" must be functions for "failover" strategy to work`,
          )
        }

        const tryToExecute = async (
          attempt: number,
          ...args: readonly unknown[]
        ): Promise<unknown> => {
          const hasGoneThroughAllProviders = attempt >= providers.length
          if (hasGoneThroughAllProviders) {
            throw new Error(
              `All providers for "${providerKey.toString()}" failed`,
            )
          }
          const provider = providers.at(-attempt - 1) as (
            ...args: readonly unknown[]
          ) => unknown
          try {
            return provider(...args)
          } catch (e) {
            return tryToExecute(attempt + 1, ...args)
          }
        }
        return async (args: readonly unknown[]) => tryToExecute(0, ...args)
      }
      throw new Error(`No provider found for ${String(providerKey)}`)
    },
    set: (_, providerKey) => {
      throw new Error(
        `Attempting to set provider for "${providerKey.toString()}" directly, use setupProvider instead`,
      )
    },
  })
