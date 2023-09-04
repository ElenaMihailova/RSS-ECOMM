import { ProductProjection } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/product';
import { QueryArgs } from '../../../types/interfaces';
import { filterProducts, getCategoryId } from '../../api/apiClient';
import { getElement, getElementCollection } from '../../helpers/functions';
import Router from '../../router/router';

class CatalogController {
  private router: Router;

  private static activeCategoryId = '';

  private static checkedOriginInputs: string[] = [];

  private static checkedFlavorInputs: string[] = [];

  private static activeSorting = '';

  constructor(router: Router) {
    this.router = router;
    this.categoriesHandler();
    this.subcategoriesHandler();
    this.originInputsHandler();
    this.flavorInputsHandler();
    this.sortHandler();
    this.searchHandler();
  }

  public categoriesHandler(): void {
    const categoryClassic = getElement('.category-classic__link');
    const categoryBreakfast = getElement('.category-breakfast__link');
    const categoryFall = getElement('.category-fall__link');
    const categoryClassicList = getElement('.category-classic__list');
    const categoryBreakfastList = getElement('.category-breakfast__list');
    const categoryFallList = getElement('.category-fall__list');

    categoryClassic.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      this.openCategory(categoryClassicList);
      this.filterByCategory('Classic Teas');
    });

    categoryBreakfast.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      this.openCategory(categoryBreakfastList);
      this.filterByCategory('Breakfast Teas');
    });

    categoryFall.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      this.openCategory(categoryFallList);
      this.filterByCategory('Fall Teas');
    });
  }

  public subcategoriesHandler(): void {
    const categoryBlack = getElement('.category-black__link');
    const categoryChai = getElement('.category-chai__link');
    const categoryGreen = getElement('.category-green__link');
    const categoryWhite = getElement('.category-white__link');
    const categoryHerbal = getElement('.category-herbal__link');

    categoryBlack.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      this.filterByCategory('Black teas');
    });

    categoryChai.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      this.filterByCategory('Chai');
    });

    categoryGreen.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      this.filterByCategory('Green Teas');
    });

    categoryWhite.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      this.filterByCategory('White Teas');
    });

    categoryHerbal.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      this.filterByCategory('Herbal Teas');
    });
  }

  public originInputsHandler(): void {
    const originInputs = getElementCollection('.filter-origin__input');

    originInputs.forEach((input) => {
      input.addEventListener('click', async () => {
        const inputHtml = input as HTMLInputElement;

        if (inputHtml.checked) {
          CatalogController.checkedOriginInputs.push(`"${inputHtml.value}"`);
          const queryArgs: QueryArgs = {
            filter: [`variants.attributes.Origin.en-US:${CatalogController.checkedOriginInputs.join(',')}`],
          };

          if (CatalogController.activeCategoryId.length) {
            queryArgs.filter!.push(`categories.id:"${CatalogController.activeCategoryId}"`);
          }

          if (CatalogController.checkedFlavorInputs.length) {
            queryArgs.filter!.push(
              `variants.attributes.Flavor.en-US:${CatalogController.checkedFlavorInputs.join(',')}`,
            );
          }

          if (CatalogController.activeSorting.length) {
            queryArgs.sort = [CatalogController.activeSorting];
          }

          console.log(queryArgs);
          const products = await filterProducts(queryArgs);
          console.log(products);
          return products;
        }
        const result = CatalogController.checkedOriginInputs.filter((value) => value !== `"${inputHtml.value}"`);
        CatalogController.checkedOriginInputs = result;

        if (!CatalogController.checkedOriginInputs.length) {
          console.log(CatalogController.checkedFlavorInputs);
          const queryArgs: QueryArgs = {};

          if (CatalogController.activeCategoryId.length) {
            queryArgs.filter = [`categories.id:"${CatalogController.activeCategoryId}"`];
          }

          if (CatalogController.checkedFlavorInputs.length && CatalogController.activeCategoryId.length) {
            queryArgs.filter!.push(
              `variants.attributes.Flavor.en-US:${CatalogController.checkedFlavorInputs.join(',')}`,
            );
          } else if (CatalogController.checkedFlavorInputs.length) {
            queryArgs.filter = [`variants.attributes.Flavor.en-US:${CatalogController.checkedFlavorInputs.join(',')}`];
          }

          if (CatalogController.activeSorting.length) {
            queryArgs.sort = [CatalogController.activeSorting];
          }

          const products = await filterProducts(queryArgs);
          console.log(products);
          return products;
        }

        const queryArgs: QueryArgs = {
          filter: [`variants.attributes.Origin.en-US:${CatalogController.checkedOriginInputs.join(',')}`],
        };

        if (CatalogController.activeCategoryId.length) {
          queryArgs.filter!.push(`categories.id:"${CatalogController.activeCategoryId}"`);
        }

        if (CatalogController.checkedFlavorInputs.length) {
          queryArgs.filter!.push(`variants.attributes.Flavor.en-US:${CatalogController.checkedFlavorInputs.join(',')}`);
        }

        if (CatalogController.activeSorting.length) {
          queryArgs.sort = [CatalogController.activeSorting];
        }

        const products = await filterProducts(queryArgs);
        console.log(products);
        return products;
      });
    });
  }

  public flavorInputsHandler(): void {
    const flavorInputs = getElementCollection('.filter-flavor__input');

    flavorInputs.forEach((input) => {
      input.addEventListener('click', async () => {
        const inputHtml = input as HTMLInputElement;

        if (inputHtml.checked) {
          CatalogController.checkedFlavorInputs.push(`"${inputHtml.value}"`);
          const queryArgs: QueryArgs = {
            filter: [`variants.attributes.Flavor.en-US:${CatalogController.checkedFlavorInputs.join(',')}`],
          };

          if (CatalogController.activeCategoryId.length) {
            queryArgs.filter!.push(`categories.id:"${CatalogController.activeCategoryId}"`);
          }

          if (CatalogController.checkedOriginInputs.length) {
            queryArgs.filter!.push(
              `variants.attributes.Origin.en-US:${CatalogController.checkedOriginInputs.join(',')}`,
            );
          }

          if (CatalogController.activeSorting.length) {
            queryArgs.sort = [CatalogController.activeSorting];
          }

          const products = await filterProducts(queryArgs);
          console.log(products);
          return products;
        }
        const result = CatalogController.checkedFlavorInputs.filter((value) => value !== `"${inputHtml.value}"`);
        CatalogController.checkedFlavorInputs = result;

        if (!CatalogController.checkedFlavorInputs.length) {
          const queryArgs: QueryArgs = {};

          if (CatalogController.activeCategoryId.length) {
            queryArgs.filter = [`categories.id:"${CatalogController.activeCategoryId}"`];
          }

          if (CatalogController.checkedOriginInputs.length && CatalogController.activeCategoryId.length) {
            queryArgs.filter!.push(
              `variants.attributes.Origin.en-US:${CatalogController.checkedOriginInputs.join(',')}`,
            );
          } else if (CatalogController.checkedOriginInputs.length) {
            queryArgs.filter = [`variants.attributes.Origin.en-US:${CatalogController.checkedOriginInputs.join(',')}`];
          }

          if (CatalogController.activeSorting.length) {
            queryArgs.sort = [CatalogController.activeSorting];
          }

          const products = await filterProducts(queryArgs);
          console.log(products);
          return products;
        }
        const queryArgs: QueryArgs = {
          filter: [`variants.attributes.Flavor.en-US:${CatalogController.checkedFlavorInputs.join(',')}`],
        };

        if (CatalogController.activeCategoryId.length) {
          queryArgs.filter!.push(`categories.id:"${CatalogController.activeCategoryId}"`);
        }

        if (CatalogController.checkedOriginInputs.length) {
          queryArgs.filter!.push(`variants.attributes.Origin.en-US:${CatalogController.checkedOriginInputs.join(',')}`);
        }

        if (CatalogController.activeSorting.length) {
          queryArgs.sort = [CatalogController.activeSorting];
        }

        const products = await filterProducts(queryArgs);
        console.log(products);
        return products;
      });
    });
  }

  public sortHandler(): void {
    const menu = getElement('.sort__select');
    const menuHtml = menu as HTMLSelectElement;

    menuHtml.addEventListener('change', async () => {
      CatalogController.activeSorting = menuHtml.value;
      const queryArgs: QueryArgs = {
        sort: [menuHtml.value],
      };

      if (CatalogController.activeCategoryId.length) {
        queryArgs.filter = [`categories.id:"${CatalogController.activeCategoryId}"`];
      }

      if (CatalogController.checkedOriginInputs.length && CatalogController.activeCategoryId.length) {
        queryArgs.filter!.push(`variants.attributes.Origin.en-US:${CatalogController.checkedOriginInputs.join(',')}`);
      } else if (CatalogController.checkedOriginInputs.length) {
        queryArgs.filter = [`variants.attributes.Origin.en-US:${CatalogController.checkedOriginInputs.join(',')}`];
      }

      if (
        CatalogController.checkedFlavorInputs.length &&
        (CatalogController.activeCategoryId.length || CatalogController.checkedOriginInputs.length)
      ) {
        queryArgs.filter!.push(`variants.attributes.Flavor.en-US:${CatalogController.checkedFlavorInputs.join(',')}`);
      } else if (CatalogController.checkedFlavorInputs.length) {
        queryArgs.filter = [`variants.attributes.Flavor.en-US:${CatalogController.checkedFlavorInputs.join(',')}`];
      }

      const products = await filterProducts(queryArgs);
      console.log(products);
      return products;
    });
  }

  public searchHandler(): void {
    const searchInput: HTMLInputElement = getElement('.search__input');
    const searchButton = getElement('.search__button');
    searchButton.addEventListener('click', async () => {
      const queryArgs: QueryArgs = {
        'text.en-us': searchInput.value.toLowerCase(),
      };

      if (CatalogController.activeCategoryId.length) {
        queryArgs.filter = [`categories.id:"${CatalogController.activeCategoryId}"`];
      }

      if (CatalogController.checkedOriginInputs.length && CatalogController.activeCategoryId.length) {
        queryArgs.filter!.push(`variants.attributes.Origin.en-US:${CatalogController.checkedOriginInputs.join(',')}`);
      } else if (CatalogController.checkedOriginInputs.length) {
        queryArgs.filter = [`variants.attributes.Origin.en-US:${CatalogController.checkedOriginInputs.join(',')}`];
      }

      if (
        CatalogController.checkedFlavorInputs.length &&
        (CatalogController.activeCategoryId.length || CatalogController.checkedOriginInputs.length)
      ) {
        queryArgs.filter!.push(`variants.attributes.Flavor.en-US:${CatalogController.checkedFlavorInputs.join(',')}`);
      } else if (CatalogController.checkedFlavorInputs.length) {
        queryArgs.filter = [`variants.attributes.Flavor.en-US:${CatalogController.checkedFlavorInputs.join(',')}`];
      }

      if (CatalogController.activeSorting.length) {
        queryArgs.sort = [CatalogController.activeSorting];
      }

      const products = await filterProducts(queryArgs);
      console.log(products);
      return products;
    });
  }

  private openCategory(category: Element): void {
    const categories = getElementCollection('.subcategory__item');
    categories.forEach((cat) => {
      const categoryHtml = cat as HTMLAnchorElement;
      categoryHtml.classList.add('hidden');
    });
    if (category.classList.contains('hidden')) {
      category.classList.remove('hidden');
    } else {
      category.classList.add('hidden');
    }
  }

  private async filterByCategory(name: string): Promise<ProductProjection[]> {
    const categoryId = await getCategoryId(name);
    CatalogController.activeCategoryId = categoryId;
    const queryArgs: QueryArgs = {
      filter: [`categories.id:"${CatalogController.activeCategoryId}"`],
    };

    if (CatalogController.checkedOriginInputs.length) {
      queryArgs.filter!.push(`variants.attributes.Origin.en-US:${CatalogController.checkedOriginInputs.join(',')}`);
    }

    if (CatalogController.checkedFlavorInputs.length) {
      queryArgs.filter!.push(`variants.attributes.Flavor.en-US:${CatalogController.checkedFlavorInputs.join(',')}`);
    }

    if (CatalogController.activeSorting.length) {
      queryArgs.sort = [CatalogController.activeSorting];
    }

    const products = await filterProducts(queryArgs);
    console.log(products);
    return products;
  }
}

export default CatalogController;
