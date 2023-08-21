import PageView from '../../core/pageView';
import { createElement } from '../../helpers/functions';
import './loginPage.scss';

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
      classNames: ['login__text', 'form-item', 'form-item-element'],
      text: 'Welcome back! Sign in for faster checkout.',
      parent: loginContainer,
    });

    const loginForm = createElement({
      tagName: 'form',
      classNames: ['login__form', 'form'],
      attributes: [{ action: '#' }],
      parent: loginContainer,
    });

    const loginEmailInputContainer = createElement({
      tagName: 'div',
      classNames: ['login__email-input-container', 'form-item'],
      parent: loginForm,
    });

    const loginEmailIcon = createElement({
      tagName: 'span',
      classNames: ['login__email-icon'],
      parent: loginEmailInputContainer,
    });

    const loginEmailInput = createElement({
      tagName: 'input',
      classNames: ['input', 'login__email-input', 'form-item-element'],
      attributes: [{ 'data-type': 'email' }, { type: 'text' }, { value: '' }, { placeholder: 'Email Adress' }],
      parent: loginEmailInputContainer,
    });

    const loginPasswordInputContainer = createElement({
      tagName: 'div',
      classNames: ['login__password-input-container', 'form-item'],
      parent: loginForm,
    });

    const loginPasswordIcon = createElement({
      tagName: 'span',
      classNames: ['login__password-icon'],
      parent: loginPasswordInputContainer,
    });

    const loginShowPasswordBtn = createElement({
      tagName: 'button',
      classNames: ['login__showpassword-button'],
      text: 'SHOW',
      attributes: [{ type: 'button' }],
      parent: loginPasswordInputContainer,
    });

    const loginPasswordInput = createElement({
      tagName: 'input',
      classNames: ['input', 'login__password-input'],
      attributes: [
        { 'data-type': 'login-password' },
        { type: 'password' },
        { value: '' },
        { placeholder: 'Enter your password' },
      ],
      parent: loginPasswordInputContainer,
    });

    const loginSubmit = createElement({
      tagName: 'button',
      classNames: ['login__button'],
      attributes: [{ type: 'button' }],
      text: 'SIGN IN',
      parent: loginForm,
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
      attributes: [{ type: 'button' }],
      text: 'CREATE AN ACCOUNT',
      parent: registrationContainer,
    });

    return this.container;
  }
}

export default LoginView;
