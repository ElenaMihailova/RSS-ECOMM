import { ProductProjection } from '@commercetools/platform-sdk';
import { PageUrls } from '../../../assets/data/constants';
import { QueryArgs } from '../../../types/interfaces';
import { createCart, filterProducts, getCategoryId, getProductByProductKey, getProductProjections } from '../../api';
import ApiClientBuilder from '../../api/buildRoot';
import generateCatalogList from '../../components/catalogList/generateCatalogList';
import { getElement, getElementCollection, getFromLS, setToLS } from '../../helpers/functions';
import Router from '../../router/router';
import {
  disablePaginationBtns,
  getCurrentPage,
  getOffset,
  getPagesNum,
  getProductsOnPage,
  resetPage,
  setCurrentPage,
} from './paginationHelpers';
import { addProductWithLoading } from './product/addProductToCart';
import {
  createBreadcrumbLink,
  getBreadcrumbClassLink,
  removeActiveBreadcrumbLinks,
  removeBreadcrumbLinks,
  setActiveBreadcrumbLink,
} from './breadcrumbHelpers';
import { displayProductsSubcategory, clearSearchInput, hideProductsSubcategories } from './catalogHelpers';

class CatalogController {
  private router: Router;

  private static activeCategoryId = '';

  private static checkedOriginInputs: string[] = [];

  private static checkedFlavorInputs: string[] = [];

  private static activeSorting = '';

  private static searchWord = '';

