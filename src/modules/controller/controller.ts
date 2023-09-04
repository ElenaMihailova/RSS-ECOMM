import { CustomerSignInResult } from '@commercetools/platform-sdk';
import { PasswordAuthMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { PageUrls } from '../../assets/data/constants';
import { createApiRootWithPasswordFlow, loginUser } from '../api/apiClient';
import MyTokenCache from '../api/myTokenCache';
import { setMenuBtnsView, setToLS } from '../helpers/functions';
import Router from '../router/router';

class Controller {
  public static async loginAction(email: string, password: string, router: Router): Promise<void> {
    const tokenCache = new MyTokenCache();
    const options: PasswordAuthMiddlewareOptions = {
      host: process.env.CTP_AUTH_URL as string,
      projectKey: process.env.CTP_PROJECT_KEY as string,
      credentials: {
        clientId: process.env.CTP_CLIENT_ID as string,
        clientSecret: process.env.CTP_CLIENT_SECRET as string,
        user: {
          username: email,
          password,
        },
      },
      tokenCache,
      scopes: process.env.CTP_SCOPES?.split(' ') as string[],
      fetch,
    };

    const apiRoot = createApiRootWithPasswordFlow(options);
    const login = await loginUser(apiRoot, email, password);

    if (Object.keys(login).length) {
      const loginData = login as CustomerSignInResult;
      setToLS('userID', loginData.customer.id);
      const tokenInfo = tokenCache.get();
      setToLS('token', tokenInfo.token);
      router.navigateFromButton(PageUrls.IndexPageUrl);

      setMenuBtnsView();
    }
  }
}

export default Controller;
