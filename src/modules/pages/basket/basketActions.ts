import { LineItem } from '@commercetools/platform-sdk';
import { PopupMessages } from '../../../types/enums';
import { Action } from '../../../types/types';
import { getActiveCart, removeAllItemsFromCart, removeItemFromCart } from '../../api';
import ApiClientBuilder from '../../api/buildRoot';
import { getFromLS, renderPopup, updateCartCommonQuantity } from '../../helpers/functions';
import { renderCartSumAmount, setBasketEmptyState } from './basketHelpers';

export const clearBasket = async (): Promise<void> => {
  const activeCart = await getActiveCart(ApiClientBuilder.currentRoot);
  const cartID = getFromLS('cartID') as string;
  const cartVersion = Number(getFromLS('cartVersion')) || 1;

  if (activeCart instanceof Error) {
    return;
  }

  const items: Action[] = [];

  activeCart.lineItems.forEach((item) => {
    items.push({
      action: 'removeLineItem',
      lineItemId: item.id,
    });
  });

  await removeAllItemsFromCart(ApiClientBuilder.currentRoot, cartID, cartVersion, items);

  renderPopup(true, PopupMessages.SuccesfullyCartEmptied);
  setBasketEmptyState();
  updateCartCommonQuantity();
};

export const removeBasketItem = async (item: HTMLLIElement, product: LineItem): Promise<boolean> => {
  let isEmptyBasket = false;
  const cartID = getFromLS('cartID') as string;
  const cartVersion = Number(getFromLS('cartVersion')) || 1;
  const productID = product.id;
  const productQuantity = product.quantity;

  const response = await removeItemFromCart(
    ApiClientBuilder.currentRoot,
    cartID,
    cartVersion,
    productID,
    productQuantity,
  );

  if (response instanceof Error) {
    renderPopup(false, response.message);
    return isEmptyBasket;
  }

  renderPopup(true, PopupMessages.SuccesfullyRemovedFromCart);

  if (!response.lineItems.length) {
    setBasketEmptyState();
    updateCartCommonQuantity();
    isEmptyBasket = true;
    return isEmptyBasket;
  }

  const container = item.closest('.buying__list');
  if (container) {
    container.removeChild(item);
  }

  updateCartCommonQuantity(response);
  renderCartSumAmount(response);

  return isEmptyBasket;
};
