import {
  FieldNames,
  Mode,
  PasswordTypes,
  ProfileDataBtnsTitles,
  ProfileDataContainersTitles,
  ProfileFormELementsLabels,
} from '../../../types/enums';
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
    label: ProfileFormELementsLabels.Name,
    element: {
      tagName: 'input',
      attributes: [{ 'data-type': FieldNames.Name }, { type: 'text' }],
      classNames: personalDataInputClassNames,
    },
  },
  {
    label: ProfileFormELementsLabels.Surname,
    element: {
      tagName: 'input',
      attributes: [{ 'data-type': FieldNames.Surname }, { type: 'text' }],
      classNames: personalDataInputClassNames,
    },
  },
  {
    label: ProfileFormELementsLabels.DateOfBirth,
    element: {
      tagName: 'input',
      attributes: [{ 'data-type': FieldNames.Age }, { type: 'text' }],
      classNames: personalDataInputClassNames,
    },
  },
];

export const personalData: ProfileData = {
  title: ProfileDataContainersTitles.Personal,
  buttonEdit: ProfileDataBtnsTitles.Personal,
  dataItems: personalDataItems,
};

export const contactDataItems: ProfileDataItem[] = [
  {
    label: ProfileFormELementsLabels.Email,
    element: {
      tagName: 'input',
      attributes: [{ 'data-type': FieldNames.Email }, { type: 'text' }],
      classNames: contactDataInputClassNames,
    },
  },
];

export const contactData: ProfileData = {
  title: ProfileDataContainersTitles.Contact,
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
    label: ProfileFormELementsLabels.Country,
    element: {
      tagName: 'select',
      attributes: [{ 'data-type': FieldNames.Country }, { name: 'country' }],
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
    label: ProfileFormELementsLabels.City,
    element: {
      tagName: 'input',
      attributes: [{ 'data-type': FieldNames.City }, { type: 'text' }],
      classNames: addressDataInputClassNames,
    },
  };

  const street: ProfileDataItem = {
    label: ProfileFormELementsLabels.Street,
    element: {
      tagName: 'input',
      attributes: [{ 'data-type': FieldNames.Street }, { type: 'text' }],
      classNames: addressDataInputClassNames,
    },
  };

  const postalCode: ProfileDataItem = {
    label: ProfileFormELementsLabels.PostalCode,
    element: {
      tagName: 'input',
      attributes: [{ 'data-type': FieldNames.PostalCode }, { type: 'text' }],
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
    shippingAddress: addressID ? (shippingAddressIds?.includes(addressID) as boolean) : false,
    billingAddress: addressID ? (billingAddressIds?.includes(addressID) as boolean) : false,
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
    label: ProfileFormELementsLabels.CurrentPassword,
    element: {
      tagName: 'input',
      attributes: [
        { 'data-type': FieldNames.Password },
        { type: 'password' },
        { 'password-type': PasswordTypes.CurrentPassword },
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
  {
    label: ProfileFormELementsLabels.NewPassword,
    element: {
      tagName: 'input',
      attributes: [
        { 'data-type': FieldNames.Password },
        { type: 'password' },
        { 'password-type': PasswordTypes.NewPassword },
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
  {
    label: ProfileFormELementsLabels.NewPasswordConfirm,
    element: {
      tagName: 'input',
      attributes: [
        { 'data-type': FieldNames.Password },
        { type: 'password' },
        { 'password-type': PasswordTypes.NewPasswordConfirm },
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
  title: ProfileDataContainersTitles.Password,
  buttonSave: ProfileDataBtnsTitles.Password,
  dataItems: passwordDataItems,
};
