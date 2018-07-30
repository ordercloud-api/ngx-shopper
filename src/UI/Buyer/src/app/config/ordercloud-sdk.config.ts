import { ocAppConfig } from '@app-buyer/config/app.config';
import { Configuration } from '@ordercloud/angular-sdk';

export function OcSDKConfig() {
  const apiurl = 'https://api.ordercloud.io';
  const apiVersion = 'v1';
  const authUrl = 'https://auth.ordercloud.io/oauth/token';

  return new Configuration({
    basePath: `${apiurl}/${apiVersion}`,
    authPath: authUrl,
    cookiePrefix: ocAppConfig.appname.replace(/ /g, '_').toLowerCase(),
  });
}
