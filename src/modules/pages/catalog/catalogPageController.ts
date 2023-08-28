import { Product } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/product';
import { getProducts } from '../../api/apiClient';
import { createElement, getElement } from '../../helpers/functions';
import Router from '../../router/router';

class CatalogController {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
    this.viewProducts();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async viewProducts(): Promise<any> {
    const catalog: HTMLElement = getElement('.catalog__container');
    const products = await getProducts();
    console.log(products);
    if (Array.isArray(products)) {
      products.forEach((product: Product) => {
        const productContainer = createElement({
          tagName: 'div',
          classNames: [`product-${product.key}`],
          parent: catalog,
        });

        const productImage = createElement({
          tagName: 'img',
          classNames: [`product-${product.key}__image`],
          // attributes: [{src: `${product.masterData.current.masterVariant.images[0]}`}],
          parent: productContainer,
        });


      });
    }
  }
}

export default CatalogController;
