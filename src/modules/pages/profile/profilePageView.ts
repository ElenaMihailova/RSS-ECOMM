import PageView from '../../core/pageView';
import { createElement, getElement } from '../../helpers/functions';
import './profilePage.scss';
import { AddressDetails, ProfileData, ProfileDataItem } from '../../../types/interfaces';
import { contactData, passwordData, personalData } from './profileItemsData';
import {
  AddressCategories,
  Mode,
  ProfileDataBtns,
  ProfileDataCategories,
  ProfilePageBtnsTitles,
} from '../../../types/enums';
import { PageUrls } from '../../../assets/data/constants';

class ProfileView extends PageView {
  public authorizedCustomerID: string | undefined;

  constructor() {
    super();
    this.container.classList.add('profile-page');
  }

  public render(): HTMLElement {
    const profilePageContainer = createElement({
      tagName: 'div',
      classNames: ['profile-page__container'],
      parent: this.container,
    });

    this.renderPageButtons(profilePageContainer);

    const profilePageContent = createElement({
      tagName: 'div',
      classNames: ['profile-page__content', 'profile-content'],
      parent: profilePageContainer,
    });

    const addresesContainer = createElement({
      tagName: 'div',
      classNames: ['profile-content__addresses'],
      parent: profilePageContent,
    });

    switch (window.location.pathname.slice(1)) {
      case PageUrls.ProfilePageUrl:
        this.renderUserDataContainer(addresesContainer, ProfileDataCategories.Personal, personalData);
        this.renderUserDataContainer(addresesContainer, ProfileDataCategories.Contact, contactData);
        break;
      case `${PageUrls.ProfilePageUrl}/${PageUrls.ChangePasswordPageUrl}`:
        this.renderUserDataContainer(addresesContainer, ProfileDataCategories.Password, passwordData);
        break;
      default:
    }

    return this.container;
  }

  public renderAddNewAddressButton(): void {
    const profileContent: HTMLElement = getElement('.profile-content');

    createElement({
      tagName: 'button',
      text: 'Add new address',
      classNames: ['profile-content__btn', 'button'],
      attributes: [{ category: 'address' }, { type: 'add' }],
      parent: profileContent,
    });
  }

  public renderAddressDetails(container: HTMLDivElement, addressDetails: AddressDetails): void {
    const addressDetailsContainer = createElement({
      tagName: 'div',
      classNames: ['address-details'],
      parent: container,
    });

    const addressDescription = createElement({
      tagName: 'div',
      classNames: ['address-description-container'],
      parent: addressDetailsContainer,
    });

    this.renderAddressDescription(addressDescription, addressDetails);

    const addressCheckboxes = createElement({
      tagName: 'div',
      classNames: ['address-checkboxes-container'],
      parent: addressDetailsContainer,
    });

    if (addressDetailsContainer.closest('.profile-data')?.getAttribute('address-id')) {
      addressCheckboxes.classList.add('visually-hidden');
    } else {
      addressDescription.classList.add('visually-hidden');
    }

    this.renderAddressCheckboxes(addressCheckboxes, AddressCategories.Shipping);
    this.renderAddressCheckboxes(addressCheckboxes, AddressCategories.Billing);
  }

  public renderUserDataContainer(container: HTMLElement, category: string, data: ProfileData): HTMLDivElement {
    const dataContainer = createElement({
      tagName: 'div',
      classNames: ['profile-data', `${category}-data`],
      parent: container,
    });

    const titleContainer = createElement({
      tagName: 'div',
      classNames: ['profile-data__title-container', 'title-container'],
      parent: dataContainer,
    });

    createElement({
      tagName: 'span',
      text: data.title,
      classNames: ['title', 'profile-data-title'],
      parent: titleContainer,
    });

    const dataForm = createElement({
      tagName: 'form',
      classNames: [`profile-data-form`, `${category}-data-form`],
      parent: dataContainer,
    });

    if (data.dataItems) {
      this.renderDataItems(dataForm, data.dataItems, category);
    }

    if (data.id) {
      dataContainer.setAttribute('address-id', `${data.id}`);
      dataContainer.setAttribute('mode', Mode.View);
    } else {
      dataContainer.setAttribute('mode', `${Mode.Create}`);
    }

    if (data.addressDetails) {
      this.renderAddressDetails(dataContainer, data.addressDetails);
    }

    const btnsContainer = createElement({
      tagName: 'div',
      classNames: ['profile-data-btns', `${category}-data__btns`],
      attributes: [{ category: `${category}` }],
      parent: dataContainer,
    });

    if (data.buttonEdit) {
      createElement({
        tagName: 'button',
        classNames: [`${category}-data__btn`, 'profile-data-btn', `profile-data-btn--edit`],
        attributes: [{ category: `${category}` }, { type: `${ProfileDataBtns.Edit}` }],
        text: data.buttonEdit,
        parent: btnsContainer,
      });
    }

    if (data.buttonRemove) {
      createElement({
        tagName: 'button',
        classNames: [`${category}-data__btn`, 'profile-data-btn', `profile-data-btn--remove`],
        attributes: [{ category: `${category}` }, { type: `${ProfileDataBtns.Remove}` }],
        text: data.buttonRemove,
        parent: btnsContainer,
      });
    }

    if (data.buttonSave) {
      createElement({
        tagName: 'button',
        classNames: [`${category}-data__btn`, 'profile-data-btn', `profile-data-btn--save`],
        attributes: [{ category: `${category}` }, { type: `${ProfileDataBtns.Save}` }],
        text: data.buttonSave,
        parent: btnsContainer,
      });
    }

    return dataContainer;
  }

