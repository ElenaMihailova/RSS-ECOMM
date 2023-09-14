import { createElement } from '../../helpers/functions';
import basketItems from './basketItems';

const basket = (): HTMLElement => {
  const items = createElement({
    tagName: 'div',
    classNames: ['cart__items', 'items', 'container'],
  });

  const itemsElement = basketItems();
  items.appendChild(itemsElement);

  const line = createElement({
    tagName: 'div',
    classNames: ['sum__line'],
    parent: items,
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
