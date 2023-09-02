import { PasswordAuthMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { PageUrls } from '../../assets/data/constants';
import { createApiRootWithPasswordFlow, loginUser } from '../api/apiClient';
import MyTokenCache from '../api/myTokenCache';
import { getElement, setToLS } from '../helpers/functions';
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
    const loginSvg = getElement('.login svg');
    const logoutSvg = getElement('.logout-svg');
    const tooltip = getElement('.tooltip--login');
    const registrationBtn = getElement('.registration--desktop');
    const registrationContainer = registrationBtn.closest('li');
    const registrationMobileBtn = getElement('.registration--mobile');
    const registrationMobileContainer = registrationMobileBtn.closest('a');

    if (Object.keys(login).length) {
      const tokenInfo = tokenCache.get();
      setToLS('token', tokenInfo.token);
      router.navigateFromButton(PageUrls.IndexPageUrl);
      loginSvg.classList.add('visually-hidden');
      registrationContainer?.classList.add('visually-hidden');
      registrationMobileContainer?.classList.add('visually-hidden');
      logoutSvg.classList.remove('visually-hidden');
      tooltip.textContent = 'LOG OUT';
    }
  }
}

export default Controller;
