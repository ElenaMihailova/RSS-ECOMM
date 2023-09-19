import { PageUrls } from '../../../assets/data/constants';
import { getElement, getFromLS } from '../../helpers/functions';
import Router from '../../router/router';
import clearBasket from './clearBasket';

class BasketController {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
    this.runHandlers();
  }

  public runHandlers(): void {
    if (getFromLS('cartID')) {
      this.clearCartBtnHandler();
      this.backToShoppingHandler();
    }
  }

  private clearCartBtnHandler(): void {
    const clearCartBtn: HTMLButtonElement = getElement('.sum__clear');

    clearCartBtn.addEventListener('click', async () => {
      await clearBasket();
    });
  }

  private backToShoppingHandler(): void {
    const btn = getElement('.sum__link');

    btn.addEventListener('click', () => {
      this.router.navigateFromButton(PageUrls.CatalogPageUrl);
    });
  }
}

export default BasketController;
