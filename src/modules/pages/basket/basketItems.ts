import { Cart } from '@commercetools/platform-sdk';
import { createElement } from '../../helpers/functions';

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

  cart.lineItems.forEach((itemData, index) => {
    const li = createElement({
      tagName: 'li',
      classNames: ['buying__item'],
      attributes: [{ id: `${itemData.id}` }],
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

    createElement({
      tagName: 'span',
      classNames: ['buying__name'],
      parent: title,
      text: `${itemData.name['en-US']}`,
    });

    createElement({
      tagName: 'span',
      classNames: ['buying__weight'],
      parent: title,
      text: '- 50 g',
    });

    createElement({
      tagName: 'button',
      classNames: ['buying__button', 'button', 'button--text'],
      text: 'Remove',
      parent: li,
    });

    const quantity = createElement({
      tagName: 'div',
      classNames: ['buying__quantity'],
      parent: li,
    });

    createElement({
      tagName: 'input',
      classNames: ['minus'],
      attributes: [{ type: 'button' }, { value: '-' }],
      parent: quantity,
    });

    createElement({
      tagName: 'div',
      classNames: ['quantity'],
      text: `${itemData.quantity}`,
      parent: quantity,
    });

    createElement({
      tagName: 'input',
      classNames: ['plus'],
      attributes: [{ type: 'button' }, { value: '+' }],
      parent: quantity,
    });

    createElement({
      tagName: 'p',
      classNames: ['buying__sum'],
      text: `€${itemData.totalPrice.centAmount / 100}`,
      parent: li,
    });
  });

  return container;
};

export default basketItems;
