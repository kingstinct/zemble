import { createApp } from '..'

import type { Plugin } from '../Plugin'

export type ZembleApp = Zemble.App

export async function createTestApp<
  TConfig extends Zemble.GlobalConfig = Zemble.GlobalConfig,
  TDefaultConfig extends Partial<TConfig> = TConfig,
  TResolvedConfig extends TConfig & TDefaultConfig = TConfig & TDefaultConfig,
>(plugin: Plugin<TConfig, TDefaultConfig, TResolvedConfig>) {
  const resolved = plugin.configure(plugin.additionalConfigWhenRunningLocally)
  return createApp({
    plugins: [...plugin.dependencies, resolved],
  })
}

export default createTestApp
