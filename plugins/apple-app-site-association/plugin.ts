import { Plugin } from '@readapt/core'

/**
 * @see {@link https://developer.apple.com/documentation/xcode/supporting-associated-domains Supporting associated domains (Apple Docs)}
 */
export type AASAFile = {
  readonly applinks: {
    readonly apps: readonly string[];
    readonly details: readonly AppDetails[];
  };
}

export type AppDetails = {
  readonly appID: string;
  readonly paths: readonly string[];
}

export default new Plugin<AASAFile>(__dirname)