  constructor(router: Router) {
    CatalogController.activeCategoryId = '';
    CatalogController.checkedOriginInputs = [];
    CatalogController.checkedFlavorInputs = [];
    CatalogController.searchWord = '';
    CatalogController.activeSorting = '';
    this.router = router;
    this.categoriesHandler();
    this.subcategoriesHandler();
    this.originInputsHandler();
    this.flavorInputsHandler();
    this.sortHandler();
    this.searchHandler();
    this.resetBtnHandler();
    this.breadcrumbController();
    this.productItemsHandler();
    this.runPaginationHandler();
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
      this.allProductsAction();

      const bcList: HTMLElement = getElement('.breadcrumbs__list');

      if (bcList.childElementCount > 3) {
        removeBreadcrumbLinks(bcList, 2);
      }
    });

    categoryClassic.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      removeActiveBreadcrumbLinks();
      categoryClassic.classList.add('active');
      displayProductsSubcategory(categoryClassicList);
      this.filterByCategory('Classic Teas');
      this.categoryBCHandler('Classic Teas');
    });

    categoryBreakfast.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      removeActiveBreadcrumbLinks();
      categoryBreakfast.classList.add('active');
      displayProductsSubcategory(categoryBreakfastList);
      this.filterByCategory('Breakfast Teas');
      this.categoryBCHandler('Breakfast Teas');
    });

    categoryFall.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      removeActiveBreadcrumbLinks();
      categoryFall.classList.add('active');
      displayProductsSubcategory(categoryFallList);
      this.filterByCategory('Fall Teas');
      this.categoryBCHandler('Fall Teas');
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
      removeActiveBreadcrumbLinks();
      categoryBlack.classList.add('active');
      this.filterByCategory('Black teas');
      this.subcategoryBCHandler('Black teas');
    });

    categoryChai.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      removeActiveBreadcrumbLinks();
      categoryChai.classList.add('active');
      this.filterByCategory('Chai');
      this.subcategoryBCHandler('Chai');
    });

    categoryGreen.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      removeActiveBreadcrumbLinks();
      categoryGreen.classList.add('active');
      this.filterByCategory('Green Teas');
      this.subcategoryBCHandler('Green Teas');
    });

    categoryWhite.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      removeActiveBreadcrumbLinks();
      categoryWhite.classList.add('active');
      this.filterByCategory('White Teas');
      this.subcategoryBCHandler('White Teas');
    });

    categoryHerbal.addEventListener('click', async (e: Event) => {
      e.preventDefault();
      removeActiveBreadcrumbLinks();
      categoryHerbal.classList.add('active');
      this.filterByCategory('Herbal Teas');
      this.subcategoryBCHandler('Herbal Teas');
    });
  }

  public breadcrumbController(): void {
    const homeLink = getElement('.breadcrumbs__home-link');
    const catalogLink = getElement('.breadcrumbs__catalog-link');

    homeLink.addEventListener('click', (e: Event) => {
      e.preventDefault();
      this.router.navigateFromButton(PageUrls.IndexPageUrl);
    });

    catalogLink.addEventListener('click', (e: Event) => {
      e.preventDefault();
      removeActiveBreadcrumbLinks();
      this.allProductsAction();

      const bcList: HTMLElement = getElement('.breadcrumbs__list');

      if (bcList.childElementCount > 3) {
        removeBreadcrumbLinks(bcList, 2);
      }
    });
  }

  public originInputsHandler(): void {
    const originInputs = getElementCollection('.filter-origin__input');

    originInputs.forEach((input) => {
      input.addEventListener('click', async () => {
        const inputHtml = input as HTMLInputElement;

        if (inputHtml.checked) {
          CatalogController.checkedOriginInputs.push(`"${inputHtml.value}"`);

          const queryArgs = this.getOriginQueryArgs();
          await this.setNewProducts(queryArgs);

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
            queryArgs.filter?.push(
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

          await this.setNewProducts(queryArgs);
          return;
        }

        const queryArgs: QueryArgs = this.getOriginQueryArgs();
        await this.setNewProducts(queryArgs);
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

          const queryArgs = this.getFlavorQueryArgs();
          await this.setNewProducts(queryArgs);

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
            queryArgs.filter?.push(
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

          await this.setNewProducts(queryArgs);
          return;
        }
        const queryArgs: QueryArgs = this.getFlavorQueryArgs();

        await this.setNewProducts(queryArgs);
      });
    });
  }

  public getFlavorQueryArgs(): QueryArgs {
    const queryArgs: QueryArgs = {
      filter: [`variants.attributes.Flavor.en-US:${CatalogController.checkedFlavorInputs.join(',')}`],
    };

    if (CatalogController.activeCategoryId.length) {
      queryArgs.filter?.push(`categories.id:"${CatalogController.activeCategoryId}"`);
    }

    if (CatalogController.checkedOriginInputs.length) {
      queryArgs.filter?.push(`variants.attributes.Origin.en-US:${CatalogController.checkedOriginInputs.join(',')}`);
    }

    if (CatalogController.activeSorting.length) {
      queryArgs.sort = [CatalogController.activeSorting];
    }

    if (CatalogController.searchWord.length) {
      queryArgs['text.en-us'] = CatalogController.searchWord;
    }

    return queryArgs;
  }

  public getOriginQueryArgs(): QueryArgs {
    const queryArgs: QueryArgs = {
      filter: [`variants.attributes.Origin.en-US:${CatalogController.checkedOriginInputs.join(',')}`],
    };

    if (CatalogController.activeCategoryId.length) {
      queryArgs.filter?.push(`categories.id:"${CatalogController.activeCategoryId}"`);
    }

    if (CatalogController.checkedFlavorInputs.length) {
      queryArgs.filter?.push(`variants.attributes.Flavor.en-US:${CatalogController.checkedFlavorInputs.join(',')}`);
    }

    if (CatalogController.activeSorting.length) {
      queryArgs.sort = [CatalogController.activeSorting];
    }

    if (CatalogController.searchWord.length) {
      queryArgs['text.en-us'] = CatalogController.searchWord;
    }

    return queryArgs;
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

      await this.setNewProducts(queryBuild);
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

      await this.setNewProducts(queryBuild);
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

      removeActiveBreadcrumbLinks();

      const subacategories = getElementCollection('.subcategory__item');
      subacategories.forEach((subcategory) => {
        subcategory.classList.add('visually-hidden');
      });

      clearSearchInput();

      const filters = getElementCollection('.filter__input');
      filters.forEach((filter) => {
        const filterHtml = filter as HTMLInputElement;
        filterHtml.checked = false;
      });

      const menu = getElement('.sort__select');
      const menuHtml = menu as HTMLSelectElement;
      menuHtml.options[0].selected = true;

      await this.setNewProducts();
    });
  }

  private categoryBCHandler(category: string): void {
    const classLink = getBreadcrumbClassLink(category);

    const bcList: HTMLElement = getElement('.breadcrumbs__list');

    if (bcList.childElementCount === 3) {
      this.createNewLink(bcList, category);
    } else if (bcList.childElementCount > 3) {
      removeBreadcrumbLinks(bcList, 2);
      this.createNewLink(bcList, category);
    }

    const link = getElement(`.breadcrumbs__${classLink}-link`);

    link.addEventListener('click', () => {
      this.filterByCategory(category);
    });
  }

  private subcategoryBCHandler(category: string): void {
    const classLink = getBreadcrumbClassLink(category);

    const bcList: HTMLElement = getElement('.breadcrumbs__list');

    if (bcList.childElementCount === 5) {
      this.createNewLink(bcList, category);
    } else if (bcList.childElementCount > 5) {
      removeBreadcrumbLinks(bcList, 4);
      this.createNewLink(bcList, category);

      const link = getElement(`.breadcrumbs__${classLink}-link`);

      link.addEventListener('click', () => {
        this.filterByCategory(category);
      });
    }
  }

  private createNewLink(parent: HTMLElement, link: string): void {
    const classLink = getBreadcrumbClassLink(link);
    const breadcrumbLink = createBreadcrumbLink(parent, link, classLink);

    breadcrumbLink.addEventListener('click', async () => {
      removeActiveBreadcrumbLinks();
      this.filterByCategory(link);

      setActiveBreadcrumbLink(classLink);

      const bcList: HTMLElement = getElement('.breadcrumbs__list');
      if (
        link === 'Classic Teas' ||
        link === 'Breakfast Teas' ||
        (link === 'Fall Teas' && bcList.childElementCount > 5)
      ) {
        removeBreadcrumbLinks(bcList, 4);
      }
    });
  }

  private async filterByCategory(name: string): Promise<void> {
    const categoryId = await getCategoryId(ApiClientBuilder.currentRoot, name);

    CatalogController.searchWord = '';
    CatalogController.activeCategoryId = categoryId;

    clearSearchInput();

    const queryArgs: QueryArgs = {
      filter: [`categories.id:"${CatalogController.activeCategoryId}"`],
    };

    if (CatalogController.checkedOriginInputs.length) {
      queryArgs.filter?.push(`variants.attributes.Origin.en-US:${CatalogController.checkedOriginInputs.join(',')}`);
    }

    if (CatalogController.checkedFlavorInputs.length) {
      queryArgs.filter?.push(`variants.attributes.Flavor.en-US:${CatalogController.checkedFlavorInputs.join(',')}`);
    }

    if (CatalogController.activeSorting.length) {
      queryArgs.sort = [CatalogController.activeSorting];
    }

    if (CatalogController.searchWord.length) {
      queryArgs['text.en-us'] = CatalogController.searchWord;
    }

    this.setNewProducts(queryArgs);
  }

  private queryBuilderForSortSearch(queryArgs: QueryArgs): QueryArgs {
    const queryAdding = { ...queryArgs };

    if (CatalogController.activeCategoryId.length) {
      queryAdding.filter = [`categories.id:"${CatalogController.activeCategoryId}"`];
    }

    if (CatalogController.checkedOriginInputs.length && CatalogController.activeCategoryId.length) {
      queryAdding.filter?.push(`variants.attributes.Origin.en-US:${CatalogController.checkedOriginInputs.join(',')}`);
    } else if (CatalogController.checkedOriginInputs.length) {
      queryAdding.filter = [`variants.attributes.Origin.en-US:${CatalogController.checkedOriginInputs.join(',')}`];
    }

    if (
      CatalogController.checkedFlavorInputs.length &&
      (CatalogController.activeCategoryId.length || CatalogController.checkedOriginInputs.length)
    ) {
      queryAdding.filter?.push(`variants.attributes.Flavor.en-US:${CatalogController.checkedFlavorInputs.join(',')}`);
    } else if (CatalogController.checkedFlavorInputs.length) {
      queryAdding.filter = [`variants.attributes.Flavor.en-US:${CatalogController.checkedFlavorInputs.join(',')}`];
    }

    return queryAdding;
  }

  private async allProductsAction(): Promise<void> {
    removeActiveBreadcrumbLinks();
    setActiveBreadcrumbLink('all');

    clearSearchInput();
    CatalogController.searchWord = '';

    hideProductsSubcategories();
    CatalogController.activeCategoryId = '';

    const queryArgs: QueryArgs = {};

    if (CatalogController.checkedOriginInputs.length) {
      queryArgs.filter = [`variants.attributes.Origin.en-US:${CatalogController.checkedOriginInputs.join(',')}`];
    }

    if (CatalogController.checkedFlavorInputs.length && CatalogController.checkedOriginInputs.length) {
      queryArgs.filter?.push(`variants.attributes.Flavor.en-US:${CatalogController.checkedFlavorInputs.join(',')}`);
    } else if (CatalogController.checkedFlavorInputs.length) {
      queryArgs.filter = [`variants.attributes.Flavor.en-US:${CatalogController.checkedFlavorInputs.join(',')}`];
    }

    if (CatalogController.activeSorting.length) {
      queryArgs.sort = [CatalogController.activeSorting];
    }

    this.setNewProducts(queryArgs);
  }

  private async productItemsHandler(): Promise<void> {
    const productItems = getElementCollection('.card__link');

    for await (const item of productItems) {
      const productItem = item as HTMLDivElement;
      const productKey = productItem.getAttribute('product-key');
      if (!productKey) {
        return;
      }

      const quantityELement: HTMLElement = getElement(`[product-key=${productKey}] .quantity-container__quantity`);

      item.addEventListener('click', async (e: Event) => {
        const target = e.target as HTMLElement;
        const product = (await getProductByProductKey(ApiClientBuilder.currentRoot, productKey)) as ProductProjection;
        const link = product.slug['en-US'];

        if (!quantityELement.textContent) {
          return;
        }

        if (target.closest('.add-to-cart-button')) {
          const addToCartButton = target.closest('.add-to-cart-button') as HTMLButtonElement;

          if (!getFromLS('cartID')) {
            await this.createNewCart();
          }

          await addProductWithLoading(addToCartButton, product, Number(quantityELement.textContent));

          return;
        }

        if (target.closest('.quantity-container')) {
          const minusBtn: HTMLButtonElement = getElement(`[product-key=${productKey}] .minus-button`);
          const plusBtn: HTMLButtonElement = getElement(`[product-key=${productKey}] .plus-button`);

          let quantity = 1;

          switch (target) {
            case minusBtn:
              quantity = Number(quantityELement.textContent) - 1;
              break;
            case plusBtn:
              quantity = Number(quantityELement.textContent) + 1;
              break;
            default:
              return;
          }

          quantityELement.textContent = quantity.toString();

          minusBtn.disabled = quantity <= 1;

          return;
        }

        this.router.navigateFromButton(`${PageUrls.CatalogPageUrl}/${link}`);
      });
    }
  }

  private async createNewCart(): Promise<void> {
    const cart = await createCart(ApiClientBuilder.currentRoot);

    if (cart instanceof Error) {
      return;
    }

    setToLS('cartID', cart.id);
    setToLS('cartVersion', cart.version.toString());
  }

  public async setNewProducts(query?: QueryArgs): Promise<void> {
    resetPage();
    await this.runPaginationHandler(query);
    await this.setProducts(query);
  }

  private paginationHandlerWrapper: ((e: Event) => Promise<void>) | null = null;

  private async runPaginationHandler(queryArgs?: QueryArgs): Promise<void> {
    const productsData = queryArgs
      ? await filterProducts(ApiClientBuilder.currentRoot, queryArgs)
      : await getProductProjections(ApiClientBuilder.currentRoot);

    const paginationContainer = getElement('.pagination');

    disablePaginationBtns(getPagesNum(productsData.length));

    if (this.paginationHandlerWrapper) {
      paginationContainer.removeEventListener('click', this.paginationHandlerWrapper);
    }

    this.paginationHandlerWrapper = (e: Event): Promise<void> => this.paginationHandler(e, productsData, queryArgs);

    paginationContainer.addEventListener('click', this.paginationHandlerWrapper);
  }

  private async paginationHandler(e: Event, productsData: ProductProjection[], queryArgs?: QueryArgs): Promise<void> {
    const btnPrev = getElement('.prev-button');
    const btnNext = getElement('.next-button');
    const pageNumElement: HTMLDivElement = getElement('.pagination__page-number');

    const target = e.target as HTMLElement;
    const currentPageNum = getCurrentPage();

    let newPageNum: number;

    switch (target) {
      case btnPrev:
        newPageNum = Number(currentPageNum) - 1;
        break;
      case btnNext:
        newPageNum = Number(currentPageNum) + 1;
        break;
      default:
        return;
    }

    pageNumElement.innerHTML = newPageNum.toString();

    setCurrentPage(newPageNum);
    disablePaginationBtns(getPagesNum(productsData.length));
    await this.setProducts(queryArgs);
  }

  public async setProducts(queryArgs?: QueryArgs): Promise<void> {
    const currentPage = getCurrentPage();
    const offset = getOffset(Number(currentPage));

    const productsOnPage = await getProductsOnPage(offset, queryArgs);

    const container = getElement('.catalog-container__products');
    container.innerHTML = '';

    const catalogList = await generateCatalogList(productsOnPage);
    container.appendChild(catalogList);

    this.productItemsHandler();
  }
}

export default CatalogController;
