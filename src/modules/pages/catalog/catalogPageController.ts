import { Product, ProductProjection } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/product';
import {
  filterProductsByOrigin,
  getCategoryId,
  getProductByCategory,
  getProductProjections,
  searchProducts,
  sortProductsByNameAsc,
  sortProductsByNameDesc,
  sortProductsByPriceAsc,
} from '../../api/apiClient';
import { createElement, getElement } from '../../helpers/functions';
import Router from '../../router/router';

class CatalogController {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
    // this.viewProducts();
    // this.getCat('Black teas');
    // this.getProductsByCat('Black teas');
    // this.filterByOrigin('China');
    // this.sortProductsByName();
    // this.sortProductsByPrice();
    // this.searchProds('ceylon');
    this.getProducts();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async viewProducts(): Promise<any> {
    const catalog: HTMLElement = getElement('.catalog__container');
    const products = await getProductProjections();
    console.log(products);
    if (Array.isArray(products)) {
      products.forEach((product: Product) => {
        const productContainer = createElement({
          tagName: 'div',
          classNames: [`product-${product.key}`],
          parent: catalog,
        });

        createElement({
          tagName: 'img',
          classNames: [`product-${product.key}__image`],
          // attributes: [{src: `${product.masterData.current.masterVariant.images[0]}`}],
          parent: productContainer,
        });

        createElement({
          tagName: 'p',
          classNames: [`product-${product.key}__title`],
          // text: product.masterData.current.metaTitle,
          parent: productContainer,
        });

        createElement({
          tagName: 'p',
          classNames: [`product-${product.key}__description`],
          // text: product.masterData.current.metaDescription,
          parent: productContainer,
        });

        const productPriceContainer = createElement({
          tagName: 'div',
          classNames: [`product-${product.key}__price-container`],
          parent: productContainer,
        });

        createElement({
          tagName: 'p',
          classNames: [`product-${product.key}__price`],
          // text: product.masterData.current.masterVariant.price,
          parent: productPriceContainer,
        });

        createElement({
          tagName: 'img',
          classNames: [`product-${product.key}__weight`],
          // text: ,
          parent: productPriceContainer,
        });
      });
    }
  }

  private async getCat(name: string): Promise<string | object> {
    const categoryId = await getCategoryId(name);
    return categoryId;
  }

  private async getProductsByCat(name: string): Promise<ProductProjection[] | object> {
    const categoryId = await getCategoryId(name);
    const products = await getProductByCategory(categoryId);
    return products;
  }

  private async filterByOrigin(country: string): Promise<ProductProjection[] | object> {
    const products = await filterProductsByOrigin(country);
    return products;
  }

  private async sortProductsByName(): Promise<ProductProjection[] | object> {
    const products = await sortProductsByNameDesc();
    return products;
  }

  private async sortProductsByPrice(): Promise<ProductProjection[] | object> {
    const products = await sortProductsByPriceAsc();
    return products;
  }

  private async searchProds(str: string): Promise<ProductProjection[] | object> {
    const products = await searchProducts(str);
    return products;
  }

  private async getProducts(): Promise<ProductProjection[] | object> {
    const products = await getProductProjections();
    console.log(products);
    return products;
  }
}

export default CatalogController;
