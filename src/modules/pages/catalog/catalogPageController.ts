import { ProductProjection } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/product';
import {
  filterProductsByOrigin,
  getCategoryId,
  getProductByCategory,
  getProductProjections,
  searchProducts,
  sortProductsByNameAsc,
  sortProductsByPriceAsc,
  sortProductsByPriceDesc,
} from '../../api/apiClient';
import { getElement } from '../../helpers/functions';
import Router from '../../router/router';

class CatalogController {
  private router: Router;

  private static currentState: ProductProjection[] | [] = [];

  private static newState: ProductProjection[] | [] = [];

  constructor(router: Router) {
    this.router = router;
  }

  public async filterProductsByCategory(
    name: string,
    currentProducts: ProductProjection[],
  ): Promise<ProductProjection[] | []> {
    const categoryId = await getCategoryId(name);
    const products = (await getProductByCategory(categoryId)) as ProductProjection[];
    const result = this.filterState(currentProducts, products);

    return result;
  }

  public async filterProductsByAttribute(
    filterParam: string,
    filterMethod: (param: string) => Promise<ProductProjection[] | object>,
    currentProducts: ProductProjection[],
  ): Promise<ProductProjection[] | []> {
    const products = (await filterMethod(filterParam)) as ProductProjection[];
    const result = this.filterState(currentProducts, products);

    return result;
  }

  public async sortProducts(
    currentProducts: ProductProjection[],
    sortMethod: () => Promise<ProductProjection[] | object>,
  ): Promise<ProductProjection[]> {
    const products = (await sortMethod()) as ProductProjection[];
    const result = this.filterState(products, currentProducts);

    return result;
  }

  public async searchProducts(str: string, currentProducts: ProductProjection[]): Promise<ProductProjection[] | []> {
    const products = (await searchProducts(str)) as ProductProjection[];
    const result = this.filterState(currentProducts, products);

    return result;
  }

  private filterState(currentProducts: ProductProjection[], apiProducts: ProductProjection[]): ProductProjection[] {
    const idsArr: string[] = [];
    apiProducts.forEach((product) => idsArr.push(product.id));
    const result: ProductProjection[] = [];
    currentProducts.forEach((product) => {
      const { id } = product;
      if (idsArr.includes(id)) {
        result.push(product);
      }
    });

    return result;
  }

  // public categoriesListHandler(): void {
  //   const categoryClassic = getElement('.catalog__category-classic');
  //   const categoryBreakfast = getElement('.catalog__category-breakfast');
  //   const categoryFall = getElement('.catalog__category-fall');
  //   const categoryClassicList = getElement('.category-classic__list');
  //   const categoryBreakfastList = getElement('.category-breakfast__list');
  //   const categoryFallList = getElement('.category-fall__list');

  //   categoryClassic.addEventListener('toggle', () => {
  //     if (categoryClassicList.classList.contains('hidden')) {
  //       categoryClassicList.classList.remove('hidden');
  //     } else {
  //       categoryClassicList.classList.add('hidden');
  //     }
  //   });
  // }

  // public async test(): Promise<void> {
  //   const products = await getProductProjections();
  //   const newProducts = await this.filterProductsByCategory('Breakfast Teas', products as ProductProjection[]);
  //   const sortnewProducts = await this.sortProducts(newProducts, sortProductsByPriceDesc);
  //   const newsortProducts = await this.sortProducts(sortnewProducts, sortProductsByNameAsc);
  //   console.log(newsortProducts);
  //   const filternewsortProducts = await this.filterProductsByAttribute(
  //     'India',
  //     filterProductsByOrigin,
  //     newsortProducts,
  //   );
  //   console.log(filternewsortProducts);
  // }
}

export default CatalogController;
