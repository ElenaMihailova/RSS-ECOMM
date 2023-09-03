import { Mode, ProfileDataBtnsTitles, ProfileDataContainersTitles, ProfileInputLabels } from '../../../types/enums';
import { AddressDetails, ProfileData, ProfileDataItem } from '../../../types/interfaces';
import { ProfileAddressData } from '../../../types/types';
import { getUpdatedCustomer } from '../../api/apiClient';

const personalDataInputClassNames = [
  'personal-data-item__element',
  'profile-element',
  'input',
  'profile-element--hidden',
];
const contactDataInputClassNames = [
  'contact-data-item__element',
  'profile-element',
  'input',
  'profile-element--hidden',
];
const passwordInputClassNames = ['password-data-item__element', 'profile-element', 'password-input', 'input'];

export const personalDataItems: ProfileDataItem[] = [
  {
    label: ProfileInputLabels.Name,
    element: {
      tagName: 'input',
      attributes: [{ 'data-type': 'name' }, { type: 'text' }],
      classNames: personalDataInputClassNames,
    },
  },
  {
    label: ProfileInputLabels.Surname,
    element: {
      tagName: 'input',
      attributes: [{ 'data-type': 'surname' }, { type: 'text' }],
      classNames: personalDataInputClassNames,
    },
  },
  {
    label: ProfileInputLabels.DateOfBirth,
    element: {
      tagName: 'input',
      attributes: [{ 'data-type': 'age' }, { type: 'text' }],
      classNames: personalDataInputClassNames,
    },
  },
];

export const personalData: ProfileData = {
  title: 'Personal data',
  buttonEdit: ProfileDataBtnsTitles.Personal,
  dataItems: personalDataItems,
};

export const contactDataItems: ProfileDataItem[] = [
  {
    label: ProfileInputLabels.Email,
    element: {
      tagName: 'input',
      attributes: [{ 'data-type': 'email' }, { type: 'text' }],
      classNames: contactDataInputClassNames,
    },
  },
];

export const contactData: ProfileData = {
  title: 'Contact information',
  buttonEdit: ProfileDataBtnsTitles.Contact,
  dataItems: contactDataItems,
};

export const createAddressDataItems = (mode: string): ProfileDataItem[] => {
  const dataItemSelectClassNames: string[] = ['address-data-item__element', `address-select`, 'select'];
  const addressDataInputClassNames = ['address-data-item__element', 'profile-element', 'input'];

  if (mode === Mode.View) {
    dataItemSelectClassNames.push('profile-element--hidden');
    addressDataInputClassNames.push('profile-element--hidden');
  } else if (mode === Mode.Create) {
    dataItemSelectClassNames.push('profile-element--create-mode');
    addressDataInputClassNames.push('profile-element--create-mode');
  }

  const country: ProfileDataItem = {
    label: 'Country',
    element: {
      tagName: 'select',
      attributes: [{ 'data-type': 'country' }, { name: 'country' }],
      classNames: dataItemSelectClassNames,
      options: [
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
  };

  const city: ProfileDataItem = {
    label: 'City',
    element: {
      tagName: 'input',
      attributes: [{ 'data-type': 'city' }, { type: 'text' }],
      classNames: addressDataInputClassNames,
    },
  };

  const street: ProfileDataItem = {
    label: 'Street',
    element: {
      tagName: 'input',
      attributes: [{ 'data-type': 'street' }, { type: 'text' }],
      classNames: addressDataInputClassNames,
    },
  };

  const postalCode: ProfileDataItem = {
    label: 'Postal Code',
    element: {
      tagName: 'input',
      attributes: [{ 'data-type': 'postal-code' }, { type: 'text' }],
      classNames: addressDataInputClassNames,
    },
  };

  const addressDataItems = [country, city, street, postalCode];

  return addressDataItems;
};

export const createAddressDetails = async (customerID: string, addressID?: string): Promise<AddressDetails> => {
  const data = await getUpdatedCustomer(customerID);
  const { defaultBillingAddressId, defaultShippingAddressId, shippingAddressIds, billingAddressIds } = data;
  const details: AddressDetails = {
    shippingAddress: addressID ? Boolean(shippingAddressIds?.includes(addressID)) : false,
    billingAddress: addressID ? Boolean(billingAddressIds?.includes(addressID)) : false,
    isDefaultShippingAddress: addressID ? addressID === defaultShippingAddressId : false,
    isDefaultBillingAddress: addressID ? addressID === defaultBillingAddressId : false,
  };

  return details;
};

export const createAddressData = async (mode: string, customerID: string, addressID?: string): Promise<ProfileData> => {
  const dataTitle =
    mode === Mode.View ? ProfileDataContainersTitles.SavedAddress : ProfileDataContainersTitles.NewAddress;

  const addressData: Partial<ProfileData> = {
    title: dataTitle,
    dataItems: createAddressDataItems(mode),
  };

  if (Mode.View && addressID) {
    addressData.id = addressID;
    addressData.addressDetails = await createAddressDetails(customerID, addressID);
    addressData.buttonEdit = ProfileDataBtnsTitles.EditAddress;
    addressData.buttonRemove = ProfileDataBtnsTitles.RemoveAddress;
  } else {
    addressData.addressDetails = await createAddressDetails(customerID);
    addressData.buttonSave = ProfileDataBtnsTitles.SaveAddress;
  }

  return addressData;
};

export const createAddressesData = async (customerID: string): Promise<ProfileAddressData | []> => {
  const data = await getUpdatedCustomer(customerID);
  const { addresses } = data;
  const addressesData: ProfileAddressData = [];

  if (!addresses) {
    return addressesData;
  }

  // eslint-disable-next-line no-restricted-syntax
  for await (const address of addresses) {
    const addressID = address.id;
    const addressData = await createAddressData(Mode.View, customerID, addressID);

    addressesData.push(addressData);
  }

  return addressesData;
};

export const createNewAddress = async (customerID: string): Promise<ProfileAddressData | []> => {
  const addressesData: ProfileAddressData = [];

  const addressData = await createAddressData(Mode.Create, customerID);

  addressesData.push(addressData);

  return addressesData;
};

export const passwordDataItems: ProfileDataItem[] = [
  {
    label: 'Enter your old password',
    element: {
      tagName: 'input',
      attributes: [{ 'data-type': 'password' }, { type: 'text' }, { 'password-type': 'old' }, { 'has-btn': 'true' }],
      classNames: passwordInputClassNames,
      btn: {
        className: 'password-input-btn',
        attributes: [{ type: 'button' }],
        text: 'SHOW',
      },
    },
  },
  {
    label: 'Enter your new password',
    element: {
      tagName: 'input',
      attributes: [{ 'data-type': 'password' }, { type: 'text' }, { 'password-type': 'new' }, { 'has-btn': 'true' }],
      classNames: passwordInputClassNames,
      btn: {
        className: 'password-input-btn',
        attributes: [{ type: 'button' }],
        text: 'SHOW',
      },
    },
  },
  {
    label: 'Repeat your new password',
    element: {
      tagName: 'input',
      attributes: [
        { 'data-type': 'password' },
        { type: 'text' },
        { 'password-type': 'repeat-new' },
        { 'has-btn': 'true' },
      ],
      classNames: passwordInputClassNames,
      btn: {
        className: 'password-input-btn',
        attributes: [{ type: 'button' }],
        text: 'SHOW',
      },
    },
  },
];

export const passwordData: ProfileData = {
  title: 'Password',
  buttonEdit: ProfileDataBtnsTitles.Password,
  dataItems: passwordDataItems,
};
