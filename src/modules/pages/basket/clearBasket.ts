import { getActiveCart, removeAllItemsFromCart, removeItemFromCart } from '../../api';
import ApiClientBuilder from '../../api/buildRoot';
import { getElement, renderPopup, updateCartCommonQuantity } from '../../helpers/functions';
import { emptyBasket } from './basket';
import { PopupMessages } from '../../../types/enums';

const clearBasket = async (): Promise<void> => {
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

  const cartItems: HTMLDivElement = getElement('.cart__items');
  cartItems.innerHTML = '';
  const emptyBasketItems = emptyBasket();
  cartItems.append(emptyBasketItems);

  updateCartCommonQuantity();
};

export default clearBasket;
