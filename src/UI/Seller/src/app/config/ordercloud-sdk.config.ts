import { ocAppConfig } from '@app-seller/config/app.config';
import { Configuration } from '@ordercloud/angular-sdk';

export function OcSDKConfig() {
  const apiurl = 'https://qaapi.ordercloud.io';
  const apiVersion = 'v1';
  const authUrl = 'https://qaauth.ordercloud.io/oauth/token';

  return new Configuration({
    basePath: `${apiurl}/${apiVersion}`,
    authPath: authUrl,
    cookiePrefix: ocAppConfig.appname.replace(/ /g, '_').toLowerCase(),
  });
}
