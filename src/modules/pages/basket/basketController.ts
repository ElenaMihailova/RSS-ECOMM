import { LineItem } from '@commercetools/platform-sdk';
import ApiClientBuilder from '../../api/buildRoot';
import { getElement, getFromLS } from '../../helpers/functions';
import Router from '../../router/router';
import { clearBasket, removeBasketItem } from './basketActions';
import { getActiveCart } from '../../api';

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
}

export default BasketController;
