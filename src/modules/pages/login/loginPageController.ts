import './loginPage.scss';
import '../../../style/toastify.css';
import Toastify from 'toastify-js';
import { PasswordAuthMiddlewareOptions } from '@commercetools/sdk-client-v2/dist/declarations/src/types/sdk';
import { createApiRootWithPasswordFlow, loginUser } from '../../api/apiClient';
import MyTokenCache from '../../api/myTokenCache';
import { PageUrls } from '../../../assets/data/constants';
import { getElement, setToLS } from '../../helpers/functions';
import Router from '../../router/router';
import Validator from '../../validation/validator';

class LoginController {
  private validator: Validator;

  private router: Router;

  constructor(router: Router) {
    this.validator = new Validator();
    this.router = router;
    this.runHandlers();
  }

  public runHandlers(): void {
    this.inputsHandlers();
    this.loginHandler();
    this.registrationBtnHandler();
  }

  private inputsHandlers(): void {
    const emailInput: HTMLInputElement = getElement('.login__email-input');
    const passwordContainer: HTMLDivElement = getElement('.login__password-input-container');
    const passwordInput: HTMLInputElement = getElement('.login__password-input');
    const showPasswordButton: HTMLButtonElement = getElement('.login__showpassword-button');
    const loginBtn: HTMLButtonElement = getElement('.login__button');

    emailInput.addEventListener('input', (e: Event) => {
      e.preventDefault();
      this.validateInput(emailInput);
    });

    passwordContainer.addEventListener('input', (e: Event): void => {
      e.preventDefault();
      this.validateInput(passwordInput);
    });

    showPasswordButton.addEventListener('click', () => {
      this.togglePasswordView();
    });
  }

  private validateInput(inputEl: HTMLInputElement): void {
    const emailInput: HTMLInputElement = getElement('.login__email-input');
    const passwordInput: HTMLInputElement = getElement('.login__password-input');
    const loginBtn: HTMLButtonElement = getElement('.login__button');
    this.validator.validateRealTime(inputEl);
    if (emailInput.value === '' && passwordInput.value === '') {
      loginBtn.removeAttribute('disabled');
    }
  }

  private loginHandler(): void {
    const loginBtn: HTMLButtonElement = getElement('.login__button');
    const emailInput: HTMLInputElement = getElement('.login__email-input');
    const passwordInput: HTMLInputElement = getElement('.login__password-input');

    loginBtn.addEventListener('click', async (): Promise<void> => {
      if (emailInput.value === '' || passwordInput.value === '') {
        Toastify({
          text: 'Please enter your username and password',
          className: 'toastify toastify-error',
          duration: 4000,
          newWindow: true,
          close: true,
          gravity: 'bottom',
          position: 'center',
          stopOnFocus: true,
        }).showToast();
      }

      if (emailInput.value !== '' && passwordInput.value !== '') {
        const email = emailInput.value;
        const password = passwordInput.value;
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
        const loginSvg = getElement('.login-svg');
        const logoutSvg = getElement('.logout-svg');
        const tooltip = getElement('.tooltip--login');

        if (Object.keys(login).length) {
          const tokenInfo = tokenCache.get();
          setToLS('token', tokenInfo.token);
          this.router.navigateFromButton(PageUrls.IndexPageUrl);
          loginSvg.classList.add('visually-hidden');
          logoutSvg.classList.remove('visually-hidden');
          tooltip.textContent = 'LOG OUT';
        }
      }
    });
  }

  private registrationBtnHandler(): void {
    const registrationBtn: HTMLButtonElement = getElement('.registration__button');
    registrationBtn.addEventListener('click', () => {
      this.router.navigateFromButton('registration');
    });
  }

  private togglePasswordView(): void {
    const showPasswordBtn: HTMLButtonElement = getElement('.login__showpassword-button');
    const passwordInput: HTMLInputElement = getElement('.login__password-input');

    showPasswordBtn.innerText = passwordInput.getAttribute('type') === 'password' ? 'HIDE' : 'SHOW';
    passwordInput.type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  }
}

export default LoginController;
