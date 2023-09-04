import { ProductProjection } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/product';
// import { QueryArgs } from '../../../types/interfaces';
// import { filterProducts, getCategoryId } from '../../api/apiClient';
import { getElement, getElementCollection } from '../../helpers/functions';
import Router from '../../router/router';
import { getProductByProductKey } from '../../api/apiClient';

class CatalogController {
  private router: Router;

  private static activeCategoryId = '';

  private static checkedOriginInputs: string[] = [];

  private static checkedFlavorInputs: string[] = [];

  private static activeSorting = '';

  private static searchValue = '';

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
        this.router.navigateFromButton('p');
      });
    });
  }
}

export default CatalogController;
