import { FormItems } from '../../../types/interfaces';

export const commonDataInputItems: FormItems[] = [
  {
    tagName: 'input',
    attributes: [{ 'data-type': 'name' }, { type: 'text' }, { placeholder: 'Name' }, { 'has-icon': 'true' }],
    classNames: ['registration-form__input', 'input'],
    icon: {
      containerClassName: 'name-input-icon',
      attributes: [{ position: 'start' }],
      className: 'name',
      id: 'registration-person',
    },
  },
  {
    tagName: 'input',
    attributes: [{ 'data-type': 'surname' }, { type: 'text' }, { placeholder: 'Surname' }, { 'has-icon': 'true' }],
    classNames: ['registration-form__input', 'input'],
    icon: {
      containerClassName: 'surname-input-icon',
      attributes: [{ position: 'start' }],
      className: 'surname',
      id: 'registration-person',
    },
  },
  {
    tagName: 'input',
    attributes: [{ 'data-type': 'age' }, { type: 'text' }, { placeholder: 'Date of Birth' }, { 'has-icon': 'true' }],
    classNames: ['registration-form__input', 'input'],
    icon: {
      containerClassName: 'age-input-icon',
      attributes: [{ position: 'start' }],
      className: 'age',
      id: 'date',
    },
  },
  {
    tagName: 'input',
    attributes: [{ 'data-type': 'email' }, { type: 'text' }, { placeholder: 'Email Adress' }, { 'has-icon': 'true' }],
    classNames: ['registration-form__input', 'input'],
    icon: {
      containerClassName: 'email-input-icon',
      attributes: [{ position: 'start' }],
      className: 'email',
      id: 'login-email-icon',
    },
  },
  {
    tagName: 'input',
    attributes: [
      { 'data-type': 'password' },
      { type: 'password' },
      { placeholder: 'Enter your password' },
      { 'has-icon': 'true' },
      { 'has-btn': 'true' },
    ],
    classNames: ['registration-form__input', 'input', 'password-input'],
    icon: {
      containerClassName: 'password-input-icon',
      attributes: [{ position: 'start' }],
      className: 'password',
      id: 'login-password-icon',
    },
    btn: {
      className: 'password-input-btn',
      attributes: [{ type: 'button' }],
      text: 'SHOW',
    },
  },
];

export default commonDataInputItems;
