import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { Cart } from '@commercetools/platform-sdk';
import { getCartData } from '../../api';
import ApiClientBuilder from '../../api/buildRoot';
import { createElement } from '../../helpers/functions';
import basketItems from './basketItems';
import basketSum from './sumBasket';

const basket = async (): Promise<HTMLElement> => {
  const cartID = `501c4fbb-c6cb-44fe-8381-d28757f18f4b`;
  console.log(ApiClientBuilder.currentRoot);
  const cart = await getCartData(ApiClientBuilder.currentRoot, cartID);

  if (!cart) {
    const items = createElement({
      tagName: 'div',
      classNames: ['cart__items', 'items', 'items--empty', 'container'],
    });

    const text = createElement({
      tagName: 'p',
      text: 'Your basket is waiting to be filled.',
      parent: items,
    });

    const subtext = createElement({
      tagName: 'p',
      text: 'Choose the tea that will warm your day!',
      parent: items,
    });
    return items;
  }
  const items = createElement({
    tagName: 'div',
    classNames: ['cart__items', 'items', 'container'],
  });

  const itemsElement = basketItems(cart);
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

  const basketSumElement = basketSum();
  items.appendChild(basketSumElement);

  return items;
};

export default basket;
