/* eslint-disable @typescript-eslint/no-use-before-define */
import { Customer, CustomerDraft } from '@commercetools/platform-sdk';
import {
  AddressCategories,
  ProfileDataCategories,
  ProfileDataBtns,
  ProfileDataBtnsTitles,
  CheckboxTypes,
  FieldNames,
  Mode,
} from '../../../types/enums';
import { getUpdatedCustomer } from '../../api';
import { getElementCollection, getElement, createElement, getCountryFromCountryCode } from '../../helpers/functions';
import { createAddressesData } from './profileItemsData';
import ProfileView from './profilePageView';
import { getDateDMYFormatFromIsoString } from '../../validation/validationHelpers';
import { ProfileData } from '../../../types/interfaces';
import { getAddressContainerSelector, getAddressContainerMode } from './profileHelpers';

const view = new ProfileView();

export const setValuesToCheckboxes = (data: Customer, category: AddressCategories, addressID: string): void => {
  const { defaultBillingAddressId, defaultShippingAddressId, shippingAddressIds, billingAddressIds } = data;

  const currentAddresses = category === AddressCategories.Shipping ? shippingAddressIds : billingAddressIds;
  const currentDefaultAddress =
    category === AddressCategories.Shipping ? defaultShippingAddressId : defaultBillingAddressId;

  const checkboxes = getElementCollection(`[address-id="${addressID}"] .${category}-address-checkboxes .input`);

  checkboxes.forEach((element) => {
    const checkbox = element as HTMLInputElement;
    switch (checkbox.getAttribute('data-type')) {
      case CheckboxTypes.AddressCategory:
        checkbox.checked = Boolean(currentAddresses?.includes(`${addressID}`));
        break;
      case CheckboxTypes.DefaultAddress:
        checkbox.checked = Boolean(currentDefaultAddress === addressID);
        break;
      default:
    }

    toggleAddressCheckboxesView(checkbox);
  });
};

export const toggleAddressCheckboxesView = (element: HTMLInputElement): void => {
  const category = element.closest('.address-checkboxes')?.getAttribute('category');
  const containerSelector = getAddressContainerSelector(element);

  if (element.getAttribute('data-type') === 'address-category') {
    const defaultAddressCheckbox: HTMLInputElement = getElement(
      `${containerSelector} .${category}-address-checkboxes [data-type="default-address"]`,
    );

    const defaultAddressLabel = defaultAddressCheckbox.closest('.checkbox');

    if (!element.checked) {
      defaultAddressCheckbox.checked = false;
      defaultAddressLabel?.classList.add('visually-hidden');
    } else {
      defaultAddressLabel?.classList.remove('visually-hidden');
    }
  }
};

export const rerenderAddressDetails = async (customerID: string): Promise<void> => {
  const addressesData = await createAddressesData(customerID);

  const addressContainers = getElementCollection('.profile-data');

  for await (const container of addressContainers) {
    const id = container.getAttribute('address-id');

    const address = addressesData.find((addressData) => addressData.id === id);

    const addressDescriptionContainer: HTMLDivElement = getElement(
      `[address-id="${id}"] .address-description-container`,
    );
    addressDescriptionContainer.innerHTML = '';

    if (id && address?.addressDetails && customerID) {
      view.renderAddressDescription(addressDescriptionContainer, address?.addressDetails);
      const data = await getUpdatedCustomer(customerID);
      setValuesToCheckboxes(data, AddressCategories.Shipping, id);
      setValuesToCheckboxes(data, AddressCategories.Billing, id);
    }
  }
};

export const toggleAddressButtonsDisable = (mode: string): void => {
  const profileDataBtns = getElementCollection('.profile-data-btn');

  profileDataBtns.forEach((element) => {
    const button = element as HTMLButtonElement;
    button.disabled = mode === Mode.Create && button.getAttribute('type') !== ProfileDataBtns.Save;
  });

  const addAddressBtn: HTMLButtonElement = getElement(`.profile-content [type="${ProfileDataBtns.Add}"]`);
  addAddressBtn.disabled = mode === Mode.Create;
};

export const setNewContainerTitle = (containerSelector: string, newTitle: string): void => {
  const title: HTMLSpanElement = getElement(`${containerSelector} [type="${ProfileDataBtns.Save}"]`);
  title.innerText = newTitle;
};

export const renderEditBtn = (container: HTMLElement): HTMLButtonElement => {
  return createElement({
    tagName: 'button',
    classNames: [`address-data__btn`, 'profile-data-btn', `profile-data-btn--edit`],
    attributes: [{ category: ProfileDataCategories.Address }, { type: `${ProfileDataBtns.Edit}` }],
    text: ProfileDataBtnsTitles.EditAddress,
    parent: container,
  });
};

