import Toastify from 'toastify-js';
import { Cart } from '@commercetools/platform-sdk';
import { AttrSet } from '../../types/types';
import { Countries, CountryCodes } from '../../types/enums';
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
  src?: string;
  id?: string;
}): HTMLElementTagNameMap[T] => {
  const { tagName, classNames, attributes, text, parent, parentPrepend, html, href, router, src, id } = elData;

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

  if (src && tagName === 'img') {
    element.setAttribute('src', src);
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

  if (id) {
    element.setAttribute('id', id);
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

export const createSvgElement = (className: string, id: string, width: string, height: string): string => {
  return `<svg class=${className} width='${width}' height='${height}' ><use href="../image/sprite.svg#${id}" /></svg>`;
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

  const ns = 'http://www.w3.org/2000/svg';
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

export const setMenuBtnsView = (): void => {
  const user = getFromLS('userID');
  const loginSvg = getElement('.login svg');
  const logoutSvg = getElement('.logout-svg');
  const loginDesktopBtn = getElement('.login--desktop svg:nth-child(1)');
  const loginMobileBtn = getElement('.login--mobile div:nth-child(1)');
  const logoutMobileBtn = getElement('.login--mobile div:nth-child(2)');
  const registrationContainer = getElement('.registration--desktop').closest('li');
  const registrationMobileContainer = getElement('.registration--mobile').closest('a');
  const profileContainer = getElement('.profile--desktop').closest('li');
  const profileMobileContainer = getElement('.profile--mobile').closest('a');
  const tooltip = getElement('.tooltip--login');

  if (user) {
    loginSvg.classList.add('visually-hidden');
    logoutSvg.classList.remove('visually-hidden');
    loginDesktopBtn.classList.add('visually-hidden');
    loginMobileBtn.classList.add('visually-hidden');
    logoutMobileBtn.classList.remove('visually-hidden');
    registrationContainer?.classList.add('visually-hidden');
    registrationMobileContainer?.classList.add('visually-hidden');
    profileMobileContainer?.classList.remove('visually-hidden');
    profileContainer?.classList.remove('visually-hidden');
    tooltip.textContent = 'LOG OUT';
  } else {
    loginSvg.classList.remove('visually-hidden');
    logoutSvg.classList.add('visually-hidden');
    loginMobileBtn.classList.remove('visually-hidden');
    logoutMobileBtn.classList.add('visually-hidden');
    loginDesktopBtn.classList.remove('visually-hidden');
    registrationContainer?.classList.remove('visually-hidden');
    registrationMobileContainer?.classList.remove('visually-hidden');
    profileMobileContainer?.classList.add('visually-hidden');
    profileContainer?.classList.add('visually-hidden');
    tooltip.textContent = 'LOG IN';
  }
};

export const disableQuantityButtons = async (productKey: string): Promise<void> => {
  const minusBtn: HTMLButtonElement = getElement(`[product-key=${productKey}] .minus-button`);
  const plusBtn: HTMLButtonElement = getElement(`[product-key=${productKey}] .plus-button`);
  const quantity: HTMLButtonElement = getElement(`[product-key=${productKey}] .quantity-container__quantity`);

  minusBtn.disabled = true;
  plusBtn.disabled = true;
  quantity.classList.add('disabled-text');
};

export const updateCartCommonQuantity = (cart?: Cart): void => {
  const cartQuantityDesktop: HTMLSpanElement = getElement('.cart-quantity--desktop');
  const cartQuantityMobile: HTMLSpanElement = getElement('.cart-quantity--mobile');

  const commonQuantity = cart
    ? cart.lineItems.reduce((accumulator, currentItem) => accumulator + currentItem.quantity, 0)
    : 0;

  if (!commonQuantity) {
    cartQuantityDesktop.classList.add('visually-hidden');
    return;
  }

  if (cartQuantityDesktop.classList.contains('visually-hidden')) {
    cartQuantityDesktop.classList.remove('visually-hidden');
  }

  cartQuantityDesktop.innerHTML = commonQuantity.toString();

  cartQuantityMobile.innerHTML = commonQuantity.toString();
};

export const clearCartQuantity = (): void => {
  const cartQuantityDesktop: HTMLSpanElement = getElement('.cart-quantity--desktop');
  const cartQuantityMobile: HTMLSpanElement = getElement('.cart-quantity--mobile');

  cartQuantityDesktop.classList.add('visually-hidden');
  cartQuantityMobile.classList.add('visually-hidden');
};

export const calculateTotalAmount = (subtotal: number, delivery: number): number => subtotal + delivery;

export const convertCentsToEuros = (centAmount: number): number => centAmount / 100;

export const getEuroCurrencyString = (amount: number): string => `€${amount}`;

export const renderModal = (): HTMLElement => {
  const modal = createElement({
    tagName: 'div',
    classNames: ['maintenance-modal'],
    parent: document.body,
  });

  createElement({
    tagName: 'div',
    classNames: ['modal-content'],
    text: 'В последний момент внезапно возникла проблема с токенами, большая просьба дать день на ремонт (:',
    parent: modal,
  });

  return modal;
};
