import Toastify from 'toastify-js';
import { AttrSet } from '../../types/types';
import { Countries, CountryCodes } from '../../types/enums';

export const createElement = <T extends keyof HTMLElementTagNameMap>(elData: {
  tagName: T;
  classNames?: string[];
  attributes?: AttrSet[];
  text?: string;
  html?: string;
  parent?: HTMLElement;
}): HTMLElementTagNameMap[T] => {
  const { tagName, classNames, attributes, text, parent, html } = elData;

  const element: HTMLElementTagNameMap[T] = document.createElement(tagName);

  if (classNames) {
    classNames.forEach((className: string) => {
      element.classList.add(className);
    });
  }

  if (attributes) {
    attributes.forEach((attribute) => {
      element.setAttribute(Object.keys(attribute)[0], Object.values(attribute)[0]);
    });
  }

  if (text) {
    element.innerText = text;
  }

  if (html) {
    element.innerHTML = html;
  }

  if (parent) {
    parent.append(element);
  }

  return element;
};

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

export const getFromLS = (item: string): string | null => {
  const LSitem: string | null = localStorage.getItem(item);

  if (LSitem) {
    return LSitem;
  }

  return null;
};

export const setToLS = (item: string, value: string): void => {
  localStorage.setItem(item, value);
};

export const removeFromLS = (item: string): void => {
  if (localStorage.getItem(item)) {
    localStorage.removeItem(item);
  }
};

export const clearLS = (): void => {
  localStorage.clear();
};

export const stringifyLS = (item: number[]): string => {
  const stringifiedItem = JSON.stringify(item);
  return stringifiedItem;
};

export const parseLS = (item: string): number[] | null => {
  try {
    return JSON.parse(item);
  } catch (e) {
    return null;
  }
};

export const createSvgElement = (className: string, id: string): string => {
  return `<svg class=${className} width='24' height='24' viewBox='0 0 24 24'><use href="../image/sprite.svg#${id}" /></svg>`;
};

export const renderPopup = (succes: boolean, message: string): void => {
  const className = succes ? 'toastify-succes' : 'toastify-error';

  Toastify({
    text: `${message}`,
    className: `toastify ${className}`,
    duration: 4000,
    newWindow: true,
    close: true,
    gravity: 'bottom',
    position: 'center',
    stopOnFocus: true,
  }).showToast();
};

export const getCountryFromCountryCode = (countryCode: string): string => {
  if (countryCode === CountryCodes.Belarus) {
    return Countries.Belarus;
  }
  if (countryCode === CountryCodes.Spain) {
    return Countries.Spain;
  }
  if (countryCode === CountryCodes.Netherlands) {
    return Countries.Netherlands;
  }

  return '';
};

export const getCountryCode = (value: string): string => {
  if (value === Countries.Belarus) {
    return CountryCodes.Belarus;
  }
  if (value === Countries.Spain) {
    return CountryCodes.Spain;
  }
  if (value === Countries.Netherlands) {
    return CountryCodes.Netherlands;
  }

  return '';
};

export const togglePasswordView = (passwordInput: HTMLInputElement, passwordBtn: HTMLButtonElement): void => {
  const input = passwordInput;
  const btn = passwordBtn;

  const isVisible = input.getAttribute('type') === 'text';

  btn.innerText = isVisible ? 'SHOW' : 'HIDE';
  input.type = isVisible ? 'password' : 'text';
};