export const renderRemoveBtn = (container: HTMLElement): HTMLButtonElement => {
  return createElement({
    tagName: 'button',
    classNames: [`address-data__btn`, 'profile-data-btn', `profile-data-btn--remove`],
    attributes: [{ category: ProfileDataCategories.Address }, { type: `${ProfileDataBtns.Remove}` }],
    text: ProfileDataBtnsTitles.RemoveAddress,
    parent: container,
  });
};

export const setValueToCountrySelect = (id: string, value: string): void => {
  const selectOptions = getElementCollection(`[address-id="${id}"] [data-type="${FieldNames.Country}"] option`);
  selectOptions.forEach((element) => {
    const option = element as HTMLOptionElement;
    option.selected = option.value === value;
  });
};

export const toggleFormElementsEditMode = (button: HTMLButtonElement, elements: NodeListOf<Element>): void => {
  const mode = getAddressContainerMode(button);

  elements.forEach((element) => {
    const input = element as HTMLInputElement | HTMLSelectElement;
    if (mode === Mode.View) {
      input.classList.add('profile-element--hidden');
      input.disabled = true;
    } else {
      input.classList.remove('profile-element--hidden');
      input.disabled = false;
    }
  });
};

export const toggleBtnEditMode = (buttonElement: HTMLButtonElement): void => {
  const button = buttonElement;
  const mode = getAddressContainerMode(button);

  if (mode === Mode.Edit) {
    button.classList.add('profile-data-btn--edit-mode');
    button.textContent = 'Save changes';
  } else {
    button.classList.remove('profile-data-btn--edit-mode');
    switch (button.getAttribute('category')) {
      case ProfileDataCategories.Personal:
        button.textContent = ProfileDataBtnsTitles.Personal;
        break;
      case ProfileDataCategories.Contact:
        button.textContent = ProfileDataBtnsTitles.Contact;
        break;
      case ProfileDataCategories.Address:
        button.textContent = ProfileDataBtnsTitles.EditAddress;
        break;
      case ProfileDataCategories.Password:
        button.textContent = ProfileDataBtnsTitles.Password;
        break;
      default:
    }
  }
};

export const toggleAdressDetailsView = (dataContainer: HTMLDivElement): void => {
  const addressID = dataContainer.getAttribute('address-id');

  const addressDescription = getElement(`[address-id="${addressID}"] .address-description-container`);
  const addressCheckboxes = getElement(`[address-id="${addressID}"] .address-checkboxes-container`);

  addressDescription.classList.toggle('visually-hidden');
  addressCheckboxes.classList.toggle('visually-hidden');
};

export const clearInputFields = (inputFields: NodeListOf<Element>): void => {
  inputFields.forEach((element) => {
    const inputField = element as HTMLInputElement;
    inputField.value = '';
  });
};

export const addAddressesValues = async (data: Customer): Promise<void> => {
  const { addresses } = data;

  if (!addresses) {
    return;
  }

  for await (const address of addresses) {
    const { id } = address;

    if (!id) {
      return;
    }

    const addressDataElements = getElementCollection(`[address-id="${id}"] .address-data-item__element`);

    addressDataElements.forEach((element) => {
      const addressDataElement = element as HTMLInputElement | HTMLSelectElement;

      switch (addressDataElement.dataset.type) {
        case FieldNames.Country:
          setValueToCountrySelect(id, getCountryFromCountryCode(address.country));
          break;
        case FieldNames.City:
          addressDataElement.value = address.city || '';
          break;
        case FieldNames.Street:
          addressDataElement.value = address.streetName || '';
          break;
        case FieldNames.PostalCode:
          addressDataElement.value = address.postalCode || '';
          break;
        default:
      }
    });

    setValuesToCheckboxes(data, AddressCategories.Shipping, id);
    setValuesToCheckboxes(data, AddressCategories.Billing, id);
  }
};

export const addPersonalDataValues = async (data: Customer): Promise<void> => {
  const personalDataElements = getElementCollection('.personal-data-item__element');

  personalDataElements.forEach((element) => {
    const personalDataElement = element as HTMLInputElement;
    switch (personalDataElement.dataset.type) {
      case FieldNames.Name:
        personalDataElement.value = data.firstName || '';
        break;
      case FieldNames.Surname:
        personalDataElement.value = data.lastName || '';
        break;
      case FieldNames.Age:
        personalDataElement.value = getDateDMYFormatFromIsoString(data.dateOfBirth || '') || '';
        break;
      default:
    }
  });
};

export const addContactDataValue = async (data: CustomerDraft): Promise<void> => {
  const contactDataElement: HTMLInputElement = getElement('.contact-data-item__element');
  contactDataElement.value = data.email || '';
};

export const renderAddressContainers = (dataAddress: ProfileData[]): void => {
  const container: HTMLElement = getElement('.profile-content__addresses');

  dataAddress.forEach((addressData: ProfileData) => {
    view.renderUserDataContainer(container, ProfileDataCategories.Address, addressData);
  });
};
