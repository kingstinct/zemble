import { Plugin } from '@zemble/core'

export interface AppDetails {
  readonly appID: string;
  readonly paths: readonly string[];
}

/**
 * @see {@link https://developer.apple.com/documentation/xcode/supporting-associated-domains Supporting associated domains (Apple Docs)}
 */
export interface AASAFile extends Zemble.GlobalConfig {
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

export default new Plugin<AASAFile>(import.meta.dir, {
  defaultConfig,
})
