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
import Controller from '../../controller/controller';

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
      if (document.querySelector('.form-item--error')) {
        loginBtn.setAttribute('disabled', 'disabled');
      } else {
        loginBtn.removeAttribute('disabled');
      }
    });

    passwordContainer.addEventListener('input', (e: Event): void => {
      e.preventDefault();
      this.validateInput(passwordInput);
      if (document.querySelector('.form-item--error')) {
        loginBtn.setAttribute('disabled', 'disabled');
      } else {
        loginBtn.removeAttribute('disabled');
      }
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
        Controller.loginAction(emailInput.value, passwordInput.value, this.router);
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
    const isVisible = passwordInput.getAttribute('type') === 'text';

    showPasswordBtn.innerText = isVisible ? 'SHOW' : 'HIDE';
    passwordInput.type = isVisible ? 'password' : 'text';
  }
}

export default LoginController;
