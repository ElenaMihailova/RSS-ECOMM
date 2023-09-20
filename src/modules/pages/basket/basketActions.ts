import { Cart, LineItem } from '@commercetools/platform-sdk';
import { PopupMessages } from '../../../types/enums';
import { getActiveCart, removeAllItemsFromCart, removeCart, removeItemFromCart } from '../../api';
import ApiClientBuilder from '../../api/buildRoot';
import { getFromLS, renderPopup, updateCartCommonQuantity } from '../../helpers/functions';
import { setBasketEmptyState } from './basketHelpers';

export const clearBasket = async (): Promise<void> => {
  const activeCart = await getActiveCart(ApiClientBuilder.currentRoot);
  if (activeCart instanceof Error) {
    return;
  }

  const responce = await removeAllItemsFromCart(ApiClientBuilder.currentRoot, activeCart.id, activeCart.version);

  if (responce instanceof Error) {
    renderPopup(false, responce.message);
    return;
  }

  renderPopup(true, PopupMessages.SuccesfullyCartEmptied);
  setBasketEmptyState();
  updateCartCommonQuantity();
};

export const removeActiveCart = async (cart: Cart): Promise<void> => {
  const cartID = cart.id;
  const cartVersion = cart.version;

  const response = await removeCart(ApiClientBuilder.currentRoot, cartID, cartVersion);

  if (response instanceof Error) {
    return;
  }

  setBasketEmptyState();
  updateCartCommonQuantity();
};

export const removeBasketItem = async (item: HTMLLIElement, product: LineItem): Promise<void> => {
  const cartID = getFromLS('cartID') as string;
  const cartVersion = Number(getFromLS('cartVersion')) || 1;
  const productID = product.id;
  const productQuantity = product.quantity;

  const responce = await removeItemFromCart(
    ApiClientBuilder.currentRoot,
    cartID,
    cartVersion,
    productID,
    productQuantity,
  );

  if (responce instanceof Error) {
    renderPopup(false, responce.message);
    return;
  }

  renderPopup(true, PopupMessages.SuccesfullyRemovedFromCart);

  if (!responce.lineItems.length) {
    await removeActiveCart(responce);
    return;
  }

  const container = item.closest('.buying__list');
  if (container) {
    container.removeChild(item);
  }

  updateCartCommonQuantity(responce);
};
