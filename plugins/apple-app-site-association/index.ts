
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

export type PluginConfig = {
  disable: boolean;
  'apple-app-site-association': AASAFile
}

declare global {
  namespace readapt {
    interface Config {
      'readapt-apple-app-site-association': PluginConfig
    }
  }
}

export const setup = async (config: PluginConfig) => {
  
}