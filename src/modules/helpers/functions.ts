import AdressCategories from '../../types/enums';
import { AttrSet, FormItems } from '../../types/interfaces';

export function createElement<K extends keyof HTMLElementTagNameMap>(elData: {
  tagName: K;
  classNames?: string[];
  attributes?: AttrSet[];
  text?: string;
  html?: string;
  parent?: HTMLElement;
}): HTMLElementTagNameMap[K] {
  const { tagName, classNames, attributes, text, parent, html } = elData;

  const element: HTMLElementTagNameMap[K] = document.createElement(tagName);

  if (classNames) {
    classNames.forEach((className) => {
      element.classList.add(className);
    });
  }

  if (attributes) {
    attributes.forEach((attribute) => {
      element.setAttribute(Object.keys(attribute)[0], Object.values(attribute)[0]);
    });
  }

  if (text) {
    element.textContent = text;
  }

  if (html) {
    element.innerHTML = html;
  }

  if (parent) {
    parent.append(element);
  }

  return element;
}

export const getElement = <T extends Element>(selector: string): T => {
  const element = document.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Element for selector "${selector}" is not found`);
  }

  return element;
};

export const getElementCollection = (selector: string): NodeListOf<Element> => {
  const collection = document.querySelectorAll(selector);

  if (!collection) {
    throw new Error(`Elements for selector "${selector}" is not found`);
  }

  return collection;
};

export const createAdressFormItems = (category: AdressCategories): FormItems[] => {
  return [
    {
      tagName: 'select',
      attributes: [{ name: 'country' }],
      classNames: [`${category}-adress__select`, 'select'],
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
      attributes: [{ dataType: 'city' }, { type: 'text' }, { placeholder: 'City' }, { disabled: 'true' }],
      classNames: ['registration-form__input', `${category}-adress__input`, 'input'],
    },
    {
      tagName: 'input',
      attributes: [{ dataType: 'street' }, { type: 'text' }, { placeholder: 'Street' }, { disabled: 'true' }],
      classNames: ['registration-form__input', `${category}-adress__input`, 'input'],
    },
    {
      tagName: 'input',
      attributes: [{ dataType: 'postal-code' }, { type: 'text' }, { placeholder: 'Postal Code' }, { disabled: 'true' }],
      classNames: ['registration-form__input', `${category}-adress__input`, 'input'],
    },
  ];
};
