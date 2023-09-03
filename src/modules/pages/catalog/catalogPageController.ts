import { Product, ProductProjection } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/product';
import {
  filterProductsByFlavor,
  filterProductsByOrigin,
  getCategoryId,
  getProductByCategory,
  searchProducts,
  sortProductsByNameAsc,
  sortProductsByNameDesc,
  sortProductsByPriceAsc,
  sortProductsByPriceDesc,
} from '../../api/apiClient';
import { createElement, getElement } from '../../helpers/functions';
import Router from '../../router/router';

class CatalogController {
  private router: Router;

  private static oldState: ProductProjection[] | object = {};

  private static newState: ProductProjection[] | object = {};

  constructor(router: Router) {
    this.router = router;
    // this.viewProducts();
    // this.getCat('Black teas');
    // this.getProductsByCat('Black teas');
    // this.filterByOrigin('China');
    // this.sortProductsByName();
    // this.sortProductsByPrice();
    // this.searchProds('ceylon');
  }

  // private async viewProducts(): Promise<any> {
  //   const catalog: HTMLElement = getElement('.catalog__container');
  //   const products = await getProducts();
  //   console.log(products);
  //   if (Array.isArray(products)) {
  //     products.forEach((product: Product) => {
  //       const productContainer = createElement({
  //         tagName: 'div',
  //         classNames: [`product-${product.key}`],
  //         parent: catalog,
  //       });

  //       createElement({
  //         tagName: 'img',
  //         classNames: [`product-${product.key}__image`],
  //         // attributes: [{src: `${product.masterData.current.masterVariant.images[0]}`}],
  //         parent: productContainer,
  //       });

  //       createElement({
  //         tagName: 'p',
  //         classNames: [`product-${product.key}__title`],
  //         // text: product.masterData.current.metaTitle,
  //         parent: productContainer,
  //       });

  //       createElement({
  //         tagName: 'p',
  //         classNames: [`product-${product.key}__description`],
  //         // text: product.masterData.current.metaDescription,
  //         parent: productContainer,
  //       });

  //       const productPriceContainer = createElement({
  //         tagName: 'div',
  //         classNames: [`product-${product.key}__price-container`],
  //         parent: productContainer,
  //       });

  //       createElement({
  //         tagName: 'p',
  //         classNames: [`product-${product.key}__price`],
  //         // text: product.masterData.current.masterVariant.price,
  //         parent: productPriceContainer,
  //       });

  //       createElement({
  //         tagName: 'img',
  //         classNames: [`product-${product.key}__weight`],
  //         // text: ,
  //         parent: productPriceContainer,
  //       });
  //     });
  //   }
  // }

  private async getCat(name: string): Promise<string | object> {
    const categoryId = await getCategoryId(name);
    return categoryId;
  }

  private async getProductsByCat(name: string): Promise<void> {
    const categoryId = await getCategoryId(name);
    const products = await getProductByCategory(categoryId);
    if (products) {
      CatalogController.newState = products;
    }
  }

  private async filterByOrigin(country: string): Promise<void> {
    const products = await filterProductsByOrigin(country);
    if (products) {
      CatalogController.newState = products;
    }
  }

  private async filterByFlavor(flavor: string): Promise<void> {
    const products = await filterProductsByFlavor(flavor);
    if (products) {
      CatalogController.newState = products;
    }
  }

  private async sortProductsByNameAtoZ(): Promise<void> {
    const products = await sortProductsByNameAsc();
    if (products) {
      CatalogController.newState = products;
    }
  }

  private async sortProductsByNameZtoA(): Promise<void> {
    const products = await sortProductsByNameDesc();
    if (products) {
      CatalogController.newState = products;
    }
  }

  private async sortProductsByPriceUp(): Promise<void> {
    const products = await sortProductsByPriceAsc();
    if (products) {
      CatalogController.newState = products;
    }
  }

  private async sortProductsByPriceDown(): Promise<void> {
    const products = await sortProductsByPriceDesc();
    if (products) {
      CatalogController.newState = products;
    }
  }

  private async searchProds(str: string): Promise<void> {
    const products = await searchProducts(str);
    if (products) {
      CatalogController.newState = products;
    }
  }
}

export default CatalogController;
