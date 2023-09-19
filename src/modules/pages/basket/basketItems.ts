import { Cart } from '@commercetools/platform-sdk';
import { createElement } from '../../helpers/functions';

const counterHandler = (minus: HTMLInputElement, num: HTMLInputElement, plus: HTMLInputElement): void => {
  const number = num;

  minus.addEventListener('click', () => {
    const currentValue = parseInt(number.value, 10);
    if (currentValue > 0) {
      number.value = (currentValue - 1).toString();
    }
  });

  plus.addEventListener('click', () => {
    const currentValue = parseInt(number.value, 10);
    number.value = (currentValue + 1).toString();
  });

  number.addEventListener('input', () => {
    const val = parseInt(number.value, 10);
    if (Number.isNaN(val) || val < 0) {
      number.value = '0';
    }
  });
};

const basketItems = (cart: Cart): HTMLElement => {
  const container = createElement({
    tagName: 'div',
    classNames: ['items__wrap', 'buying'],
  });

  const ul = createElement({
    tagName: 'ul',
    classNames: ['buying__list'],
    parent: container,
  });

  cart.lineItems.forEach((itemData) => {
    const li = createElement({
      tagName: 'li',
      classNames: ['buying__item'],
      parent: ul,
    });

    if (itemData.variant.images) {
      createElement({
        tagName: 'img',
        classNames: ['buying__image'],
        attributes: [{ alt: `${itemData.name.en}` }, { src: `${itemData.variant.images[0].url}` }],
        parent: li,
      });
    }

    const title = createElement({
      tagName: 'h3',
      classNames: ['buying__title'],
      parent: li,
    });

    const name = createElement({
      tagName: 'span',
      classNames: ['buying__name'],
      parent: title,
      text: `${itemData.name['en-US']}`,
    });

    const weight = createElement({
      tagName: 'span',
      classNames: ['buying__weight'],
      parent: title,
      text: '- 50 g',
    });

    const button = createElement({
      tagName: 'button',
      classNames: ['buying__button', 'button', 'button--text'],
      text: 'Remove',
      attributes: [{ 'data-line-item-id': `${itemData.variant.id}` }],
      parent: li,
    });

    const quantity = createElement({
      tagName: 'div',
      classNames: ['buying__quantity'],
      parent: li,
    });

    const minus = createElement({
      tagName: 'input',
      classNames: ['minus'],
      attributes: [{ type: 'button' }, { value: '-' }],
      parent: quantity,
    });

    const number = createElement({
      tagName: 'input',
      classNames: ['quantity'],
      attributes: [{ type: 'text' }, { value: `${itemData.quantity}` }],
      parent: quantity,
    });

    const plus = createElement({
      tagName: 'input',
      classNames: ['plus'],
      attributes: [{ type: 'button' }, { value: '+' }],
      parent: quantity,
    });

    counterHandler(minus, number, plus);

    const sum = createElement({
      tagName: 'p',
      classNames: ['buying__sum'],
      text: `€${itemData.totalPrice.centAmount / 100}`,
      parent: li,
    });
  });

  return container;
};

export default basketItems;
