import {
  FieldNames,
  InputUserError,
  Mode,
  PasswordTypes,
  PopupMessages,
  ProfileDataBtns,
  ProfileDataBtnsTitles,
  ProfileDataCategories,
} from '../../../types/enums';
import { BaseAddress } from '../../../types/interfaces';
import { getCountryCode, getElement, getElementCollection, renderPopup } from '../../helpers/functions';
import { currentWord, emailWord } from '../../validation/regExpVariables';
import { createError } from '../../validation/validationHelpers';

export const getAddressContainerSelector = (element: HTMLElement): string => {
  const addressID = element.closest('.address-data')?.getAttribute('address-id');
  return addressID ? `[address-id="${addressID}"]` : `[mode="${Mode.Create}"]`;
};

export const isAdressCategoryChecked = (addressID?: string): boolean => {
  const containerSelector = addressID ? `[address-id="${addressID}"]` : `[mode="${Mode.Create}"]`;
  return Boolean(document.querySelector(`${containerSelector} [data-type="address-category"]:checked`));
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
      defaultAddressLabel?.classList.add('hidden');
    } else {
      defaultAddressLabel?.classList.remove('hidden');
    }
  }
};

export const toggleAddressButtonsDisable = (mode: string): void => {
  const profileDataBtns = getElementCollection('.profile-data-btn');

  profileDataBtns.forEach((element) => {
    const button = element as HTMLButtonElement;
    if (mode === Mode.Create && button.getAttribute('type') !== ProfileDataBtns.Save) {
      button.disabled = true;
    } else {
      button.disabled = false;
    }
  });

  const addAddressBtn: HTMLButtonElement = getElement(`.profile-content [type="${ProfileDataBtns.Add}"]`);
  addAddressBtn.disabled = mode === Mode.Create;
};

export const setNewContainerTitle = (containerSelector: string, newTitle: string): void => {
  const title: HTMLSpanElement = getElement(`${containerSelector} [type="${ProfileDataBtns.Save}"]`);
  title.innerText = newTitle;
};

export const getFormElements = (element: HTMLElement, category: string): NodeListOf<Element> | null => {
  switch (category) {
    case ProfileDataCategories.Personal:
    case ProfileDataCategories.Contact:
      return getElementCollection(`.${category}-data-item__element`);
      break;
    case ProfileDataCategories.Address:
      return getElementCollection(`${getAddressContainerSelector(element)} .${category}-data-item__element`);
      break;
    default:
  }
  return null;
};

export const getAddressID = (element: HTMLElement): string | null => {
  return element.closest('.address-data')?.getAttribute('address-id') || null;
};

export const getAddressContainerMode = (element: HTMLElement): string | null => {
  return element.closest('.profile-data')?.getAttribute('mode') || null;
};

export const createNewBaseAdress = (formELements: NodeListOf<Element>): BaseAddress => {
  const baseAddress: Partial<BaseAddress> = {};

  formELements.forEach((element) => {
    const addressDataElement = element as HTMLInputElement | HTMLSelectElement;
    const countryCode = getCountryCode(addressDataElement.value);

    switch (addressDataElement.getAttribute('data-type')) {
      case FieldNames.Country:
        if (countryCode) {
          baseAddress.country = countryCode;
        }
        break;
      case FieldNames.City:
        baseAddress.city = addressDataElement.value;
        break;
      case FieldNames.Street:
        baseAddress.streetName = addressDataElement.value;
        break;
      case FieldNames.PostalCode:
        baseAddress.postalCode = addressDataElement.value;
        break;
      default:
    }
  });

  return baseAddress as BaseAddress;
};

export const setValueToCountrySelect = (id: string, value: string): void => {
  const selectOptions = getElementCollection(`[address-id="${id}"] [data-type="${FieldNames.Country}"] option`);
  selectOptions.forEach((element) => {
    const option = element as HTMLOptionElement;
    option.selected = Boolean(option.value === value);
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

  addressDescription.classList.toggle('hidden');
  addressCheckboxes.classList.toggle('hidden');
};

export const clearInputFields = (inputFields: NodeListOf<Element>): void => {
  inputFields.forEach((element) => {
    const inputField = element as HTMLInputElement;
    inputField.value = '';
  });
};

export const renderUpdateSuccesPopup = (category: string): void => {
  switch (category) {
    case ProfileDataCategories.Personal:
      renderPopup(true, PopupMessages.PersonalDataUpdated);
      break;
    case ProfileDataCategories.Contact:
      renderPopup(true, PopupMessages.ContactDataUpdated);
      break;
    case ProfileDataCategories.Address:
      renderPopup(true, PopupMessages.AddressDataUpdated);
      break;
    case ProfileDataCategories.Password:
      renderPopup(true, PopupMessages.PasswordChanged);
      break;
    default:
  }
};

export const renderErrorResponsePopup = (category: string, response: Error): void => {
  const errorMessage = `${response.message}`;

  if (errorMessage.match(emailWord) && category === ProfileDataCategories.Contact) {
    const inputErrorMessage = InputUserError.ExistingEmailError;
    const emailIputElement: HTMLInputElement = getElement(`[data-type="${FieldNames.Email}"]`);
    createError(emailIputElement, inputErrorMessage);
    return;
  }

  if (errorMessage.match(currentWord) && category === ProfileDataCategories.Password) {
    const currentPasswordInput: HTMLInputElement = getElement(`[password-type="${PasswordTypes.CurrentPassword}"]`);
    createError(currentPasswordInput, errorMessage);
  }

  renderPopup(false, errorMessage);
};
