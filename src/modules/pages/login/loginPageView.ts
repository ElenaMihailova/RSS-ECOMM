import obtainAccessToken from '../../api/api-client';
import PageView from '../../core/pageView';
import { createElement, getElement } from '../../helpers/functions';
import './loginPageView.scss';

class LoginView extends PageView {
  constructor() {
    super();
    this.container.classList.add('login-page');
  }

  public render(): HTMLElement {
    const loginContainer = createElement({
      tagName: 'div',
      classNames: ['login__container'],
      parent: this.container,
    });

    const loginTitle = createElement({
      tagName: 'p',
      classNames: ['login__title'],
      text: 'Already a customer?',
      parent: loginContainer,
    });

    const loginText = createElement({
      tagName: 'p',
      classNames: ['login__text'],
      text: 'Welcome back! Sign in for faster checkout.',
      parent: loginContainer,
    });

    const loginEmailIcon = createElement({
      tagName: 'span',
      classNames: ['login__email-icon'],
      parent: loginContainer,
    });

    const loginEmailInput = createElement({
      tagName: 'input',
      classNames: ['input', 'login__email-input'],
      attributes: [{ type: 'text' }, { value: '' }, { placeholder: 'Email Adress' }],
      parent: loginContainer,
    });

    const loginPasswordIcon = createElement({
      tagName: 'span',
      classNames: ['login__password-icon'],
      parent: loginContainer,
    });

    const loginPasswordInput = createElement({
      tagName: 'input',
      classNames: ['input', 'login__password-input'],
      attributes: [{ type: 'text' }, { value: '' }, { placeholder: 'Enter your password' }],
      parent: loginContainer,
    });

    const loginSubmit = createElement({
      tagName: 'button',
      classNames: ['login__button'],
      text: 'SIGN IN',
      parent: loginContainer,
    });

    const registrationContainer = createElement({
      tagName: 'div',
      classNames: ['registration__container'],
      parent: this.container,
    });

    const registrationTitle = createElement({
      tagName: 'p',
      classNames: ['registration__title'],
      text: 'New to our company?',
      parent: registrationContainer,
    });

    const registrationOptions = createElement({
      tagName: 'ul',
      classNames: ['registration__advantages-title'],
      text: 'Create an account for the best experience',
      parent: registrationContainer,
    });

    const optionsText: string[] = [
      'Modify and track your orders',
      'Faster checkout',
      'Get a 10% discount for new customer',
    ];

    optionsText.forEach((optionText) => {
      const option = createElement({
        tagName: 'li',
        classNames: ['registration__advantages-option'],
        text: optionText,
        parent: registrationOptions,
      });
    });

    const createAccButton = createElement({
      tagName: 'button',
      classNames: ['registration__button'],
      text: 'CREATE AN ACCOUNT',
      parent: registrationContainer,
    });

    return this.container;
  }

  public runHandlers(): void {
    this.loginHandler();
  }

  private loginHandler(): void {
    const loginBtn: HTMLButtonElement = getElement('.login__button');
    loginBtn.addEventListener('click', async () => {
      await obtainAccessToken();
    });
  }
}

export default LoginView;
