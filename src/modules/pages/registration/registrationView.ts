import PageView from '../../core/pageView';
import { createAdressFormItems, createElement } from '../../helpers/functions';
import { FormItems } from '../../../types/interfaces';
import AdressCategories from '../../../types/enums';
import './registrationPageView.scss';

const registrationFormInputItems: FormItems[] = [
  {
    tagName: 'input',
    attributes: [{ dataType: 'name' }, { type: 'text' }, { placeholder: 'Name' }, { hasIcon: 'true' }],
    classNames: ['registration-form__input', 'input'],
    icon: {
      className: 'name-input-icon',
      attributes: [{ position: 'start' }],
    },
  },
  {
    tagName: 'input',
    attributes: [{ dataType: 'surname' }, { type: 'text' }, { placeholder: 'Surname' }, { hasIcon: 'true' }],
    classNames: ['registration-form__input', 'input'],
    icon: {
      className: 'surname-input-icon',
      attributes: [{ position: 'start' }],
    },
  },
  {
    tagName: 'input',
    attributes: [{ dataType: 'age' }, { type: 'text' }, { placeholder: 'Date of Birth' }, { hasIcon: 'true' }],
    classNames: ['registration-form__input', 'input'],
    icon: {
      className: 'age-input-icon',
      attributes: [{ position: 'start' }],
    },
  },
  {
    tagName: 'input',
    attributes: [{ dataType: 'email' }, { type: 'text' }, { placeholder: 'Email Adress' }, { hasIcon: 'true' }],
    classNames: ['registration-form__input', 'input'],
    icon: {
      className: 'email-input-icon',
      attributes: [{ position: 'start' }],
    },
  },
  {
    tagName: 'input',
    attributes: [{ dataType: 'password' }, { type: 'text' }, { placeholder: 'Enter your password' }],
    classNames: ['registration-form__input', 'input', 'password-input'],
    icon: {
      className: 'password-input-icon',
      attributes: [{ position: 'end' }],
    },
  },
];

class RegistrationView extends PageView {
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

    createElement({
      tagName: 'button',
      classNames: ['registration-form__button', 'button', 'button--black'],
      text: 'SIGN UP',
      attributes: [{ type: 'submit' }],
      parent: registrationForm,
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
