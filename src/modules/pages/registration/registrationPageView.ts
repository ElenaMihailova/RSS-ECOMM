import PageView from '../../core/pageView';
import { createElement, getElement } from '../../helpers/functions';
import { FormItems } from '../../../types/interfaces';
import { AddressCategories } from '../../../types/enums';
import './registrationPageView.scss';
import { commonDataInputItems, createAddressFormItems } from './registrationItemsData';

class RegistrationView extends PageView {
  constructor() {
    super();
    this.container.classList.add('registration-page');
  }

  public render(): HTMLElement {
    const registrationPage = createElement({
      tagName: 'div',
      classNames: ['registration-page__container'],
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
      classNames: ['form-title__title'],
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

    const addressesContainer = createElement({
      tagName: 'div',
      classNames: ['addresses-container'],
      parent: registrationForm,
    });

    this.renderAddressContainer(addressesContainer, AddressCategories.Shipping);

    this.addBillingAddressFields(addressesContainer);

    createElement({
      tagName: 'button',
      classNames: ['registration-form__button', 'button', 'button--black'],
      text: 'SIGN UP',
      attributes: [{ type: 'button' }],
      parent: registrationForm,
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

      if (item.options) {
        this.addSelectOptions(formItemElement, item.options);
      }

      if (item.icon) {
        this.addInputIcon(formItem, item.icon);
      }

      if (item.btn) {
        this.addInputBtn(formItem, item.btn);
      }
    });

    return container;
  }

  private renderAddressContainer(container: HTMLElement, category: AddressCategories): HTMLElement {
    const addressContent = createElement({
      tagName: 'div',
      attributes: [{ category: `${category}` }],
      classNames: ['addresses-container__address-container', 'address-container', `${category}-address`],
      parent: container,
    });

    createElement({
      tagName: 'span',
      classNames: ['address-container__description', 'form-description'],
      text: `Enter your ${category} address : `,
      parent: addressContent,
    });

    this.renderFormItems(addressContent, createAddressFormItems(category));

    const addressCheckboxes = createElement({
      tagName: 'div',
      attributes: [{ category: `${category}` }],
      classNames: ['address-container__address-checkboxes', 'address-checkboxes', `${category}-address-checkboxes`],
      parent: addressContent,
    });

    const defaultAddressChekboxLabel = createElement({
      tagName: 'label',
      classNames: [`${category}-address__checkbox`, 'address-checkbox', 'checkbox'],
      attributes: [{ 'data-type': 'default-address' }, { category: `${category}` }],
      text: `Use as default address`,
      parent: addressCheckboxes,
    });

    createElement({
      tagName: 'input',
      classNames: ['input', `${category}-default-address__input`, `${category}-address__input`, 'visually-hidden'],
      attributes: [{ 'data-type': 'default-address' }, { type: 'checkbox' }, { disabled: 'true' }],
      parent: defaultAddressChekboxLabel,
    });

    createElement({
      tagName: 'span',
      parent: defaultAddressChekboxLabel,
    });

    if (category === AddressCategories.Shipping) {
      const useAsBillingChekboxLabel = createElement({
        tagName: 'label',
        classNames: [`use-as-billing-address__checkbox`, 'address-checkbox', 'checkbox'],
        attributes: [{ 'data-type': 'use-as-billing-address' }],
        text: `Also use as billing address`,
        parent: addressCheckboxes,
      });

      createElement({
        tagName: 'input',
        classNames: ['input', `use-as-billing-address__input`, `${category}-address__input`, 'visually-hidden'],
        attributes: [{ 'data-type': 'use-as-billing-address' }, { type: 'checkbox' }, { disabled: 'true' }],
        parent: useAsBillingChekboxLabel,
      });

      createElement({
        tagName: 'span',
        parent: useAsBillingChekboxLabel,
      });
    }

    return container;
  }

  public toggleBillingAddressView(): void {
    const addressesContainer: HTMLElement = getElement(`.addresses-container`);

    if (addressesContainer.querySelector('.billing-address')) {
      const billingAddressContainer = getElement(`.billing-address`);
      addressesContainer.removeChild(billingAddressContainer);
    } else {
      this.addBillingAddressFields(addressesContainer);
    }
  }

  private addBillingAddressFields(container: HTMLElement): void {
    this.renderAddressContainer(container, AddressCategories.Billing);
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
      classNames: ['login-title__title'],
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
