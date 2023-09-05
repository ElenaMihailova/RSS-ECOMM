import { ProductProjection } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/product';
import { PageUrls } from '../../../assets/data/constants';
import { QueryArgs } from '../../../types/interfaces';
import { filterProducts, getCategoryId, getProductByProductKey, getProductProjections } from '../../api/apiClient';
import generateCatalogList from '../../components/catalogList/generateCatalogList';
import { getElement, getElementCollection } from '../../helpers/functions';
import Router from '../../router/router';

class CatalogController {
  private router: Router;

  private static activeCategoryId = '';

  private static checkedOriginInputs: string[] = [];

  private static checkedFlavorInputs: string[] = [];

  private static activeSorting = '';

  private static searchWord = '';

  constructor(router: Router) {
    this.router = router;
    this.productItemsHandler();
    this.categoriesHandler();
    this.subcategoriesHandler();
    this.originInputsHandler();
    this.flavorInputsHandler();
    this.sortHandler();
    this.searchHandler();
    this.resetBtnHandler();
  }

  public categoriesHandler(): void {
    const categoryAll = getElement('.category-all__link');
    const categoryClassic = getElement('.category-classic__link');
    const categoryBreakfast = getElement('.category-breakfast__link');
    const categoryFall = getElement('.category-fall__link');
    const categoryClassicList = getElement('.category-classic__list');
    const categoryBreakfastList = getElement('.category-breakfast__list');
    const categoryFallList = getElement('.category-fall__list');

    categoryAll.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      this.removeActiveCondition();
      const searchInput: HTMLInputElement = getElement('.search__input');
      searchInput.value = '';
      categoryAll.classList.add('active');
      CatalogController.searchWord = '';
      const categories = getElementCollection('.subcategory__item');
      categories.forEach((cat) => {
        const categoryHtml = cat as HTMLAnchorElement;
        categoryHtml.classList.add('hidden');
      });
      CatalogController.activeCategoryId = '';

      const queryArgs: QueryArgs = {};

      if (CatalogController.checkedOriginInputs.length) {
        queryArgs.filter = [`variants.attributes.Origin.en-US:${CatalogController.checkedOriginInputs.join(',')}`];
      }

      if (CatalogController.checkedFlavorInputs.length && CatalogController.checkedOriginInputs.length) {
        queryArgs.filter!.push(`variants.attributes.Flavor.en-US:${CatalogController.checkedFlavorInputs.join(',')}`);
      } else if (CatalogController.checkedFlavorInputs.length) {
        queryArgs.filter = [`variants.attributes.Flavor.en-US:${CatalogController.checkedFlavorInputs.join(',')}`];
      }

      if (CatalogController.activeSorting.length) {
        queryArgs.sort = [CatalogController.activeSorting];
      }

      const products = await filterProducts(queryArgs);
      this.setProducts(products);
    });

    categoryClassic.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      this.removeActiveCondition();
      categoryClassic.classList.add('active');
      this.openCategory(categoryClassicList);
      this.filterByCategory('Classic Teas');
    });

    categoryBreakfast.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      this.removeActiveCondition();
      categoryBreakfast.classList.add('active');
      this.openCategory(categoryBreakfastList);
      this.filterByCategory('Breakfast Teas');
    });

    categoryFall.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      this.removeActiveCondition();
      categoryFall.classList.add('active');
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
      this.removeActiveCondition();
      categoryBlack.classList.add('active');
      this.filterByCategory('Black teas');
    });

    categoryChai.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      this.removeActiveCondition();
      categoryChai.classList.add('active');
      this.filterByCategory('Chai');
    });

    categoryGreen.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      this.removeActiveCondition();
      categoryGreen.classList.add('active');
      this.filterByCategory('Green Teas');
    });

    categoryWhite.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      this.removeActiveCondition();
      categoryWhite.classList.add('active');
      this.filterByCategory('White Teas');
    });

    categoryHerbal.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      this.removeActiveCondition();
      categoryHerbal.classList.add('active');
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

          if (CatalogController.searchWord.length) {
            queryArgs['text.en-us'] = CatalogController.searchWord;
          }

          const products = await filterProducts(queryArgs);
          this.setProducts(products);
          return;
        }
        const result = CatalogController.checkedOriginInputs.filter((value) => value !== `"${inputHtml.value}"`);
        CatalogController.checkedOriginInputs = result;

        if (!CatalogController.checkedOriginInputs.length) {
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

          if (CatalogController.searchWord.length) {
            queryArgs['text.en-us'] = CatalogController.searchWord;
          }

          const products = await filterProducts(queryArgs);
          this.setProducts(products);
          return;
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

        if (CatalogController.searchWord.length) {
          queryArgs['text.en-us'] = CatalogController.searchWord;
        }

        const products = await filterProducts(queryArgs);
        this.setProducts(products);
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

          if (CatalogController.searchWord.length) {
            queryArgs['text.en-us'] = CatalogController.searchWord;
          }

          const products = await filterProducts(queryArgs);
          this.setProducts(products);
          return;
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

          if (CatalogController.searchWord.length) {
            queryArgs['text.en-us'] = CatalogController.searchWord;
          }

          const products = await filterProducts(queryArgs);
          this.setProducts(products);
          return;
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

        if (CatalogController.searchWord.length) {
          queryArgs['text.en-us'] = CatalogController.searchWord;
        }

        const products = await filterProducts(queryArgs);
        this.setProducts(products);
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

      const queryBuild = this.queryBuilderForSortSearch(queryArgs);

      if (CatalogController.searchWord.length) {
        queryBuild['text.en-us'] = CatalogController.searchWord;
      }

      const products = await filterProducts(queryBuild);
      this.setProducts(products);
    });
  }

  public searchHandler(): void {
    const searchInput: HTMLInputElement = getElement('.search__input');
    const searchButton = getElement('.search__button');
    searchButton.addEventListener('click', async () => {
      CatalogController.searchWord = searchInput.value;
      const queryArgs: QueryArgs = {
        'text.en-us': searchInput.value.toLowerCase(),
      };

      const queryBuild = this.queryBuilderForSortSearch(queryArgs);

      if (CatalogController.activeSorting.length) {
        queryBuild.sort = [CatalogController.activeSorting];
      }

      const products = await filterProducts(queryBuild);
      this.setProducts(products);
    });
  }

  public resetBtnHandler(): void {
    const resetBtn = getElement('.reset__button');

    resetBtn.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      CatalogController.activeCategoryId = '';
      CatalogController.activeSorting = '';
      CatalogController.checkedFlavorInputs = [];
      CatalogController.checkedOriginInputs = [];
      CatalogController.searchWord = '';
      this.removeActiveCondition();

      const subacategories = getElementCollection('.subcategory__item');
      subacategories.forEach((subcategory) => {
        subcategory.classList.add('hidden');
      });

      const searchInput: HTMLInputElement = getElement('.search__input');
      searchInput.value = '';

      const filters = getElementCollection('.filter__input');
      filters.forEach((filter) => {
        const filterHtml = filter as HTMLInputElement;
        filterHtml.checked = false;
      });

      const menu = getElement('.sort__select');
      const menuHtml = menu as HTMLSelectElement;
      menuHtml.options[0].selected = true;

      const products = await getProductProjections();
      this.setProducts(products);
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

  private async filterByCategory(name: string): Promise<void> {
    const categoryId = await getCategoryId(name);
    CatalogController.searchWord = '';
    CatalogController.activeCategoryId = categoryId;
    const searchInput: HTMLInputElement = getElement('.search__input');
    searchInput.value = '';
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

    if (CatalogController.searchWord.length) {
      queryArgs['text.en-us'] = CatalogController.searchWord;
    }

    const products = await filterProducts(queryArgs);
    this.setProducts(products);
  }

  private queryBuilderForSortSearch(queryArgs: QueryArgs): QueryArgs {
    const queryAdding = { ...queryArgs };

    if (CatalogController.activeCategoryId.length) {
      queryAdding.filter = [`categories.id:"${CatalogController.activeCategoryId}"`];
    }

    if (CatalogController.checkedOriginInputs.length && CatalogController.activeCategoryId.length) {
      queryAdding.filter!.push(`variants.attributes.Origin.en-US:${CatalogController.checkedOriginInputs.join(',')}`);
    } else if (CatalogController.checkedOriginInputs.length) {
      queryAdding.filter = [`variants.attributes.Origin.en-US:${CatalogController.checkedOriginInputs.join(',')}`];
    }

    if (
      CatalogController.checkedFlavorInputs.length &&
      (CatalogController.activeCategoryId.length || CatalogController.checkedOriginInputs.length)
    ) {
      queryAdding.filter!.push(`variants.attributes.Flavor.en-US:${CatalogController.checkedFlavorInputs.join(',')}`);
    } else if (CatalogController.checkedFlavorInputs.length) {
      queryAdding.filter = [`variants.attributes.Flavor.en-US:${CatalogController.checkedFlavorInputs.join(',')}`];
    }

    return queryAdding;
  }

  private removeActiveCondition(): void {
    const allLinks = getElementCollection('.category__link');
    allLinks.forEach((link) => {
      if (link.classList.contains('active')) {
        link.classList.remove('active');
      }
    });
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

  private async setProducts(products: ProductProjection[]): Promise<void> {
    const container = getElement('.catalog__container');
    container.innerHTML = '';

    const catalogList = await generateCatalogList(products);

    container.appendChild(catalogList);
  }
}

export default CatalogController;
