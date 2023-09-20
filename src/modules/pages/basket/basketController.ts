import { getElement, getFromLS, renderPopup, updateCartCommonQuantity } from '../../helpers/functions';
import Router from '../../router/router';
import clearBasket from './clearBasket';
import { removeItemFromCart, getActiveCart, addCartItem } from '../../api';
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
      this.modifyQuantity();
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

  private async modifyQuantity(): Promise<void> {
    const minusBtns: NodeListOf<HTMLInputElement> = document.querySelectorAll('.minus');
    const plusBtns: NodeListOf<HTMLInputElement> = document.querySelectorAll('.plus');

    minusBtns.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const parent = btn.closest('.buying__item');
        const amount = parent!.querySelector('.quantity') as HTMLDivElement;
        const sum = parent!.querySelector('.buying__sum') as HTMLParagraphElement;
        const id = btn.closest('.buying__item')?.id;
        const cartID = getFromLS('cartID') as string;
        const cartVersion = Number(getFromLS('cartVersion')) || 1;
        const deleteAmount = 1;
        const currentAmount = Number(amount.textContent);

        if (currentAmount === 1) {
          btn.setAttribute('disable', 'disable');
          return;
        }

        let response = null;

        if (id) {
          response = await removeItemFromCart(ApiClientBuilder.currentRoot, cartID, cartVersion, id, deleteAmount);
        }

        if (!(response instanceof Error) && response !== null) {
          updateCartCommonQuantity(response);
          const product = response.lineItems.filter((item) => item.id === id);
          sum.textContent = `€${product[0].totalPrice.centAmount / 100}`;
        }

        amount.textContent = (currentAmount - 1).toString();
      });
    });

    plusBtns.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const parent = btn.closest('.buying__item');
        const amount = parent!.querySelector('.quantity') as HTMLDivElement;
        const sum = parent!.querySelector('.buying__sum') as HTMLParagraphElement;
        const id = btn.closest('.buying__item')?.id;
        const cartID = getFromLS('cartID') as string;
        const cartVersion = Number(getFromLS('cartVersion')) || 1;
        const addAmount = 1;
        const cart = await getActiveCart(ApiClientBuilder.currentRoot);
        const currentAmount = Number(amount.textContent);

        if (cart instanceof Error) {
          return;
        }

        let product = cart.lineItems.filter((item) => item.id === id);
        const idProduct = product[0].productId;

        let response = null;

        if (idProduct) {
          response = await addCartItem(ApiClientBuilder.currentRoot, cartID, cartVersion, idProduct, addAmount);
        }

        if (!(response instanceof Error) && response !== null) {
          updateCartCommonQuantity(response);
          product = response.lineItems.filter((item) => item.id === id);
          sum.textContent = `€${product[0].totalPrice.centAmount / 100}`;
        }

        amount.textContent = (currentAmount + 1).toString();
      });
    });
  }
}

export default BasketController;
