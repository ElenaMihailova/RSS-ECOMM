import { Customer, CustomerChangePassword, CustomerUpdate } from '@commercetools/platform-sdk';
import { UpdateAction } from '@commercetools/sdk-client-v2';
import {
  AddressCategories,
  CheckboxTypes,
  FieldNames,
  InputUserError,
  PasswordTypes,
  PopupMessages,
  ProfileDataCategories,
} from '../../../types/enums';
import { changePassword, getUpdatedCustomer, getUpdatedVersion, updateCustomer } from '../../api';
import { getCountryCode, getElement, getElementCollection, renderPopup, setToLS } from '../../helpers/functions';
import {
  createError,
  getDateFromString,
  getDateISOStringWithoutTime,
  removeError,
} from '../../validation/validationHelpers';
import Validator from '../../validation/validator';
import {
  createPasswordData,
  getAddressID,
  getAuthorisedCustomerID,
  getCurrentCustomerVersion,
  renderErrorResponsePopup,
  renderUpdateSuccesPopup,
} from './profileHelpers';
import { BaseAddress } from '../../../types/interfaces';
import { clearInputFields, rerenderAddressDetails } from './rerenderProfileHelpers';
import ApiClientBuilder from '../../api/buildRoot';

const validator = new Validator();

export const updateCustomerData = async (
  actions: UpdateAction[],
  withoutErrorMessages?: boolean,
): Promise<Customer | null> => {
  const version = getCurrentCustomerVersion();
  const customerID = getAuthorisedCustomerID();

  if (!customerID) {
    return null;
  }

  const updateRequestBody = {
    version,
    actions,
  };

  const response = await updateCustomer(ApiClientBuilder.currentRoot, customerID, updateRequestBody as CustomerUpdate);

  if (response instanceof Error) {
    if (!withoutErrorMessages) {
      renderErrorResponsePopup(ProfileDataCategories.Contact, response);
    }

    return null;
  }

  return response;
};

export const updateAddressCategories = async (addressID: string): Promise<void> => {
  const customerID = getAuthorisedCustomerID();

  if (!customerID) {
    return;
  }

  const data = await getUpdatedCustomer(ApiClientBuilder.currentRoot, customerID);

  const { defaultShippingAddressId, defaultBillingAddressId, shippingAddressIds, billingAddressIds } = data;

  const addressesCategoriesCheckboxes = getElementCollection(`[address-id="${addressID}"] [type="checkbox"]`);

  for await (const element of addressesCategoriesCheckboxes) {
    const checkbox = element as HTMLInputElement;
    const category = checkbox.getAttribute('category');
    const type = checkbox.getAttribute('data-type');

    const existsInShipping = shippingAddressIds?.includes(`${addressID}`);
    const existsInBilling = billingAddressIds?.includes(`${addressID}`);
    const defaultShipping = defaultShippingAddressId === addressID;
    const defaultBilling = defaultBillingAddressId === addressID;

    let id = addressID || undefined;
    let action;

    switch (type) {
      case CheckboxTypes.AddressCategory:
        if (category === AddressCategories.Shipping) {
          if (!checkbox.checked && existsInShipping) {
            action = 'removeShippingAddressId';
          } else if (checkbox.checked && !existsInShipping) {
            action = 'addShippingAddressId';
          }
        }

        if (category === AddressCategories.Billing) {
          if (!checkbox.checked && existsInBilling) {
            action = 'removeBillingAddressId';
          } else if (checkbox.checked && !existsInBilling) {
            action = 'addBillingAddressId';
          }
        }
        break;
      case CheckboxTypes.DefaultAddress:
        if (category === AddressCategories.Shipping) {
          if (checkbox.checked && !defaultShipping) {
            action = 'setDefaultShippingAddress';
          } else if (!checkbox.checked && defaultShipping) {
            action = 'setDefaultShippingAddress';
            id = undefined;
          }
        }
        if (category === AddressCategories.Billing) {
          if (checkbox.checked && !defaultBilling) {
            action = 'setDefaultBillingAddress';
          } else if (!checkbox.checked && defaultBilling) {
            action = 'setDefaultBillingAddress';
            id = undefined;
          }
        }
        break;
      default:
    }
    const actions = [
      {
        action,
        addressId: id,
      },
    ];

    await updateCustomerData(actions as UpdateAction[], true);
    setToLS('version', JSON.stringify(await getUpdatedVersion(ApiClientBuilder.currentRoot, customerID)));
  }
};

