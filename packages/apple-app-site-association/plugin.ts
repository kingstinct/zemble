import { Plugin } from '@readapt/core'

export interface AppDetails {
  readonly appID: string;
  readonly paths: readonly string[];
}

/**
 * @see {@link https://developer.apple.com/documentation/xcode/supporting-associated-domains Supporting associated domains (Apple Docs)}
 */
export interface AASAFile extends Readapt.GlobalConfig {
  readonly applinks: {
    readonly apps: readonly string[];
    readonly details: readonly AppDetails[];
  };
}

const defaultConfig = {
  applinks: {
    apps: [],
    details: [],
  },
} satisfies AASAFile

export default new Plugin<AASAFile>(__dirname, {
  defaultConfig,
})
