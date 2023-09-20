import { getElement } from '../../helpers/functions';
import { emptyBasket } from './basket';
import getBasketContent from './basketContent';

export const setBasketEmptyState = (): void => {
  const cartItems: HTMLDivElement = getElement('.cart__items');
  cartItems.innerHTML = '';
  const emptyBasketItems = emptyBasket();
  cartItems.append(emptyBasketItems);
};

export const rerenderBasketData = async (): Promise<void> => {
  const basketData = await getBasketContent();
  const cartItems: HTMLDivElement = getElement('.cart__items');
  cartItems.innerHTML = '';
  cartItems.append(basketData.content);
};
