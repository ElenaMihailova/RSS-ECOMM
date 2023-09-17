import { AnonymousCartSignInMode, CustomerSignInResult } from '@commercetools/platform-sdk';
import { PasswordAuthMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { PageUrls } from '../../assets/data/constants';
import { getActiveCart, getUpdatedVersion, loginUser } from '../api';
import ApiClientBuilder from '../api/buildRoot';
import MyTokenCache from '../api/myTokenCache';
import { getFromLS, removeFromLS, setMenuBtnsView, setToLS } from '../helpers/functions';
import Router from '../router/router';

class Controller {
  public static async loginAction(
    email: string,
    password: string,
    activeCartSignInMode: AnonymousCartSignInMode,
    updateProductData: boolean,
    router: Router,
  ): Promise<void> {
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

    ApiClientBuilder.currentRoot = ApiClientBuilder.createApiRootWithPasswordFlow(options);
    const login = await loginUser(
      ApiClientBuilder.currentRoot,
      email,
      password,
      activeCartSignInMode,
      updateProductData,
    );

    const cart = await getActiveCart(ApiClientBuilder.currentRoot);

    if (getFromLS('cartVersion') && getFromLS('cartID')) {
      removeFromLS('cartVersion');
      removeFromLS('cartID');
    }

    if (!(cart instanceof Error)) {
      setToLS('cartID', cart.id);
      setToLS('cartVersion', cart.version.toString());
    }

    if (Object.keys(login).length) {
      removeFromLS('token');
      removeFromLS('refreshToken');

      const loginData = login as CustomerSignInResult;
      setToLS('userID', loginData.customer.id);

      const tokenInfo = tokenCache.get();
      setToLS('token', tokenInfo.token);

      if (tokenInfo.refreshToken) {
        setToLS('refreshToken', tokenInfo.refreshToken);
      }

      const version = await getUpdatedVersion(ApiClientBuilder.currentRoot, loginData.customer.id);
      setToLS('version', JSON.stringify(version));

      router.navigateFromButton(PageUrls.IndexPageUrl);

      setMenuBtnsView();
    }
  }
}

export default Controller;
