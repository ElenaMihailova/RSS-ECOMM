import { ProductProjection } from '@commercetools/platform-sdk';
import { getElementCollection } from '../../helpers/functions';
import Router from '../../router/router';
import { getProductByProductKey } from '../../api/apiClient';
import { PageUrls } from '../../../assets/data/constants';

class CatalogController {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
    this.productItemsHandler();
  }

  private productItemsHandler(): void {
    const productItems = getElementCollection('.catalog__item a');

    productItems.forEach((item) => {
      const productItem = item as HTMLDivElement;
      const productKey = productItem.getAttribute('product-key');
      if (!productKey) {
        return;
      }

      item.addEventListener('click', async () => {
        const product = (await getProductByProductKey(productKey)) as ProductProjection;
        const link = product.slug['en-US'];
        this.router.navigateFromButton(`${PageUrls.CatalogPageUrl}/${link}`);
      });
    });
  }
}

export default CatalogController;