export const updateAddressData = async (elements: NodeListOf<Element>, addressID: string): Promise<void> => {
  const customerID = getAuthorisedCustomerID();

  if (!customerID) {
    return;
  }

  const updatedAddress: Partial<BaseAddress> = {};

  elements.forEach((element) => {
    const formElement = element as HTMLInputElement | HTMLSelectElement;

    switch (formElement.dataset.type) {
      case FieldNames.Country:
        updatedAddress.country = getCountryCode(formElement.value);
        break;
      case FieldNames.City:
        updatedAddress.city = formElement.value;
        break;
      case FieldNames.Street:
        updatedAddress.streetName = formElement.value;
        break;
      case FieldNames.PostalCode:
        updatedAddress.postalCode = formElement.value;
        break;
      default:
    }
  });

  const actions = [
    {
      action: 'changeAddress',
      addressId: addressID,
      address: updatedAddress as BaseAddress,
    },
  ];

  const responce = await updateCustomerData(actions);

  if (!responce) {
    return;
  }

  await updateAddressCategories(addressID);
  await rerenderAddressDetails(customerID);
};

export const updatePersonalData = async (formELements: NodeListOf<Element>): Promise<void> => {
  for await (const element of formELements) {
    const personalDataElement = element as HTMLInputElement;

    const customerID = getAuthorisedCustomerID();

    if (!customerID) {
      return;
    }

    const { value } = personalDataElement;

    let actions;

    switch (personalDataElement.dataset.type) {
      case FieldNames.Name:
        actions = [
          {
            action: 'setFirstName',
            firstName: value,
          },
        ];
        break;
      case FieldNames.Surname:
        actions = [
          {
            action: 'setLastName',
            lastName: value,
          },
        ];
        break;
      case FieldNames.Age:
        actions = [
          {
            action: 'setDateOfBirth',
            dateOfBirth: getDateISOStringWithoutTime(getDateFromString(value)),
          },
        ];
        break;
      case FieldNames.Email:
        actions = [
          {
            action: 'changeEmail',
            email: value,
          },
        ];
        break;
      default:
    }

    await updateCustomerData(actions as UpdateAction[]);
    setToLS('version', JSON.stringify(await getUpdatedVersion(ApiClientBuilder.currentRoot, customerID)));
  }
};

export const updateData = async (
  button: HTMLButtonElement,
  category: string,
  formElements: NodeListOf<Element>,
): Promise<void> => {
  const customerID = getAuthorisedCustomerID();

  if (!customerID) {
    return;
  }

  switch (category) {
    case ProfileDataCategories.Personal:
    case ProfileDataCategories.Contact:
      await updatePersonalData(formElements);
      break;
    case ProfileDataCategories.Address:
      await updateAddressData(formElements, getAddressID(button) as string);
      break;
    default:
  }
  setToLS('version', JSON.stringify(await getUpdatedVersion(ApiClientBuilder.currentRoot, customerID)));
};

export const updatePassword = async (
  button: HTMLButtonElement,
  version: number,
  customerID: string,
): Promise<boolean> => {
  const passwordFormElements = getElementCollection(`[data-type="${FieldNames.Password}"]`);

  let succes = false;

  if (!passwordFormElements) {
    return succes;
  }

  const passwordData = createPasswordData(passwordFormElements);

  const NewPasswordInput: HTMLInputElement = getElement(`[password-type="${PasswordTypes.NewPasswordConfirm}"]`);

  removeError(NewPasswordInput);

  if (!validator.isValidProfileData(button, passwordFormElements)) {
    return succes;
  }

  if (passwordData.newPassword !== passwordData.newPasswordRepeat) {
    createError(NewPasswordInput, InputUserError.ConfirmPasswordNoMatch);
    renderPopup(succes, PopupMessages.NewPasswordsNoMatch);
    return succes;
  }

  const customerChangePassword: CustomerChangePassword = {
    id: customerID,
    version,
    currentPassword: passwordData.currentPassword as string,
    newPassword: passwordData.newPassword as string,
  };

  const response = await changePassword(ApiClientBuilder.currentRoot, customerChangePassword);

  if (response instanceof Error) {
    renderErrorResponsePopup(ProfileDataCategories.Password, response);
    return succes;
  }

  renderUpdateSuccesPopup(ProfileDataCategories.Password);
  clearInputFields(passwordFormElements);
  succes = true;

  return succes;
};

export default updatePassword;
