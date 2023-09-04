import {
  FieldNames,
  InputUserError,
  Mode,
  PasswordTypes,
  PopupMessages,
  ProfileDataCategories,
} from '../../../types/enums';
import { BaseAddress, ChangePasswordData } from '../../../types/interfaces';
import { getCountryCode, getElement, getElementCollection, getFromLS, renderPopup } from '../../helpers/functions';
import { currentWord, emailWord } from '../../validation/regExpVariables';
import { createError } from '../../validation/validationHelpers';

export const getCurrentCustomerVersion = (): number => Number(getFromLS('version'));
export const getAuthorisedCustomerID = (): string | null => getFromLS('userID');

export const getAddressContainerSelector = (element: HTMLElement): string => {
  const addressID = element.closest('.address-data')?.getAttribute('address-id');
  return addressID ? `[address-id="${addressID}"]` : `[mode="${Mode.Create}"]`;
};

export const isAdressCategoryChecked = (addressID?: string): boolean => {
  const containerSelector = addressID ? `[address-id="${addressID}"]` : `[mode="${Mode.Create}"]`;
  return Boolean(document.querySelector(`${containerSelector} [data-type="address-category"]:checked`));
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

export const createPasswordData = (passwordFormElements: NodeListOf<Element>): Partial<ChangePasswordData> => {
  const passwordData: Partial<ChangePasswordData> = {};

  passwordFormElements.forEach((element) => {
    const formElement = element as HTMLInputElement;

    switch (formElement.getAttribute('password-type')) {
      case PasswordTypes.CurrentPassword:
        passwordData.currentPassword = formElement.value;
        break;
      case PasswordTypes.NewPassword:
        passwordData.newPassword = formElement.value;
        break;
      case PasswordTypes.NewPasswordConfirm:
        passwordData.newPasswordRepeat = formElement.value;
        break;
      default:
    }
  });

  return passwordData;
};
