import Toastify from 'toastify-js';
import { AttrSet, CoockieOptions } from '../../types/types';

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
  return `<svg class=${className} width='24' height='24' viewBox='0 0 24 24'><use href="./image/sprite.svg#${id}" /></svg>`;
};

export const setCookie = (name: string, value: string, options?: CoockieOptions): void => {
  const cookieOptions = options || {};

  let { expires } = cookieOptions;

  if (typeof expires === 'number' && expires) {
    const d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    // eslint-disable-next-line no-multi-assign
    expires = cookieOptions.expires = d;
  }
  if (expires && (<Date>expires).toUTCString) {
    cookieOptions.expires = (<Date>expires).toUTCString();
  }

  const cookieValue = encodeURIComponent(value);

  let updatedCookie = `${name}=${cookieValue}`;

  let propName: keyof CoockieOptions;

  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (propName in cookieOptions) {
    updatedCookie += `; ${propName}`;
    const propValue = cookieOptions[propName];
    if (propValue !== true) {
      updatedCookie += `=${propValue}`;
    }
  }

  document.cookie = updatedCookie;
};

export const getCookie = (name: string): string | undefined => {
  const matches = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/([\\.$?*|{}\\(\\)\\[\]\\\\/\\+^])/g, '\\$1')}=([^;]*)`),
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
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
