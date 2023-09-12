import { createElement } from '../../helpers/functions';

const basket = (): HTMLElement => {
  const items = createElement({
    tagName: 'div',
    classNames: ['cart__items'],
  });

  const wrapItem = createElement({
    tagName: 'div',
    classNames: ['sum__wrap', 'titleMonserrat--medium'],
    parent: items,
  });

  const subtotalItem = createElement({
    tagName: 'p',
    classNames: ['sum__subtotal', 'titleMonserrat--medium'],
    html: 'Subtotal',
    parent: wrapItem,
  });

  const amountItem = createElement({
    tagName: 'p',
    classNames: ['sum__amount'],
    html: `€3.90`,
    parent: wrapItem,
  });

  const buttonItem = createElement({
    tagName: 'a',
    classNames: ['sum__link', 'button'],
    text: 'Back to shopping',
    attributes: [{ href: 'catalog' }],
    parent: items,
  });

  return items;
};

export default basket;
