import { PluginConfig } from '@readapt/core/types'

/**
 * @see {@link https://developer.apple.com/documentation/xcode/supporting-associated-domains Supporting associated domains (Apple Docs)}
 */
export interface AASAFile {
  applinks: {
    apps: string[];
    details: AppDetails[];
  };
}

export interface AppDetails {
  appID: string;
  paths: string[];
}

export default new PluginConfig<AASAFile>(__dirname)