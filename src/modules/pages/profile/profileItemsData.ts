import { ProfileDataBtns, ProfileInputLabels } from '../../../types/enums';
import { ProfileData, ProfileDataItem } from '../../../types/interfaces';

export const personalDataItems: ProfileDataItem[] = [
  {
    label: ProfileInputLabels.Name,
    input: {
      tagName: 'input',
      attributes: [{ 'data-type': 'name' }, { type: 'text' }],
      classNames: ['profile-data-item__input', 'input'],
    },
  },
  {
    label: ProfileInputLabels.Surname,
    input: {
      tagName: 'input',
      attributes: [{ 'data-type': 'surname' }, { type: 'text' }],
      classNames: ['profile-input', 'personal-data-item__input', 'input'],
    },
  },
  {
    label: ProfileInputLabels.DateOfBirth,
    input: {
      tagName: 'input',
      attributes: [{ 'data-type': 'age' }, { type: 'text' }],
      classNames: ['profile-data-item__input', 'input'],
    },
  },
];

export const personalData: ProfileData = {
  title: 'Personal data',
  button: ProfileDataBtns.Personal,
  dataItems: personalDataItems,
};

export const contactDataItems: ProfileDataItem[] = [
  {
    label: ProfileInputLabels.Email,
    input: {
      tagName: 'input',
      attributes: [{ 'data-type': 'email' }, { type: 'text' }],
      classNames: ['profile-data-item__input', 'input'],
    },
  },
];

export const contactData: ProfileData = {
  title: 'Contact information',
  button: ProfileDataBtns.Contact,
  dataItems: contactDataItems,
};

export const passwordData: ProfileData = {
  title: 'Password',
  button: ProfileDataBtns.Password,
};
