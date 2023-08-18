import { FormItems } from '../../../types/interfaces';

export const commonDataInputItems: FormItems[] = [
  {
    tagName: 'input',
    attributes: [{ 'data-type': 'name' }, { type: 'text' }, { placeholder: 'Name' }, { 'has-icon': 'true' }],
    classNames: ['registration-form__input', 'input'],
    icon: {
      className: 'name-input-icon',
      attributes: [{ position: 'start' }],
    },
  },
  {
    tagName: 'input',
    attributes: [{ 'data-type': 'surname' }, { type: 'text' }, { placeholder: 'Surname' }, { 'has-icon': 'true' }],
    classNames: ['registration-form__input', 'input'],
    icon: {
      className: 'surname-input-icon',
      attributes: [{ position: 'start' }],
    },
  },
  {
    tagName: 'input',
    attributes: [{ 'data-type': 'age' }, { type: 'text' }, { placeholder: 'Date of Birth' }, { 'has-icon': 'true' }],
    classNames: ['registration-form__input', 'input'],
    icon: {
      className: 'age-input-icon',
      attributes: [{ position: 'start' }],
    },
  },
  {
    tagName: 'input',
    attributes: [{ 'data-type': 'email' }, { type: 'text' }, { placeholder: 'Email Adress' }, { 'has-icon': 'true' }],
    classNames: ['registration-form__input', 'input'],
    icon: {
      className: 'email-input-icon',
      attributes: [{ position: 'start' }],
    },
  },
  {
    tagName: 'input',
    attributes: [{ 'data-type': 'password' }, { type: 'password' }, { placeholder: 'Enter your password' }],
    classNames: ['registration-form__input', 'input', 'password-input'],
    icon: {
      className: 'password-input-icon',
      attributes: [{ position: 'end' }],
    },
  },
];

export default commonDataInputItems;
