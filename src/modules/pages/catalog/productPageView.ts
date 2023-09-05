import { Product, ProductData, ProductProjection } from '@commercetools/platform-sdk';
import PageView from '../../core/pageView';
import { createElement } from '../../helpers/functions';
import { getProductByProductUrl, getProductProjections } from '../../api/apiClient';
import Router from '../../router/router';

class ProductView extends PageView {
  private router: Router;

  private link: string;

  private static product: ProductProjection;

  constructor(router: Router, link: string) {
    super();
    this.router = router;
    this.link = link;
    this.getProduct();
    this.render(ProductView.product);
  }

  private async getProduct(): Promise<void> {
    const product = (await getProductByProductUrl(this.link)) as ProductProjection;
    ProductView.product = product;
  }

  public render(item: ProductProjection): HTMLElement {
    const container = createElement({
      tagName: 'div',
      text: ProductView.product.name['en-US'],
    });

    return container;
  }
}

export default ProductView;
