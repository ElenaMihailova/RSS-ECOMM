import { Cart, LineItem } from '@commercetools/platform-sdk';
import { getElement, getFromLS, displayConfirmModal, updateCartCommonQuantity } from '../../helpers/functions';
import Router from '../../router/router';
import { removeItemFromCart, getActiveCart, addCartItem } from '../../api';
import ApiClientBuilder from '../../api/buildRoot';
import { clearBasket, removeBasketItem } from './basketActions';
import { getProductFromCart, renderCartSumAmount, renderDeliveryAmount, renderItemSumAmount } from './basketHelpers';
import { CartQuantityBtns } from '../../../types/enums';
import { PageUrls } from '../../../assets/data/constants';

class BasketController {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
    this.setCartTotalCost();
    this.runHandlers();
  }

  public async setCartTotalCost(): Promise<void> {
    if (!getFromLS('cartID')) {
      return;
    }
    const activeCart = await getActiveCart(ApiClientBuilder.currentRoot);
    if (!(activeCart instanceof Error)) {
      renderCartSumAmount(activeCart);
      renderDeliveryAmount();
    }
  }

  public runHandlers(): void {
    if (getFromLS('cartID')) {
      this.clearCartBtnHandler();
      this.clearItemHandler();
      this.quantityBtnsHandler();
      this.shoppingBtnHandler();
    } else {
      this.emptyBtnHandler();
    }
  }

  private clearCartBtnHandler(): void {
    const clearCartBtn: HTMLButtonElement = getElement('.sum__clear');

    clearCartBtn.addEventListener('click', async () => {
      const confirm = await displayConfirmModal('Are you sure you want to clear the basket?');
      if (confirm) {
        await clearBasket();
      }
    });
  }

  private clearItemHandler(): void {
    const clearItemButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.buying__button');

    clearItemButtons.forEach((clearItemBtn) => {
      clearItemBtn.addEventListener('click', async (): Promise<void> => {
        const activeCart = await getActiveCart(ApiClientBuilder.currentRoot);
        if (activeCart instanceof Error) {
          return;
        }

        const item: HTMLLIElement | null = clearItemBtn.closest('.buying__item');
        if (!item) {
          return;
        }

        const product: LineItem | undefined = activeCart.lineItems.find((lineItem) => lineItem.id === item.id);

        if (!product) {
          return;
        }

        await removeBasketItem(item, product);
      });
    });
  }

  private async quantityBtnsHandler(): Promise<void> {
    const minusBtns: NodeListOf<HTMLInputElement> = document.querySelectorAll('.minus');
    const plusBtns: NodeListOf<HTMLInputElement> = document.querySelectorAll('.plus');

    minusBtns.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        this.modifyQuantity(btn, CartQuantityBtns.Minus);
      });
    });

    plusBtns.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        this.modifyQuantity(btn, CartQuantityBtns.Plus);
      });
    });
  }

  private async modifyQuantity(btn: HTMLInputElement, action: string): Promise<void> {
    const parent = btn.closest('.buying__item');
    const amount = parent?.querySelector('.quantity') as HTMLDivElement;
    const currentAmount = Number(amount.textContent);

    const id = btn.closest('.buying__item')?.id;

    const cartID = getFromLS('cartID') as string;
    const cartVersion = Number(getFromLS('cartVersion')) || 1;
    let cart: Cart | Error;
    let productID: string | undefined;

    let response = null;

    switch (action) {
      case CartQuantityBtns.Minus:
        if (currentAmount === 1) {
          btn.setAttribute('disable', 'disable');
          return;
        }
        if (id) {
          response = await removeItemFromCart(ApiClientBuilder.currentRoot, cartID, cartVersion, id, 1);
        }
        break;
      case CartQuantityBtns.Plus:
        cart = await getActiveCart(ApiClientBuilder.currentRoot);

        if (cart instanceof Error) {
          return;
        }

        productID = getProductFromCart(cart, id)?.productId;

        if (productID) {
          response = await addCartItem(ApiClientBuilder.currentRoot, cartID, cartVersion, productID, 1);
        }
        break;
      default:
    }

    if (!(response instanceof Error) && response !== null) {
      updateCartCommonQuantity(response);
      renderItemSumAmount(response, parent as HTMLElement, id);
      renderCartSumAmount(response);
    }

    const resultAmount = action === 'minus' ? currentAmount - 1 : currentAmount + 1;
    amount.textContent = resultAmount.toString();
  }

  private shoppingBtnHandler(): void {
    const shoppingBtn: HTMLButtonElement = getElement('.shopping-button');

    shoppingBtn.addEventListener('click', async () => {
      this.router.navigateFromButton(PageUrls.CatalogPageUrl);
    });
  }

  private emptyBtnHandler(): void {
    const emptyBtn: HTMLButtonElement = getElement('.empty-button');

    emptyBtn.addEventListener('click', async () => {
      this.router.navigateFromButton(PageUrls.CatalogPageUrl);
    });
  }
}

export default BasketController;
