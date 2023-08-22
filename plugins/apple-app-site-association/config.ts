export const APPLE_APP_SITE_ASSOCIATION_JSON = process.env.APPLE_APP_SITE_ASSOCIATION_JSON

/**
 * @see {@link https://developer.apple.com/documentation/xcode/supporting-associated-domains Supporting associated domains (Apple Docs)}
 */
interface AASAFile {
  applinks: {
    apps: string[];
    details: AppDetails[];
  };
}

interface AppDetails {
  appID: string;
  paths: string[];
}

export const APPLE_APP_SITE_ASSOCIATION: AASAFile = {
  applinks: {
    apps: [],
    details: [
      {
        appID: '9JA89QQLNQ.com.apple.wwdc',
        paths: ['/wwdc/news/', '/videos/wwdc/2015/*'],
      },
      {
        appID: 'ABCD1234.com.apple.wwdc',
        paths: ['*'],
      },
    ],
  },
}