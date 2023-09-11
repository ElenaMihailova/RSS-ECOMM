import { createElement, createSvg } from '../helpers/functions';

const createPaymentItemWithSVG = (list: HTMLElement, iconName: string): void => {
  const item = createElement({
    tagName: 'li',
    classNames: ['payment__item'],
    parent: list,
  });

  const svg = createSvg({
    tagName: 'svg',
    attributes: {
      width: '48',
      height: '32',
      viewBox: '0 0 48 32',
      'aria-hidden': 'true',
    },
    parent: item,
  });

  createSvg({
    tagName: 'use',
    attributes: { xlinkHref: `../image/sprite.svg#${iconName}` },
    parent: svg,
  });
};

const payment = (): HTMLElement => {
  const container = createElement({
    tagName: 'section',
    classNames: ['payment', 'container'],
  });

  createElement({
    tagName: 'h2',
    classNames: ['payment__title'],
    parent: container,
    html: 'Payment type',
  });

  const list = createElement({
    tagName: 'ul',
    classNames: ['payment__list'],
    parent: container,
  });

  createPaymentItemWithSVG(list, 'visa');
  createPaymentItemWithSVG(list, 'mastercard');
  createPaymentItemWithSVG(list, 'mastercard-dark');
  createPaymentItemWithSVG(list, 'deal');
  createPaymentItemWithSVG(list, 'payment');

  return container;
};

export default payment;
