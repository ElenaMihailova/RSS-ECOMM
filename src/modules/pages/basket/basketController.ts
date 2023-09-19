import { getElement, getFromLS, renderPopup } from '../../helpers/functions';
import Router from '../../router/router';
import clearBasket from './clearBasket';
import { removeItemFromCart, getActiveCart } from '../../api';
import ApiClientBuilder from '../../api/buildRoot';
import { PopupMessages } from '../../../types/enums';

class BasketController {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
    this.runHandlers();
  }

  public runHandlers(): void {
    if (getFromLS('cartID')) {
      this.clearCartBtnHandler();
      this.clearItemHandler();
    }
  }

  private clearCartBtnHandler(): void {
    const clearCartBtn: HTMLButtonElement = getElement('.sum__clear');

    clearCartBtn.addEventListener('click', async () => {
      await clearBasket();
    });
  }

  private clearItemHandler(): void {
    const clearItemButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.buying__button');

    clearItemButtons.forEach((clearItemBtn, index) => {
      clearItemBtn.addEventListener('click', async () => {
        const lineItemId = clearItemBtn.getAttribute('data-line-item-id');
        if (!lineItemId) {
          console.error('Line Item ID not found for button', clearItemBtn);
          return;
        }
        const cartID = getFromLS('cartID') as string;
        const cartVersion = Number(getFromLS('cartVersion')) || 1;
        const activeCart = await getActiveCart(ApiClientBuilder.currentRoot);
        if (activeCart instanceof Error) {
          return;
        }
        const { id } = activeCart.lineItems[index];

        const response = await removeItemFromCart(ApiClientBuilder.currentRoot, cartID, cartVersion, id, 1);

        if ('lineItems' in response) {
          const itemsLeft = response.lineItems.filter((item) => item.id === lineItemId);

          if (itemsLeft.length) {
            return;
          }

          if (response instanceof Error) {
            renderPopup(false, response.message);
            return;
          }

          renderPopup(true, PopupMessages.SuccesfullyRemovedFromCart);
        }
      });
    });
  }
}

export default BasketController;
