import { ProductProjection } from '@commercetools/platform-sdk';
import { getElement, getFromLS, setToLS } from '../../helpers/functions';
import ApiClientBuilder from '../../api/buildRoot';
import { filterProducts, getProductProjections } from '../../api';
import { QueryArgs } from '../../../types/interfaces';

const paginationLimit = 6;

export const getCurrentPage = (): string => {
  return getFromLS('currentPage') || '1';
};

export const getOffset = (currentPage: number): number => {
  return currentPage * paginationLimit - 6;
};

export const setCurrentPage = (page: number): void => {
  setToLS('currentPage', page.toString());
};

export const getPagesNum = (allProducts: number): number => {
  return Math.ceil(allProducts / paginationLimit);
};

export const getProductsOnPage = async (offset: number, queryArgs?: QueryArgs): Promise<ProductProjection[]> => {
  let productsOnPage: ProductProjection[] | Error;

  if (queryArgs) {
    const query = queryArgs;

    query.withTotal = false;
    query.limit = paginationLimit;
    query.offset = offset;

    productsOnPage = await filterProducts(ApiClientBuilder.currentRoot, query);
  } else {
    const query = {
      withTotal: false,
      limit: paginationLimit,
      offset,
    };

    productsOnPage = await getProductProjections(ApiClientBuilder.currentRoot, query);
  }

  return productsOnPage;
};

export const resetPage = (): void => {
  const btnPrev: HTMLButtonElement = getElement('.prev-button');
  const btnNext: HTMLButtonElement = getElement('.next-button');
  const pageNumElement: HTMLDivElement = getElement('.pagination__page-number');

  btnPrev.disabled = true;
  btnNext.disabled = false;
  pageNumElement.textContent = '1';
  setToLS('currentPage', '1');
};

export const disablePaginationBtns = (pages: number): void => {
  const btnPrev: HTMLButtonElement = getElement('.prev-button');
  const btnNext: HTMLButtonElement = getElement('.next-button');
  const pageNumElement: HTMLDivElement = getElement('.pagination__page-number');
  const currentPage = Number(pageNumElement.textContent);

  if (pages <= 1) {
    btnNext.disabled = true;
    btnPrev.disabled = true;
    pageNumElement.textContent = pages.toString();
    return;
  }

  if (currentPage > 1 && currentPage < pages) {
    btnNext.disabled = false;
    btnPrev.disabled = false;
    return;
  }

  btnNext.disabled = currentPage >= pages;
  btnPrev.disabled = currentPage <= 1;
};
