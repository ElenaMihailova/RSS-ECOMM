import { AnonymousAuthMiddlewareOptions, RefreshAuthMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { Flavors, Origins, SortMethods, SortOptions } from '../../assets/data/constants';
import { getProductProjections } from '../api/apiCatalog';
import ApiClientBuilder, { scopes } from '../api/buildRoot';
import MyTokenCache from '../api/myTokenCache';
import generateCatalogList from '../components/catalogList/generateCatalogList';
import { createElement, getFromLS, setToLS } from '../helpers/functions';

const catalogWrapper = async (): Promise<HTMLElement> => {
  const container = createElement({
    tagName: 'section',
    classNames: ['catalog__wrap', 'container'],
  });

  const navigationBlock = createElement({
    tagName: 'div',
    classNames: ['catalog__navigation'],
    parent: container,
  });

  const categories = createElement({
    tagName: 'div',
    classNames: ['catalog__categories'],
    parent: navigationBlock,
  });

  const categoriesList = createElement({
    tagName: 'ul',
    classNames: ['catalog__categories-list'],
    parent: categories,
  });

  const categoryAll = createElement({
    tagName: 'li',
    classNames: ['catalog__category-all', 'category__item'],
    parent: categoriesList,
  });

  createElement({
    tagName: 'a',
    classNames: ['category-all__link', 'category__link'],
    text: 'ALL PRODUCTS',
    parent: categoryAll,
  });

  const categoryClassic = createElement({
    tagName: 'li',
    classNames: ['catalog__category-classic', 'category__item'],
    parent: categoriesList,
  });

  createElement({
    tagName: 'a',
    classNames: ['category-classic__link', 'category__link'],
    text: 'CLASSIC TEAS',
    parent: categoryClassic,
  });

  const categoryBreakfast = createElement({
    tagName: 'li',
    classNames: ['catalog__category-breakfast', 'category__item'],
    parent: categoriesList,
  });

  createElement({
    tagName: 'a',
    classNames: ['category-breakfast__link', 'category__link'],
    text: 'BREAKFAST TEAS',
    parent: categoryBreakfast,
  });

  const categoryFall = createElement({
    tagName: 'li',
    classNames: ['catalog__category-fall', 'category__item'],
    parent: categoriesList,
  });

  createElement({
    tagName: 'a',
    classNames: ['category-fall__link', 'category__link'],
    text: 'FALL TEAS',
    parent: categoryFall,
  });

  const classicList = createElement({
    tagName: 'ul',
    classNames: ['category-classic__list', 'subcategory__item', 'visually-hidden'],
    parent: categoryClassic,
  });

  const categoryBlack = createElement({
    tagName: 'li',
    classNames: ['catalog__category-black', 'category__item'],
    parent: classicList,
  });

  createElement({
    tagName: 'a',
    classNames: ['category-black__link', 'category__link'],
    text: 'BLACK TEAS',
    parent: categoryBlack,
  });

  const categoryChai = createElement({
    tagName: 'li',
    classNames: ['catalog__category-chai', 'category__item'],
    parent: classicList,
  });

  createElement({
    tagName: 'a',
    classNames: ['category-chai__link', 'category__link'],
    text: 'CHAI',
    parent: categoryChai,
  });

  const breakfastList = createElement({
    tagName: 'ul',
    classNames: ['category-breakfast__list', 'subcategory__item', 'visually-hidden'],
    parent: categoryBreakfast,
  });

  const categoryGreen = createElement({
    tagName: 'li',
    classNames: ['catalog__category-green', 'category__item'],
    parent: breakfastList,
  });

  createElement({
    tagName: 'a',
    classNames: ['category-green__link', 'category__link'],
    text: 'GREEN TEAS',
    parent: categoryGreen,
  });

  const categoryWhite = createElement({
    tagName: 'li',
    classNames: ['catalog__category-white', 'category__item'],
    parent: breakfastList,
  });

  createElement({
    tagName: 'a',
    classNames: ['category-white__link', 'category__link'],
    text: 'WHITE TEAS',
    parent: categoryWhite,
  });

  const fallList = createElement({
    tagName: 'ul',
    classNames: ['category-fall__list', 'subcategory__item', 'visually-hidden'],
    parent: categoryFall,
  });

  const categoryHerbal = createElement({
    tagName: 'li',
    classNames: ['catalog__category-herbal', 'category__item'],
    parent: fallList,
  });

  createElement({
    tagName: 'a',
    classNames: ['category-herbal__link', 'category__link'],
    text: 'HERBAL TEAS',
    parent: categoryHerbal,
  });

  const filter = createElement({
    tagName: 'div',
    classNames: ['catalog__filter', 'filter'],
    parent: navigationBlock,
  });

  const filterOrigin = createElement({
    tagName: 'div',
    classNames: ['catalog__filter-origin'],
    parent: filter,
  });

  createElement({
    tagName: 'h4',
    classNames: ['filter-origin__title'],
    text: 'ORIGIN',
    parent: filterOrigin,
  });

  const listOrigin = createElement({
    tagName: 'ul',
    classNames: ['filter-origin__list'],
    parent: filterOrigin,
  });

  for (let i = 0; i < Origins.length; i += 1) {
    const originItem = createElement({
      tagName: 'li',
      classNames: ['filter-origin__item'],
      text: Origins[i],
      parent: listOrigin,
    });

    createElement({
      tagName: 'input',
      classNames: ['filter__input', 'filter-origin__input', `input__${Origins[i].toLowerCase()}`],
      attributes: [{ type: 'checkbox' }, { value: `${Origins[i]}` }],
      parentPrepend: originItem,
    });
  }

  const filterFlavor = createElement({
    tagName: 'div',
    classNames: ['catalog__filter-flavor'],
    parent: filter,
  });

  createElement({
    tagName: 'h4',
    classNames: ['filter-flavor__title'],
    text: 'FLAVOR',
    parent: filterFlavor,
  });

  const listFlavor = createElement({
    tagName: 'ul',
    classNames: ['filter-flavor__list'],
    parent: filterFlavor,
  });

  for (let i = 0; i < Flavors.length; i += 1) {
    const flavorItem = createElement({
      tagName: 'li',
      classNames: ['filter-flavor__item'],
      text: Flavors[i],
      parent: listFlavor,
    });

    createElement({
      tagName: 'input',
      classNames: ['filter__input', 'filter-flavor__input', `input__${Flavors[i].toLowerCase()}`],
      attributes: [{ type: 'checkbox' }, { value: `${Flavors[i]}` }],
      parentPrepend: flavorItem,
    });
  }

  createElement({
    tagName: 'button',
    classNames: ['reset__button', 'button'],
    attributes: [{ type: 'button' }],
    text: 'RESET ALL',
    parent: navigationBlock,
  });

  const wrap = createElement({
    tagName: 'div',
    classNames: ['catalog__sortSearch'],
    parent: container,
  });

  const searchContainer = createElement({
    tagName: 'div',
    classNames: ['catalog__search', 'searching'],
    parent: wrap,
  });

  createElement({
    tagName: 'input',
    classNames: ['search__input', 'input'],
    attributes: [{ type: 'search' }],
    parent: searchContainer,
  });

  createElement({
    tagName: 'button',
    classNames: ['search__button', 'button'],
    text: 'Search',
    parent: searchContainer,
  });

  const sorting = createElement({
    tagName: 'div',
    classNames: ['catalog__sort', 'sorting'],
    parent: wrap,
  });

  const sortSelect = createElement({
    tagName: 'select',
    classNames: ['sort__select'],
    parent: sorting,
  });

  for (let i = 0; i < SortOptions.length; i += 1) {
    createElement({
      tagName: 'option',
      classNames: ['sort__option'],
      text: `${SortOptions[i]}`,
      attributes: [{ value: `${SortMethods[i]}` }],
      parent: sortSelect,
    });
  }

  const selectTitle = sortSelect.firstChild as HTMLElement;
  selectTitle.setAttribute('selected', 'selected');
  selectTitle.setAttribute('disabled', 'disabled');

  const catalogContainer = createElement({
    tagName: 'div',
    classNames: ['catalog__container'],
    parent: container,
  });

  let productData = null;

  if (!getFromLS('refreshToken')) {
    const tokenCache = new MyTokenCache();

    const options: AnonymousAuthMiddlewareOptions = {
      host: process.env.CTP_AUTH_URL as string,
      projectKey: process.env.CTP_PROJECT_KEY as string,
      credentials: {
        clientId: process.env.CTP_CLIENT_ID as string,
        clientSecret: process.env.CTP_CLIENT_SECRET as string,
      },
      tokenCache,
      scopes,
      fetch,
    };

    ApiClientBuilder.currentRoot = ApiClientBuilder.createApiRootWithAnonymousFlow(options);

    productData = await getProductProjections(ApiClientBuilder.currentRoot);

    const tokenInfo = tokenCache.get();

    if (tokenInfo.token) {
      setToLS('token', tokenInfo.token);
    }

    if (tokenInfo.refreshToken) {
      setToLS('refreshToken', tokenInfo.refreshToken);
    }
  } else {
    const tokenCache = new MyTokenCache();

    const options: RefreshAuthMiddlewareOptions = {
      host: process.env.CTP_AUTH_URL as string,
      projectKey: process.env.CTP_PROJECT_KEY as string,
      credentials: {
        clientId: process.env.CTP_CLIENT_ID as string,
        clientSecret: process.env.CTP_CLIENT_SECRET as string,
      },
      refreshToken: getFromLS('refreshToken') as string,
      tokenCache,
      fetch,
    };

    ApiClientBuilder.currentRoot = ApiClientBuilder.createApiRootWithRefreshFlow(options);

    productData = await getProductProjections(ApiClientBuilder.currentRoot);

    const tokenInfo = tokenCache.get();

    if (tokenInfo.token) {
      setToLS('token', tokenInfo.token);
    }
  }

  const catalogList = await generateCatalogList(productData);

  catalogContainer.appendChild(catalogList);

  return container;
};

export default catalogWrapper;
