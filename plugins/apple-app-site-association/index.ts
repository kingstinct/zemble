import { PluginConfig } from '@readapt/core/types'

/**
 * @see {@link https://developer.apple.com/documentation/xcode/supporting-associated-domains Supporting associated domains (Apple Docs)}
 */
export type AASAFile = {
  applinks: {
    apps: string[];
    details: AppDetails[];
  };
}

export type AppDetails = {
  appID: string;
  paths: string[];
}

export default new PluginConfig<AASAFile>(__dirname)