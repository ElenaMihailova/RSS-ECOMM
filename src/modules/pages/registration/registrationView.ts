import PageView from '../../core/pageView';
import { createAdressFormItems, createElement, getElementCollection } from '../../helpers/functions';
import { FormItems } from '../../../types/interfaces';
import { AdressCategories } from '../../../types/enums';
import './registrationPageView.scss';
import Validate from '../../validation/validator';
import { removeError } from '../../validation/validationHelpers';

const registrationFormInputItems: FormItems[] = [
  {
    tagName: 'input',
    attributes: [{ 'data-type': 'name' }, { type: 'text' }, { placeholder: 'Name' }, { 'has-icon': 'true' }],
    classNames: ['registration-form__input', 'input'],
    icon: {
      className: 'name-input-icon',
      attributes: [{ position: 'start' }],
    },
  },
  {
    tagName: 'input',
    attributes: [{ 'data-type': 'surname' }, { type: 'text' }, { placeholder: 'Surname' }, { 'has-icon': 'true' }],
    classNames: ['registration-form__input', 'input'],
    icon: {
      className: 'surname-input-icon',
      attributes: [{ position: 'start' }],
    },
  },
  {
    tagName: 'input',
    attributes: [{ 'data-type': 'age' }, { type: 'text' }, { placeholder: 'Date of Birth' }, { 'has-icon': 'true' }],
    classNames: ['registration-form__input', 'input'],
    icon: {
      className: 'age-input-icon',
      attributes: [{ position: 'start' }],
    },
  },
  {
    tagName: 'input',
    attributes: [{ 'data-type': 'email' }, { type: 'text' }, { placeholder: 'Email Adress' }, { 'has-icon': 'true' }],
    classNames: ['registration-form__input', 'input'],
    icon: {
      className: 'email-input-icon',
      attributes: [{ position: 'start' }],
    },
  },
  {
    tagName: 'input',
    attributes: [{ 'data-type': 'password' }, { type: 'text' }, { placeholder: 'Enter your password' }],
    classNames: ['registration-form__input', 'input', 'password-input'],
    icon: {
      className: 'password-input-icon',
      attributes: [{ position: 'end' }],
    },
  },
];

class RegistrationView extends PageView {
  private validate: Validate;

  constructor() {
    super();
    this.validate = new Validate();
  }

  public render(): HTMLElement {
    const registrationPageContainer = createElement({
      tagName: 'div',
      classNames: ['registration-container'],
      parent: this.container,
    });

    const registrationPageContent = createElement({
      tagName: 'div',
      classNames: ['registration-content'],
      parent: registrationPageContainer,
    });

    const formTitleContainer = createElement({
      tagName: 'div',
      classNames: ['form-title'],
      parent: registrationPageContent,
    });

    createElement({
      tagName: 'span',
      text: 'Create an account!',
      classNames: ['form-title__title', 'title'],
      parent: formTitleContainer,
    });

    createElement({
      tagName: 'span',
      text: 'Please, fill out this form.',
      classNames: ['form-title__description', 'form-description'],
      parent: formTitleContainer,
    });

    const registrationForm = createElement({
      tagName: 'form',
      classNames: ['registration-form', 'form'],
      attributes: [{ action: '#' }],
      parent: registrationPageContent,
    });

    this.renderFormItems(registrationForm, registrationFormInputItems);

    const adressesContainer = createElement({
      tagName: 'div',
      classNames: ['adresses-container'],
      parent: registrationForm,
    });

    this.renderAdressContainer(adressesContainer, AdressCategories.shipping);
    this.renderAdressContainer(adressesContainer, AdressCategories.billing);

    const submitFormButton = createElement({
      tagName: 'button',
      classNames: ['registration-form__button', 'button', 'button--black'],
      text: 'SIGN UP',
      attributes: [{ type: 'submit' }],
      parent: registrationForm,
    });

    submitFormButton.addEventListener('click', (e: Event) => {
      e.preventDefault();
      this.validate.validateSubmit();
    });

    return this.container;
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
          this.validate.validateRealTime(formItemElement as HTMLInputElement);
        });
        formItemElement.addEventListener('focusout', (e: Event) => {
          e.preventDefault();
          this.validate.validateFocusOut(formItemElement as HTMLInputElement);
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
          this.validate.setCountryFromSelectValue(adressCategory, selectElement);
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
        createElement({
          tagName: 'div',
          classNames: ['input-icon', `${item.icon.className}`],
          attributes: item.icon.attributes,
          parent: formItem,
        });
      }
    });

    return container;
  }

  private renderAdressContainer(container: HTMLElement, category: AdressCategories): HTMLElement {
    const adressContent = createElement({
      tagName: 'div',
      classNames: ['adresses-container__adress-form-content', 'adress-form-content', `${category}-adress`],
      parent: container,
    });

    createElement({
      tagName: 'span',
      classNames: ['adress-form-content__description', 'form-description'],
      text: `Enter your ${category} adress : `,
      parent: adressContent,
    });

    this.renderFormItems(adressContent, createAdressFormItems(category));

    const adressChekboxLabel = createElement({
      tagName: 'label',
      classNames: [`${category}-adress__checkbox`, 'adress-checkbox', 'checkbox'],
      text: `Use as default ${category} adress`,
      parent: adressContent,
    });

    createElement({
      tagName: 'input',
      classNames: ['input', `${category}-adress__input`, 'visually-hidden'],
      attributes: [{ type: 'checkbox' }, { disabled: 'true' }],
      parent: adressChekboxLabel,
    });

    createElement({
      tagName: 'span',
      parent: adressChekboxLabel,
    });

    return container;
  }
}

export default RegistrationView;
