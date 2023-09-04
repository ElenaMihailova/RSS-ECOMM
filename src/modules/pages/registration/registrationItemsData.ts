import { AddressCategories } from '../../../types/enums';
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
    attributes: [{ 'data-type': 'email' }, { type: 'text' }, { placeholder: 'Email Address' }, { 'has-icon': 'true' }],
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

export const createAddressFormItems = (category: AddressCategories): FormItems[] => {
  return [
    {
      tagName: 'select',
      attributes: [{ 'data-type': 'country' }, { name: 'country' }, { category: `${category}` }],
      classNames: [`${category}-address__select`, 'select'],
      options: [
        {
          text: 'Select your country',
          attributes: [{ value: '' }, { selected: 'true' }, { disabled: 'true' }],
        },
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
    {
      tagName: 'input',
      attributes: [
        { 'data-type': 'city' },
        { category: `${category}` },
        { type: 'text' },
        { placeholder: 'City' },
        { disabled: 'true' },
      ],
      classNames: ['registration-form__input', `${category}-address__input`, 'input'],
    },
    {
      tagName: 'input',
      attributes: [
        { 'data-type': 'street' },
        { category: `${category}` },
        { type: 'text' },
        { placeholder: 'Street' },
        { disabled: 'true' },
      ],
      classNames: ['registration-form__input', `${category}-address__input`, 'input'],
    },
    {
      tagName: 'input',
      attributes: [
        { 'data-type': 'postal-code' },
        { category: `${category}` },
        { type: 'text' },
        { placeholder: 'Postal Code' },
        { disabled: 'true' },
      ],
      classNames: ['registration-form__input', `${category}-address__input`, 'input'],
    },
  ];
};

export default commonDataInputItems;
