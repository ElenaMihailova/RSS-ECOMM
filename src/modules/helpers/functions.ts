import { AttrSet } from '../../types/types';

export function createElement<T extends keyof HTMLElementTagNameMap>(elData: {
  tagName: T;
  classNames?: string[];
  attributes?: AttrSet[];
  text?: string;
  html?: string;
  parent?: HTMLElement;
}): HTMLElementTagNameMap[T] {
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
}

export function createSvgElement(className: string, id: string, w?: string, h?: string, v?: string): string {
  return `<svg class=${className} width=${w} height=${h} viewBox=${v}><use href="./image/sprite.svg#${id}" /></svg>`;
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

export function getFromLS(item: string): string | null {
  const LSitem: string | null = localStorage.getItem(item);
  if (LSitem) {
    return LSitem;
  }
  return null;
}

export function setToLS(item: string, value: string): void {
  localStorage.setItem(item, value);
}

export function removeFromLS(item: string): void {
  if (localStorage.getItem(item)) {
    localStorage.removeItem(item);
  }
}

export function clearLS(): void {
  localStorage.clear();
}

export function stringifyLS(item: number[]): string {
  const stringifiedItem = JSON.stringify(item);
  return stringifiedItem;
}

export function parseLS(item: string): number[] | null {
  try {
    return JSON.parse(item);
  } catch (e) {
    return null;
  }
}
