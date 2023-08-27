import { ProfileDataBtns } from '../../../types/enums';
import { ProfileData, ProfileDataItem } from '../../../types/interfaces';

export const personalDataItems: ProfileDataItem[] = [
  {
    label: 'Name',
    input: {
      tagName: 'input',
      attributes: [{ 'data-type': 'name' }, { type: 'text' }],
      classNames: ['profile-data-item__input', 'input'],
    },
  },
  {
    label: 'Surname',
    input: {
      tagName: 'input',
      attributes: [{ 'data-type': 'surname' }, { type: 'text' }],
      classNames: ['profile-input', 'personal-data-item__input', 'input'],
    },
  },
  {
    label: 'Age',
    input: {
      tagName: 'input',
      attributes: [{ 'data-type': 'age' }, { type: 'text' }],
      classNames: ['profile-data-item__input', 'input'],
    },
  },
];

export const personalData: ProfileData = {
  title: ProfileDataBtns.Personal,
  button: 'Change personal data',
  dataItems: personalDataItems,
};

export const contactDataItems: ProfileDataItem[] = [
  {
    label: 'Email-adress',
    input: {
      tagName: 'input',
      attributes: [{ 'data-type': 'email' }, { type: 'text' }],
      classNames: ['profile-data-item__input', 'input'],
    },
  },
];

export const contactData: ProfileData = {
  title: ProfileDataBtns.Contact,
  button: 'Change contact information',
  dataItems: contactDataItems,
};

export const passwordData: ProfileData = {
  title: ProfileDataBtns.Password,
  button: 'Change password',
};