  public renderDataItems(container: HTMLElement, data: ProfileDataItem[], category: string): HTMLElement {
    data.forEach((item) => {
      const dataItem = createElement({
        tagName: 'div',
        classNames: [`${category}-data-item`, 'profile-data-item'],
        parent: container,
      });

      createElement({
        tagName: 'p',
        classNames: [`${category}-data-item__label`, 'profile-data-label'],
        text: item.label,
        parent: dataItem,
      });

      const formItem = createElement({
        tagName: 'div',
        classNames: [`${category}-data-item__form-item`, 'profile-form-item', 'form-item'],
        parent: dataItem,
      });

      const formElement = createElement({
        tagName: item.element.tagName,
        classNames: item.element.classNames,
        attributes: item.element.attributes,
        parent: formItem,
      });

      if (
        formElement.getAttribute('data-type') !== 'password' &&
        !formElement.classList.contains('profile-element--create-mode')
      ) {
        const eLement = formElement as HTMLInputElement | HTMLSelectElement;
        eLement.disabled = true;
      }

      if (item.element.options) {
        this.addSelectOptions(formElement, item.element.options);
      }

      if (item.element.btn) {
        this.addInputBtn(formItem, item.element.btn);
      }
    });

    return container;
  }

  public renderAddressDescription(container: HTMLElement, addressDetails: AddressDetails): void {
    const details = [];

    if (addressDetails.shippingAddress) {
      details.push('Shipping address');
      if (addressDetails.isDefaultShippingAddress) {
        details.push('Default shipping address');
      }
    }
    if (addressDetails.billingAddress) {
      details.push('Billing address');
      if (addressDetails.isDefaultBillingAddress) {
        details.push('Default billing address');
      }
    }

    const addressDescription = createElement({
      tagName: 'ul',
      classNames: ['address-description'],
      parent: container,
    });

    details.forEach((detail) => {
      createElement({
        tagName: 'li',
        text: detail,
        classNames: ['address-description__item'],
        parent: addressDescription,
      });
    });
  }

  public renderAddressCheckboxes(container: HTMLElement, category: AddressCategories): void {
    const categoryCheckboxesContainer = createElement({
      tagName: 'div',
      classNames: [`address-checkboxes-container__checkboxes`, `${category}-address-checkboxes`, 'address-checkboxes'],
      attributes: [{ category: `${category}` }],
      parent: container,
    });

    const addressCategory = createElement({
      tagName: 'label',
      classNames: [`${category}-address-checkbox`, 'address-checkbox', 'checkbox'],
      text: `Use as ${category} address`,
      parent: categoryCheckboxesContainer,
    });

    createElement({
      tagName: 'input',
      classNames: ['input', `${category}-address-checkbox__input`, 'visually-hidden'],
      attributes: [{ 'data-type': 'address-category' }, { type: 'checkbox' }, { category: `${category}` }],
      parent: addressCategory,
    });

    createElement({
      tagName: 'span',
      parent: addressCategory,
    });

    const defaultAddress = createElement({
      tagName: 'label',
      classNames: [`${category}-address-checkbox`, 'address-checkbox', 'checkbox', 'visually-hidden'],
      text: `Default ${category} address`,
      parent: categoryCheckboxesContainer,
    });

    createElement({
      tagName: 'input',
      classNames: ['input', `${category}-address-checkbox__input`, 'visually-hidden'],
      attributes: [{ 'data-type': 'default-address' }, { type: 'checkbox' }, { category: `${category}` }],
      parent: defaultAddress,
    });

    createElement({
      tagName: 'span',
      parent: defaultAddress,
    });
  }

  private renderPageButtons(container: HTMLElement): void {
    const btnsContainer = createElement({
      tagName: 'div',
      classNames: ['profile-page__btns', 'profile-page-btns'],
      parent: container,
    });

    createElement({
      tagName: 'button',
      classNames: ['profile-page-btns__btn', 'profile-page-btn', 'profile-data-page-btn', 'button'],
      attributes: [{ type: 'button' }],
      text: ProfilePageBtnsTitles.Profile,
      parent: btnsContainer,
    });

    createElement({
      tagName: 'button',
      classNames: ['profile-page-btns__btn', 'profile-page-btn', 'addresses-page-btn', 'button'],
      attributes: [{ type: 'button' }],
      text: ProfilePageBtnsTitles.Addresses,
      parent: btnsContainer,
    });

    createElement({
      tagName: 'button',
      classNames: ['profile-page-btns__btn', 'profile-page-btn', 'change-password-page-btn', 'button'],
      attributes: [{ type: 'button' }],
      text: ProfilePageBtnsTitles.ChangePassword,
      parent: btnsContainer,
    });
  }
}

export default ProfileView;
