import { getElementCollection } from '../../helpers/functions';
import Router from '../../router/router';
import { getProductByProductKey } from '../../api/apiClient';

class CatalogController {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
    this.productItemsHandler();
  }

  private productItemsHandler(): void {
    const productItems = getElementCollection('.catalog__item a');
    console.log(productItems);
    productItems.forEach((item) => {
      const productItem = item as HTMLDivElement;
      const productKey = productItem.getAttribute('product-key');
      if (!productKey) {
        return;
      }
      console.log(productItem.getAttribute('product-key'));
      item.addEventListener('click', async () => {
        await getProductByProductKey(productKey);
        this.router.navigateFromButton('product');
      });
    });
  }
}

export default CatalogController;
