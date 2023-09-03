import { AttrSet } from '../../types/types';
import Router from '../router/router';

export const createElement = <T extends keyof HTMLElementTagNameMap>(elData: {
  tagName: T;
  classNames?: string[];
  attributes?: AttrSet[];
  text?: string;
  html?: string;
  parent?: HTMLElement;
  parentPrepend?: HTMLElement;
  href?: string;
  router?: Router;
}): HTMLElementTagNameMap[T] => {
  const { tagName, classNames, attributes, text, parent, parentPrepend, html, href, router } = elData;

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

  if (parentPrepend) {
    parentPrepend.prepend(element);
  }

  if (tagName === 'a' && href && router) {
    element.setAttribute('href', href);
    element.addEventListener('click', (e) => {
      e.preventDefault();
      router.navigateToLink(href);
    });
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

type SVGAttributes = {
  [key: string]: string;
};

export const createSvg = <T extends keyof SVGElementTagNameMap>(elData: {
  tagName: T;
  classNames?: string[];
  attributes?: SVGAttributes;
  parent?: SVGElement | HTMLElement;
}): SVGElementTagNameMap[T] => {
  const { tagName, classNames, attributes, parent } = elData;

  const ns = 'http://www.w3.org/2000/svg'; // SVG namespace
  const element: SVGElementTagNameMap[T] = document.createElementNS(ns, tagName);

  if (classNames) {
    element.classList.add(...classNames);
  }

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'xlinkHref') {
        element.setAttributeNS('http://www.w3.org/1999/xlink', 'href', value);
      } else {
        element.setAttributeNS(null, key, value);
      }
    });
  }

  if (parent) {
    parent.append(element);
  }

  return element;
};
