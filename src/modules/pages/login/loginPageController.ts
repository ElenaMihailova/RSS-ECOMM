import './loginPage.scss';
import '../../../style/toastify.css';
import { getElement, renderPopup } from '../../helpers/functions';
import Router from '../../router/router';
import Validator from '../../validation/validator';
import Controller from '../../controller/controller';
import { PopupMessages } from '../../../types/enums';

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

    emailInput.addEventListener('input', (e) => this.toggleLoginBtnDisable(e, emailInput));

    passwordContainer.addEventListener('input', (e) => this.toggleLoginBtnDisable(e, passwordInput));

    showPasswordButton.addEventListener('click', () => {
      this.togglePasswordView();
    });
  }

  private toggleLoginBtnDisable(e: Event, inputEl: HTMLInputElement): void {
    e.preventDefault();
    this.validateInput(inputEl);

    const loginBtn: HTMLButtonElement = getElement('.login__button');

    if (document.querySelector('.form-item--error')) {
      loginBtn.setAttribute('disabled', 'disabled');
    } else {
      loginBtn.removeAttribute('disabled');
    }
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
        renderPopup(false, PopupMessages.EmptyLoginFields);
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
