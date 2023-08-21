import PageView from '../../core/pageView';
import { createElement, getElement, getElementCollection } from '../../helpers/functions';
import { FormItems } from '../../../types/interfaces';
import { AdressCategories } from '../../../types/enums';
import './registrationPageView.scss';
import Validator from '../../validation/validator';
import { removeError } from '../../validation/validationHelpers';
import { commonDataInputItems } from './registrationItemsData';

class RegistrationView extends PageView {
  private validator: Validator;

  constructor() {
    super();
    this.validator = new Validator();
  }

  public render(): HTMLElement {
    const registrationPage = createElement({
      tagName: 'div',
      classNames: ['registration-page'],
      parent: this.container,
    });

    const registrationPageContent = createElement({
      tagName: 'div',
      classNames: ['registration-page__content'],
      parent: registrationPage,
    });

    this.renderRegistrationFormContainer(registrationPageContent);
    this.renderLoginContainer(registrationPageContent);

    return this.container;
  }

  private renderRegistrationFormContainer(container: HTMLElement): void {
    const registrationFormContainer = createElement({
      tagName: 'div',
      classNames: ['registration-form-container'],
      parent: container,
    });

    const formTitleContainer = createElement({
      tagName: 'div',
      classNames: ['title-container', 'form-title'],
      parent: registrationFormContainer,
    });

    createElement({
      tagName: 'span',
      text: 'Create an account!',
      classNames: ['title', 'form-title__title'],
      parent: formTitleContainer,
    });

    createElement({
      tagName: 'span',
      text: 'Please, fill out this form.',
      classNames: ['form-title__description', 'form-description', 'description'],
      parent: formTitleContainer,
    });

    const registrationForm = createElement({
      tagName: 'form',
      classNames: ['registration-form', 'form'],
      attributes: [{ action: '#' }],
      parent: registrationFormContainer,
    });

    const commonDataContainer = createElement({
      tagName: 'div',
      classNames: ['common-data-container'],
      parent: registrationForm,
    });

    this.renderFormItems(commonDataContainer, commonDataInputItems);

    const adressesContainer = createElement({
      tagName: 'div',
      classNames: ['adresses-container'],
      parent: registrationForm,
    });

    this.renderAdressContainer(adressesContainer, AdressCategories.shipping);

    this.addBillingAdressFields(adressesContainer);

    const submitFormButton = createElement({
      tagName: 'button',
      classNames: ['registration-form__button', 'button', 'button--black'],
      text: 'SIGN UP',
      attributes: [{ type: 'button' }],
      parent: registrationForm,
    });

    submitFormButton.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      const isValid = await this.validator.validateSubmit();
      if (isValid) {
        console.log('успешное уведомление');
      }
    });
  }

  private renderPopup(succes: boolean): void {
    const type = succes ? 'succes' : 'error';
    const text = succes ? 'Succesfully registered!' : 'The customer with this email is already registered!';
    const popup = createElement({
      tagName: 'div',
      classNames: ['popup', `${type}-popup`],
      parent: document.body,
    });

    const content = createElement({
      tagName: 'div',
      classNames: ['popup-content', `${type}-popup-content`],
      text,
      parent: popup,
    });

    popup.addEventListener('click', (): void => {
      popup.remove();
      content.remove();
    });
  }

  private renderFormItems(container: HTMLElement, data: FormItems[]): HTMLElement {
    data.forEach((item) => {
      const formItem = createElement({
        tagName: 'div',
        classNames: ['form-item'],
        parent: container,
      });

      const formItemElement = createElement({
        tagName: item.tagName,
        classNames: item.classNames,
        attributes: item.attributes,
        parent: formItem,
      });

      formItemElement.classList.add('form-item-element');

      if (item.tagName === 'input') {
        formItemElement.addEventListener('input', (e: Event) => {
          e.preventDefault();
          this.validator.validateRealTime(formItemElement as HTMLInputElement);
        });

        formItemElement.addEventListener('focusout', (e: Event) => {
          e.preventDefault();
          this.validator.validateFocusOut(formItemElement as HTMLInputElement);
        });
      }

      if (item.tagName === 'select') {
        const adressCategory = formItemElement.getAttribute('category');

        formItemElement.addEventListener('change', () => {
          const adressInputs = getElementCollection(`.${adressCategory}-adress__input`);

          adressInputs.forEach((input) => {
            const inputElement = input as HTMLInputElement;
            removeError(inputElement);
            inputElement.value = '';
            inputElement.disabled = false;
          });
        });

        formItemElement.addEventListener('focusout', () => {
          const selectElement = formItemElement as HTMLSelectElement;
          this.validator.setCountryFromSelectValue(adressCategory, selectElement);
        });
      }

      if (item.options) {
        item.options.forEach((option) => {
          createElement({
            tagName: 'option',
            attributes: option.attributes,
            text: option.text,
            parent: formItemElement,
          });
        });
      }

      if (item.icon) {
        const icon = createElement({
          tagName: 'div',
          classNames: ['input-icon', `${item.icon.className}`],
          attributes: item.icon.attributes,
          parent: formItem,
        });

        if (icon.classList.contains('password-input-icon')) {
          icon.addEventListener('click', () => {
            this.togglePasswordView();
          });
        }
      }
    });

    return container;
  }

  private togglePasswordView(): void {
    const passwordInput: HTMLInputElement = getElement('.password-input');
    if (passwordInput.getAttribute('type') === 'password') {
      passwordInput.removeAttribute('type');
      passwordInput.setAttribute('type', 'text');
    } else {
      passwordInput.removeAttribute('type');
      passwordInput.setAttribute('type', 'password');
    }
  }

  private renderAdressContainer(container: HTMLElement, category: AdressCategories): HTMLElement {
    const adressContent = createElement({
      tagName: 'div',
      attributes: [{ category: `${category}` }],
      classNames: ['adresses-container__adress-container', 'adress-container', `${category}-adress`],
      parent: container,
    });

    createElement({
      tagName: 'span',
      classNames: ['adress-container__description', 'form-description'],
      text: `Enter your ${category} adress : `,
      parent: adressContent,
    });

    this.renderFormItems(adressContent, this.createAdressFormItems(category));

    const adressCheckboxes = createElement({
      tagName: 'div',
      attributes: [{ category: `${category}` }],
      classNames: ['adress-container__adress-checkboxes', 'adress-checkboxes', `${category}-adress-checkboxes`],
      parent: adressContent,
    });

    const defaultAdressChekboxLabel = createElement({
      tagName: 'label',
      classNames: [`${category}-adress__checkbox`, 'adress-checkbox', 'checkbox'],
      attributes: [{ 'data-type': 'default-adress' }, { category: `${category}` }],
      text: `Use as default adress`,
      parent: adressCheckboxes,
    });

    createElement({
      tagName: 'input',
      classNames: ['input', `${category}-default-adress__input`, `${category}-adress__input`, 'visually-hidden'],
      attributes: [{ 'data-type': 'default-adress' }, { type: 'checkbox' }, { disabled: 'true' }],
      parent: defaultAdressChekboxLabel,
    });

    createElement({
      tagName: 'span',
      parent: defaultAdressChekboxLabel,
    });

    if (category === AdressCategories.shipping) {
      const useAsBillingChekboxLabel = createElement({
        tagName: 'label',
        classNames: [`use-as-billing-adress__checkbox`, 'adress-checkbox', 'checkbox'],
        attributes: [{ 'data-type': 'use-as-billing-adress' }],
        text: `Also use as billing adress`,
        parent: adressCheckboxes,
      });

      const useAsBillingCheckbox = createElement({
        tagName: 'input',
        classNames: ['input', `use-as-billing-adress__input`, `${category}-adress__input`, 'visually-hidden'],
        attributes: [{ 'data-type': 'use-as-billing-adress' }, { type: 'checkbox' }, { disabled: 'true' }],
        parent: useAsBillingChekboxLabel,
      });

      useAsBillingCheckbox.addEventListener('change', () => {
        this.toggleBillingAdressView();
      });

      createElement({
        tagName: 'span',
        parent: useAsBillingChekboxLabel,
      });
    }

    return container;
  }

  private toggleBillingAdressView(): void {
    const adressesContainer: HTMLElement = getElement(`.adresses-container`);
    if (adressesContainer.querySelector('.billing-adress')) {
      const billingAdressContainer = getElement(`.billing-adress`);
      adressesContainer.removeChild(billingAdressContainer);
    } else {
      this.addBillingAdressFields(adressesContainer);
    }
  }

  private addBillingAdressFields(container: HTMLElement): void {
    this.renderAdressContainer(container, AdressCategories.billing);
  }

  private createAdressFormItems(category: AdressCategories): FormItems[] {
    return [
      {
        tagName: 'select',
        attributes: [{ 'data-type': 'country' }, { name: 'country' }, { category: `${category}` }],
        classNames: [`${category}-adress__select`, 'select'],
        options: [
          {
            text: 'Select your country',
            attributes: [{ value: '' }, { selected: 'true' }, { disabled: 'true' }],
          },
          {
            text: 'Belarus',
            attributes: [{ value: 'Belarus' }],
          },
          {
            text: 'Spain',
            attributes: [{ value: 'Spain' }],
          },
          {
            text: 'Netherlands',
            attributes: [{ value: 'Netherlands' }],
          },
        ],
      },
      {
        tagName: 'input',
        attributes: [
          { 'data-type': 'city' },
          { category: `${category}` },
          { type: 'text' },
          { placeholder: 'City' },
          { disabled: 'true' },
        ],
        classNames: ['registration-form__input', `${category}-adress__input`, 'input'],
      },
      {
        tagName: 'input',
        attributes: [
          { 'data-type': 'street' },
          { category: `${category}` },
          { type: 'text' },
          { placeholder: 'Street' },
          { disabled: 'true' },
        ],
        classNames: ['registration-form__input', `${category}-adress__input`, 'input'],
      },
      {
        tagName: 'input',
        attributes: [
          { 'data-type': 'postal-code' },
          { category: `${category}` },
          { type: 'text' },
          { placeholder: 'Postal Code' },
          { disabled: 'true' },
        ],
        classNames: ['registration-form__input', `${category}-adress__input`, 'input'],
      },
    ];
  }

  private renderLoginContainer(container: HTMLElement): void {
    const loginContainer = createElement({
      tagName: 'div',
      classNames: ['login-container'],
      parent: container,
    });

    const loginTitleContainer = createElement({
      tagName: 'div',
      classNames: ['title-container', 'login-title'],
      parent: loginContainer,
    });

    createElement({
      tagName: 'span',
      text: 'Already a customer?',
      classNames: ['title', 'login-title__title'],
      parent: loginTitleContainer,
    });

    createElement({
      tagName: 'span',
      text: 'Welcome back!',
      classNames: ['login-title__description', 'description'],
      parent: loginTitleContainer,
    });

    createElement({
      tagName: 'button',
      classNames: ['login-container__button', 'button'],
      text: 'SIGN IN',
      attributes: [{ type: 'button' }],
      parent: loginContainer,
    });
  }
}

export default RegistrationView;
